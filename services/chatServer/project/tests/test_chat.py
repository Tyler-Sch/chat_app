import unittest
import flask
from project.tests.base import BaseTestCase
import json
from project.models import *


class TestChatService(BaseTestCase):

    def test_get_login(self):
        response = self.client.get('/chat/login')
        self.assertEqual(response.status_code,200)

    def add_user(self,username, password):
        u = User(username=username,password=password)
        db.session.add(u)
        db.session.commit()
        return u

    def test_create_user(self):
        self.add_user("potato", "chip")

        self.assertEqual(len(User.query.all()),1)
        self.assertEqual(User.query.first().username,'potato')

    def test_create_two_users(self):
        self.add_user("potato","chip")
        self.add_user("chip","chocolate")

        self.assertEqual(len(User.query.all()),2)
        self.assertNotEqual(
            User.query.first().username, User.query.all()[-1].username
            )

    def test_user_wrong_password(self):
        self.add_user("potato","chip")
        with self.client:
            response = self.client.post(
                '/chat/login',
                data=dict(
                    username="potato",
                    password="wrongpassword"
                )
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn('Incorrect password', response.data.decode())
            self.assertIn("text/html", response.headers[0][1])

    def test_user_invalid_username(self):
        self.add_user("potato","chip")
        with self.client:
            response = self.client.post(
                "chat/login",
                data=dict(
                    username="",
                    password="chip"
                )
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn("User not found",response.data.decode())

    def test_user_login(self):
        self.add_user("potato","chip")
        with self.client:
            response = self.client.post(
                "chat/login",
                data=dict(
                    username="potato",
                    password="chip"
                )
            )
            self.assertEqual(response.status_code, 302)

    def test_user_login_get_response(self):
        with self.client:
            response = self.client.get(
                "chat/login"
            )
            response_text = response.data.decode()
            self.assertEqual(response.status_code, 200)
            self.assertIn("Login", response_text)
            self.assertIn("<input name=username", response_text)
            self.assertIn(
                '<input class="input is-large" name="password"',
                response_text
            )

    def test_create_new_user_page_exists(self):
        with self.client:
            response = self.client.get(
                "/chat/newAccount"
            )
            response_text = response.data.decode()
            self.assertEqual(response.status_code, 200)
            self.assertIn('<input name="username"', response_text)

    def test_create_new_users_success(self):
        with self.client:
            response = self.client.post(
                "/chat/newAccount",
                data=dict(
                    username="potato",
                    password="chipz"
                ),
                follow_redirects=False
            )
            self.assertEqual(response.status_code, 302)
            self.assertEqual(len(User.query.filter_by(username="potato").all()),1)
            response = self.client.post(
                "/chat/newAccount",
                data=dict(
                    username="potato1",
                    password="chipz"
                ),
                follow_redirects=False
            )
            self.assertEqual(response.status_code, 302)
            self.assertEqual(
                len(User.query.filter_by(username="potato1").all()), 1
            )
            self.assertEqual(len(User.query.all()), 2)

    def test_create_new_user_already_exists(self):
        with self.client:
            self.add_user("potato","chip")
            response = self.client.post(
                "/chat/newAccount",
                data=dict(
                    username="potato",
                    password="pwordz"
                )
            )
            response_text = response.data.decode()
            self.assertEqual(response.status_code, 200)
            self.assertIn('Name already taken', response_text)

    def test_create_new_message_group(self):

        u = self.add_user("potato","chip")
        with self.client:
            self.assertEqual(flask.session.get('loggedOn'), None)
            response = self.client.get('/chat/group/bunnies')
            self.assertEqual(response.status_code, 302)
            self.assertEqual(flask.session['requested_group'], 'bunnies')
            self.assertIn('/chat/login', response.data.decode())
            message_group = Message_group.query.all()
            self.assertEqual(len(message_group), 0)

            response = self.client.post(
                '/chat/login',
                data=dict(
                    username="potato",
                    password="chip"
                ),
                follow_redirects=False
            )
            response = self.client.get('/chat/group/bunnies')
            message_group = Message_group.query.all()[0]
            self.assertTrue(flask.session['loggedOn'])
            self.assertEqual(flask.session['requested_group'], "bunnies")
            self.assertNotEqual(response.status_code, 404)
            self.assertEqual(len(Message_group.query.all()), 1)
            self.assertIn("potato", message_group.members[0].username)
            self.assertEqual(u.id,message_group.creator)

    def add_user_group_through_server(self, username, password, groupName, create_user=True):
        if create_user == True:
            u = self.add_user(username, password)
        with self.client:
            response = self.client.get(f'/chat/group/{groupName}')
            # message_group = Message_group.query.all()
            response = self.client.post(
                '/chat/login',
                data=dict(
                    username=username,
                    password=password
                ),
                follow_redirects=False
            )
            response = self.client.get(f'/chat/group/{groupName}')

    def test_multiple_member_join_group(self):
        self.add_user_group_through_server('potato', 'chip', 'bunnies')
        self.assertEqual(flask.session.get('loggedOn'), None)
        self.assertEqual(len(Message_group.query.all()), 1)
        self.add_user_group_through_server('potato2', 'chipz', 'bunnies')
        self.assertEqual(len(Message_group.query.first().members), 2)
        list_of_names = [
            ('chocolate', 'chip'),
            ('poker', 'chip'),
            ('shepards','pie'),
            ('tofu', 'fakemeat')
        ]
        for pair in list_of_names:
            self.add_user_group_through_server(pair[0], pair[1], 'bunnies')

        self.assertEqual(
            len(Message_group.query.filter_by(
                group_name='bunnies'
                ).first().members
            ),
            len(list_of_names) + 2
        )

    def test_user_can_create_and_join_multiple_groups(self):
        groups_to_join = ["chessclub", "bunny", "megadeathClub"]
        self.add_user('potato', 'chip')
        for group in groups_to_join:
            self.add_user_group_through_server(
                "potato",
                "chip",
                group,
                create_user=False
            )

        self.assertEqual(
            len(User.query.filter_by(username="potato").first().groups),
            len(groups_to_join)
        )

    def test_user_creates_room_logsout_and_comes_back(self):
        u = self.add_user("potato", "chip")
        # Login, create, logout
        with self.client:
            response = self.client.get('/chat/group/bunnies')
            # message_group = Message_group.query.all()
            response = self.client.post(
                '/chat/login',
                data=dict(
                    username="potato",
                    password="chip"
                ),
                follow_redirects=False
            )
            response = self.client.get('/chat/group/bunnies')
            self.assertEqual(flask.session["requested_group"], "bunnies")

            response = self.client.get('/chat/logout')
        # Login, go to group
        with self.client:
            self.assertEqual(flask.session.get("requested_group"), None)
            self.assertIn("bunnies", Message_group.query.first().group_name)
            response = self.client.post(
                '/chat/login',
                data=dict(
                    username="potato",
                    password="chip"
                ),
                follow_redirects=False
            )
            response = self.client.get("/chat/group/bunnies")
            self.assertEqual(
                len(Message_group.query.filter_by(
                    group_name="bunnies"
                ).first().members),
                1
            )

if __name__ == "__main__":
    unittest.main()

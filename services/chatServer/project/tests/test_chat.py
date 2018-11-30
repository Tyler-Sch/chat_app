import unittest
from project.tests.base import BaseTestCase
import json
from project.models import *
from project.application import app


class TestChatService(BaseTestCase):

    def test_get_login(self):
        response = self.client.get('/chat/login')
        self.assertEqual(response.status_code,200)

    def add_user(self,username, password):
        u = User(username=username,password=password)
        db.session.add(u)
        db.session.commit()

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


if __name__ == "__main__":
    unittest.main()

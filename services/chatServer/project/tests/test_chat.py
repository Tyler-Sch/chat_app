import unittest
from project.tests.base import BaseTestCase
import json
from project.models import *


class TestChatService(BaseTestCase):

    def test_get_login(self):
        response = self.client.get('/chat/login')
        self.assertEqual(response.status_code,200)


    def test_create_user(self):
        u = User(username='potato',password='chip')
        db.session.add(u)
        db.session.commit()

        self.assertEqual(len(User.query.all()),1)
        self.assertEqual(User.query.first().username,'potato')

    def test_create_two_users(self):
        u1 = User(username='potato',password='chip')
        u2 = User(username='chip',password='chocolate')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()

        self.assertEqual(len(User.query.all()),2)
        self.assertNotEqual(
            User.query.first().username, User.query.all()[-1].username
            )

    def test_add_user(self):
        with self.client:
            response = self.client.post(
                '/chat/login',
                data=dict(
                    username='potato',
                    password='chip'
                ),
                content_type='application/json',
                follow_redirects=False
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)


if __name__ == "__main__":
    unittest.main()

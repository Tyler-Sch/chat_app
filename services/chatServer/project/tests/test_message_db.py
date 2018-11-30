import unittest
from project.tests.base import BaseTestCase
from project.models import *


class TestMessageDatabase(BaseTestCase):

    def test_is_test_running(self):
        self.assertEqual(0, 0)

    def add_user(self, username, password):
        u = User(username=username,password=password)
        db.session.add(u)
        db.session.commit()
        return u

    def test_user_password_is_hashed_and_check_password_works(self):
        u = self.add_user("potato","chip")
        self.assertFalse(u.user_password_hash == "chip")
        self.assertTrue(u.check_password("chip"))
        self.assertFalse(u.check_password("wrongpassword"))

        u2 = self.add_user("chip","chocolate")
        self.assertFalse(u2.user_password_hash == "chocolate")
        self.assertFalse(
            u2.user_password_hash == u.user_password_hash
        )

    def add_message_group(self,group_name, creator):
        new_message_group = Message_group(
            group_name=group_name,
            creator=creator
        )
        db.session.add(new_message_group)
        db.session.commit()
        return new_message_group

    def test_user_create_message_group(self):
        u = self.add_user("potato","chip")
        new_message_group = self.add_message_group("bunny slayers", u)

        self.assertEqual(len(Message_group.query.all()), 1)
        self.assertEqual(len(new_message_group.members), 1)
        self.assertNotEqual(new_message_group.date_created, None)
        self.assertEqual(new_message_group.time_most_recent_post, None)
        self.assertEqual(new_message_group.creator, u.id)

    def add_message(self, message_group, user, message):
        new_message = Message(message_group, user, message)
        db.session.add(new_message)
        db.session.commit()
        return new_message

    def test_messages_can_be_created(self):
        u = self.add_user("potato","chip")
        message_group = self.add_message_group("bunnies", u)
        new_message = self.add_message(message_group, u, "hi there")

        self.assertEqual(len(message_group.messages), 1)
        self.assertIn("hi there", message_group.messages[0].message)

    def test_multple_users_in_groups(self):
        u = self.add_user("potato","chip")
        message_group = self.add_message_group("bunnies", u)
        members = [("chocolate", "chip"), ("poker","chip"), ("pumpkin", "pie")]
        for member in members:
            new_member = self.add_user(member[0],member[1])
            message_group.members.append(new_member)
        self.assertEqual((len(members) + 1), len(message_group.members))
        member_names = [member.username for member in message_group.members]
        for member in members:
            self.assertIn(member[0], member_names)


if __name__ == "__main__":
    unittest.main()

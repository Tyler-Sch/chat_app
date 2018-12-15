from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False,unique=True)
    create_date = db.Column(db.DateTime,default=datetime.datetime.utcnow)
    session_id = db.Column(db.String)
    user_password_hash = db.Column(db.String(256))

    groups = db.relationship('Message_group', secondary="user_group_table", backref="user", lazy=True)

    def __init__(self, username, password):
        self.username = username
        self.user_password_hash = self.set_password(password)

    def set_password(self, password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.user_password_hash, password)


class Message_group(db.Model):
    __tablename__ = "message_groups"
    group_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    group_name = db.Column(db.String, unique=True)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    time_most_recent_post = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    creator = db.Column(db.Integer, db.ForeignKey('users.id'))

    members = db.relationship("User", secondary="user_group_table")
    messages = db.relationship("Message", backref="message_groups")

    def __init__(self, group_name, creator):
        self.group_name = group_name
        self.creator = creator.id
        self.members.append(creator)

class Message(db.Model):
    __tablename__ = 'messages'
    message_group = db.Column(db.Integer, db.ForeignKey('message_groups.group_id'))
    message_id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey('users.id'))
    message = db.Column(db.String, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __init__(self, message_group, author, message):
        self.message_group = message_group.group_id
        self.author = author.id
        self.message = message

class Room_last_checked(db.Model):
    # currently has no tests
    # also, this is poorly named
    __tablename__ = "previous_user_check"
    user = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    group_name = db.Column(
        db.Integer,
        db.ForeignKey("message_groups.group_id"),
        primary_key=True
    )
    last_checked = db.Column(db.DateTime)

    def __init__(self, user, group):
        self.user = user.id
        self.group_name = group.group_id




user_group = db.Table(
    "user_group_table",
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('group_id',db.Integer, db.ForeignKey('message_groups.group_id'))
)

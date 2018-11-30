from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False,unique=True)
    create_date = db.Column(db.DateTime,default=datetime.datetime.utcnow)
    session_id = db.Column(db.String)
    user_password_hash = db.Column(db.String(256))

    def __init__(self, username, password):
        self.username = username
        self.user_password_hash = self.set_password(password)

    def set_password(self, password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.user_password_hash, password)

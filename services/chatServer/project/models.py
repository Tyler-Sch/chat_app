from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False,unique=True)
    password = db.Column(db.String(128),nullable=False)
    create_date = db.Column(db.DateTime,default=datetime.datetime.utcnow)
    session_id = db.Column(db.String)


    def __init__(self, username, password):
        self.username = username
        self.password = password

from flask import Flask, render_template,jsonify, request
from flask_socketio import SocketIO, join_room, emit
from flask_sqlalchemy import SQLAlchemy
import os
from project.models import *


app = Flask(__name__)
app_settings = os.getenv('APP_SETTINGS')
app.config.from_object(app_settings)
socketio = SocketIO(app)
db.init_app(app)

messages = []

@app.route('/chat')
def index():
    return render_template('index.html', messages=messages)

@app.route('/chat/login',methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        post_data = request.get_json()
        username = post_data.get('username')
        db.session.add(User(username=username))
        db.session.commit()
        return jsonify({
            'success':True
        }), 201
    else:
        return jsonify({
            'success':True
        })


@socketio.on("test")
def on_test(data):
    print(data)
    emit('test_passed',{"didIDoIt":"yesYouDid"},broadcast=True)

@socketio.on('sendMessage')
def message_received(data):
    messages.append(data['message'])
    emit('gotMessage',{"newMessage":data['message']}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')

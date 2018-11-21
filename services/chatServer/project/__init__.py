from flask import Flask, render_template,jsonify
from flask_socketio import SocketIO, join_room, emit


app = Flask(__name__)
socketio = SocketIO(app)

messages = []

@app.route('/')
def index():
    return render_template('index.html',messages=messages)

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

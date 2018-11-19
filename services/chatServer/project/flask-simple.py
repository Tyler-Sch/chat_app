from flask import Flask, render_template,jsonify
from flask_socketio import SocketIO, join_room, emit


app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on("test")
def on_test(data):
    print(data)
    emit('test_passed',{"didIDoIt":"yesYouDid"})

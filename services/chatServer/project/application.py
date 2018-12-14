from flask import Flask, render_template,jsonify, request, session, redirect
from flask import url_for
from flask_session import Session
from flask_socketio import SocketIO, join_room, emit, leave_room
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, current_user, logout_user

import os
from project.models import *


app = Flask(__name__)

app_settings = os.getenv('APP_SETTINGS')
app.config.from_object(app_settings)
app.config['SESSION_TYPE'] = 'filesystem'
socketio = SocketIO(app, manage_session=False)
Session(app)
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)

messages = []

@app.route('/chat')
def index():
    return render_template('index.html', messages=messages)

@app.route('/chat/group/<string:groupName>')
def join_group(groupName):
    session['requested_group'] = groupName
    if current_user.is_authenticated:
        # check if group exists
        if Message_group.query.filter_by(group_name=groupName).all():
            active_group = Message_group.query.filter_by(group_name=groupName).first()
            if current_user in active_group.members:
                return redirect(request.host_url, code=302)
            else:
                active_group.members.append(current_user)
                db.session.commit()
                return redirect(request.host_url, code=302)
        else:
            # create group
            new_group = Message_group(
                group_name=groupName,
                creator=current_user
            )
            db.session.add(new_group)
            db.session.commit()
            return redirect(request.host_url, code=302)
    else:
        return redirect(url_for('login'), code=302)

@app.route('/chat/login',methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        if not User.query.filter_by(username=username).all():
            return render_template('login.html',userNameError=True)
        else:
            u = User.query.filter_by(username=username).first()
            if u.check_password(password):
                login_user(u)
                session['loggedOn'] = True
                if session.get('requested_group'):
                    return redirect(
                        url_for(
                            'join_group',
                            groupName=session['requested_group']
                        ), code=302
                    )
                else:
                    return redirect(request.host_url, code=302)
            else:
                return render_template('login.html',passwordError=True)

    else:
        return render_template('login.html')

@app.route('/chat/logout', methods=["GET"])
def logout():
    session["loggedOn"] = False
    session["requested_group"] = None
    logout_user()
    return redirect(url_for('login'))

@app.route('/chat/newAccount', methods=['GET','POST'])
def create_new_user():
    if request.method == "GET":
        return render_template('newUser.html')
    elif request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        # Does user exist??
        if not User.query.filter_by(username=username).all():
            u = User(username=username,password=password)
            db.session.add(u)
            db.session.commit()
            session['loggedOn'] = True
            login_user(u)
            return redirect(request.host_url, code=302)
        else:
            return render_template("newUser.html",usernameTaken=True)


@socketio.on('connect')
def initConnect():
    user_rooms = current_user.groups
    for room in user_rooms:
        join_room(room.group_name)

    emit('connect_response',{
    'authenticated': current_user.is_authenticated,
    'selectedGroup': session.get('requested_group'),
    'username':current_user.username,
    "userId": current_user.id,
    })
    session["requested_group"] = None

@socketio.on('sendMessage')
def message_received(data):
    targetRoom = Message_group.query.filter_by(group_name=data['targetRoom']).first()
    newMessage = Message(
        message_group=targetRoom,
        author = current_user,
        message = data['message']
    )

    db.session.add(newMessage)
    db.session.commit()
    targetRoom.time_most_recent_post = newMessage.create_time
    db.session.commit()
    emit("newMessage", {
        "targetRoom": data["targetRoom"],
        "message": {
            "author": current_user.username,
            "time": newMessage.create_time.strftime("%I:%M.%S"),
            "message": newMessage.message,
        }
    }, broadcast=True, room=data["targetRoom"])

# @socketio.on("logoff")
# def logoff(data):
#     session['loggedOn'] = False
#     logout_user()
#     emit('logOffProcessed',{"logoffSession":True})

@socketio.on("requestRoomList")
def sendRoomList(data):
    # sort and return room list
    room_list = [{
        "groupName":g.group_name,
        "last_message_time": g.time_most_recent_post,
        "has_checked": True,
    } for g in current_user.groups]

    room_list.sort(key=lambda x: x['last_message_time'], reverse=True)
    for room in room_list:
        room['last_message_time'] = room['last_message_time'].strftime("%I:%M.%S")

    emit("roomListInit", room_list)

@socketio.on("getPeopleList")
def sendPeopleList(data):
    target_room = data['targetRoom']
    message_group = Message_group.query.filter_by(group_name=target_room).first()
    people_list = [i.username for i in message_group.members]
    emit('newPeopleList', {"people": people_list})

@socketio.on("requestMessages")
def getMessages(data):
    # should extend the message time.
    # or at least extend it if it's older than a day
    targetRoom = data['targetRoom']
    mGroup = Message_group.query.filter_by(
        group_name=targetRoom
        ).first().messages[-50:]
    emit("roomMessages", {
        "message_group_name": targetRoom,
        "messages":[
            {"message_id": m.message_id,
            "author": User.query.get(m.author).username,
            "time": m.create_time.strftime("%I:%M.%S"),
            "message": m.message
            } for m in mGroup]
    })


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')

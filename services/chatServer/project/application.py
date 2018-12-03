from flask import Flask, render_template,jsonify, request, session, redirect
from flask import url_for
from flask_session import Session
from flask_socketio import SocketIO, join_room, emit
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
def test_logout():
    session["loggedOn"] = False
    logout_user()
    return "logged out"

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
def testCook():
    emit('connect_response',{
    'authenticated':current_user.is_authenticated,
    'messages':messages,
    'username':current_user.username,
    })

@socketio.on('sendMessage')
def message_received(data):
    messages.append(data['message'])
    emit('gotMessage',{"newMessage":data['message']}, broadcast=True)

@socketio.on("logoff")
def logoff(data):
    session['loggedOn'] = False
    logout_user()
    emit('logOffProcessed',{"logoffSession":True})


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')

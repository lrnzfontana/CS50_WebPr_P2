import os

from flask import Flask, session, request, render_template, redirect
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

channel_list = []
user_list = []


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        return render_template("index.html", channels = channel_list)

    if request.method == 'POST':
        # Add something to prevent sending an empty name
        name = request.form.get("uname")
        session['user_id'] = name
        user_list.append(name)
        return render_template("welcome.html", uname = name, channels = channel_list)

@app.route('/handle_channel', methods=['POST'])
def handle_channel():
    chanName = request.form.get("channame")
    channel_list.append(chanName)
    return render_template("newchannel.html", channel = chanName, channels = channel_list)

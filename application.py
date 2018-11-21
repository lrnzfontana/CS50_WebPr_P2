import os

from flask import Flask, session, request, render_template, redirect
from flask_session import Session
from flask_socketio import SocketIO, emit
from functools import wraps


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

channel_list = []
user_list = []
channel_messages = {}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is not None:
            return render_template("welcome.html", uname = session['user_id'], channels = channel_list)
        return f(*args, **kwargs)
    return decorated_function

@socketio.on("send message")
def mess(data):
    message = data["message"]
    channel = data["channel"]
    # add message:
    channel_messages[channel].append(message)
    emit("receive message", {"message": message}, broadcast=True)


@app.route("/", methods=["GET", "POST"])
@login_required
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
    channel_messages[chanName] = []
    return render_template("newchannel.html", channel = chanName, channels = channel_list)

@app.route("/channel/<string:channame>")
def channelContent(channame):
    return render_template("channel.html", channel = channame, channels = channel_list,
    messages = channel_messages[channame])

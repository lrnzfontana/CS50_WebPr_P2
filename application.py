import os

from flask import Flask, session, request, render_template, redirect, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
import datetime


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

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@socketio.on("send message")
def mess(data):
    tstamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    message = data["message"]
    user = data["user"]
    # Make dictionary(for now only message content, then add user id)
    message_dict = {"content": message, "user": user, "timestamp": tstamp}
    channel = data["channel"]
    # add message (and drop one message if more than 100):
    if len(channel_messages[channel]) > 100:
        del channel_messages[channel][0]
    channel_messages[channel].append(message_dict)
    emit("receive message", {"message": message, "user": user, "timestamp": tstamp}, broadcast=True)


@app.route("/", methods=["GET", "POST"])
def index():

    if session.get("user_id") is not None and session.get("channel") is not None:
        chanName = session.get("channel")
        return redirect(f"/channel/{chanName}")

    # delete channel in session if exists
    session.pop("channel", None)

    if request.method == 'GET':
        if session.get("user_id") is not None:
            return render_template("welcome.html", uname = session['user_id'], channels = channel_list)
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
    return redirect(f"/channel/{chanName}")

@app.route("/channel/<string:channame>")
def channelContent(channame):
    if session.get("user_id") is None:
        return redirect("/")

    # set channnel name
    session['channel'] = channame

    return render_template("channel.html", channel = channame, channels = channel_list,
    messages = channel_messages[channame])

@app.route("/message_list", methods=["POST"])
def message_list():

    # Channel we need message list for
    channel = request.form.get("channel")
    return jsonify({"messages": channel_messages[channel]})
    #return jsonify({"messages": "hello"})

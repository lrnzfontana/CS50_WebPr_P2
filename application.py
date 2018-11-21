import os

from flask import Flask, session, request, render_template, redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel_list = []


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        return render_template("index.html")

    if request.method == 'POST':
        # Add something to prevent sending an empty name
        name = request.form.get("uname")
        return render_template("welcome.html", uname = name)

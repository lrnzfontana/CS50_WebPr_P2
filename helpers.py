from flask import redirect, render_template, request, session, url_for
from functools import wraps

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is not None:
            return render_template("welcome.html", uname = session['user_id'], channels = channel_list)
        return f(*args, **kwargs)
    return decorated_function

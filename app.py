import json
import ssl
import traceback

import os
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session, redirect

from route.attractionsApi import attractionsApi, attractionApi
from route.userApi import userApi
from route.bookingApi import bookingApi
from route.orderApi import ordersApi, orderApi

load_dotenv()


app = Flask(__name__, static_folder="static", static_url_path="/")
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = os.getenv("secretKey")

# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    if "memberEmail" in session:
        return render_template("booking.html")
    else:
        return redirect("/")


@app.route("/thankyou")
def thankyou():
    if "memberEmail" in session:
        return render_template("thankyou.html")
    else:
        return redirect("/")

@app.route("/loaderio-5da265fc51638a363dd0b2da2b3fb294")
def loader():
    return "loaderio-5da265fc51638a363dd0b2da2b3fb294"


# Api
app.register_blueprint(attractionsApi, url_prefix="/api")
app.register_blueprint(attractionApi, url_prefix="/api")
app.register_blueprint(ordersApi, url_prefix="/api")
app.register_blueprint(orderApi, url_prefix="/api")
app.register_blueprint(userApi, url_prefix="/api")
app.register_blueprint(bookingApi, url_prefix="/api")


app.run(host="0.0.0.0", port=3000, debug=True)

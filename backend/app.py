from flask import Flask

server = Flask(__name__)

@server.route("/hello")
def hello():
    return "hello"
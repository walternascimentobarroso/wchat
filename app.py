#!flask/bin/python
import aiml
from flask import Flask
from flask import abort
from flask import jsonify
from flask import make_response
from flask import request
from flask import url_for
from flask_cors import CORS, cross_origin
import os.path

app = Flask(__name__, static_url_path="")
CORS(app)

k = aiml.Kernel()

if os.path.isfile("bot_brain.brn"):
    k.bootstrap(brainFile="bot_brain.brn")
else:
    k.bootstrap(learnFiles="std-startup.xml", commands="load aiml b")
    k.saveBrain("bot_brain.brn")
    
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/chatterbot/api/v1.0/question', methods=['POST'])
def create_task():
    return jsonify({'answer': k.respond(request.form.get("question"))}), 201

if __name__ == '__main__':
    app.run(debug=True)
# This is a sample Python script.
from flask import Flask, send_from_directory
from flask_cors import CORS

from controller.Node_List_Controller import node_controller
from datagpt.controller.Conversation_controller import conversation_controller

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
app = Flask(__name__, static_folder='./webapp/dist/gpt')
CORS(app)

app.register_blueprint(node_controller, url_prefix='/apis/node')
app.register_blueprint(conversation_controller, url_prefix='/apis/conversation')


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def get_static_file(path):
    return send_from_directory(app.static_folder, path)


@app.errorhandler(404)
def not_found_error(error):
    return send_from_directory(app.static_folder, 'index.html')


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

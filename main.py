# This is a sample Python script.
from flask import Flask, send_from_directory
from flask_cors import CORS

from controller.Node_List_Controller import node_controller
from controller.Conversation_controller import conversation_controller
<<<<<<< HEAD
from controller.Github_controller import github_controller
=======
>>>>>>> 3306681168be7baf3f273766e466e8866741e7ad

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
app = Flask(__name__, static_folder='./webapp/dist/gpt')
CORS(app)

app.register_blueprint(node_controller, url_prefix='/apis/node')
app.register_blueprint(conversation_controller, url_prefix='/apis/conversation')
<<<<<<< HEAD
app.register_blueprint(github_controller, url_prefix='/apis/github')
=======
>>>>>>> 3306681168be7baf3f273766e466e8866741e7ad


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
    app.run(host='127.0.0.1', port=8020, debug=True)

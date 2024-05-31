from flask import Blueprint, request

from model import Response
from service import Conversation_service

conversation_controller = Blueprint('conversation_controller', __name__)


@conversation_controller.route('/send', methods=['POST'])
def send_message():
    message = request.get_json()['message']
    node_id = request.get_json()['node_id']
    print(message)
    print(node_id)
    Conversation_service.send_email(node_id, message)
    return Response.success({})

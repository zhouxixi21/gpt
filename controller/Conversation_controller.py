from flask import Blueprint, request

from model import Response
from service import Conversation_service

conversation_controller = Blueprint('conversation_controller', __name__)


@conversation_controller.route('/send', methods=['POST'])
def send_message():
    message_list = request.get_json()
    Conversation_service.send_email(message_list)
    return Response.success({})

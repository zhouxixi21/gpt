from flask import Blueprint, request

from model import Response
from service import Conversation_service

conversation_controller = Blueprint('conversation_controller', __name__)


@conversation_controller.route('/send', methods=['POST'])
def send_message():
    message = request.get_json()['message']
    issue = request.get_json()['issue']
    repo = request.get_json()['repo']
    Conversation_service.send_email(message, issue, repo)
    return Response.success({})

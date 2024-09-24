from flask import Blueprint, request

from datagpt.model import Response
from datagpt.service import Conversation_service

conversation_controller = Blueprint('conversation_controller', __name__)


@conversation_controller.route('/send', methods=['POST'])
def send_message():
    message = request.get_json()['message']
    issue = request.get_json()['issue']
    repo = request.get_json()['repo']
    path = request.get_json()['path']
    Conversation_service.send_email(message, issue, repo, path)
    return Response.success({})

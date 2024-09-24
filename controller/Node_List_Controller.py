from flask import Blueprint, request
from flask_cors import cross_origin

from model import Response
from service import Node_service

node_controller = Blueprint('node_controller', __name__)


@node_controller.route('/list', methods=['GET'])
def get_node_list():
    node_list = Node_service.get_number()
    print(node_list)
    return Response.success(node_list)


@node_controller.route('/get', methods=['GET'])
def get_node():
    node_id = request.args.get('message_id')
    status, last_message = Node_service.check_status(node_id)

    node_item = {"id": node_id, "name": "Bot 1", "status": status, "lastMessage": last_message}

    return Response.success(node_item)


@node_controller.route('/detail', methods=['GET'])
def get_node_detail():
    message_id = request.args.get('message_id')
    return Response.success(Node_service.get_detail(message_id))
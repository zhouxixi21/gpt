from flask import Blueprint, request

from datagpt.model import Response
from datagpt.service import Node_service

node_controller = Blueprint('node_controller', __name__)


@node_controller.route('/list', methods=['GET'])
def get_node_list():
    node_list = [
        {"id": 1, "name": "Bot 1", "status": "Online", "lastMessage": ""},
        {"id": 2, "name": "Bot 2", "status": "Online", "lastMessage": ""},
        {"id": 3, "name": "Bot 3", "status": "Online", "lastMessage": ""},
    ]
    for node_item in node_list:
        node_item['status'], node_item['lastMessage'] = Node_service.check_status(node_item['id'])

    return Response.success(node_list)


@node_controller.route('/get', methods=['GET'])
def get_node():
    node_id = request.args.get('node_id')
    status, last_message = Node_service.check_status(node_id)

    node_item = {"id": node_id, "name": "Bot 1", "status": status, "lastMessage": last_message}

    return Response.success(node_item)


@node_controller.route('/detail', methods=['GET'])
def get_node_detail():
    node_id = request.args.get('node_id')
    return Response.success(Node_service.get_detail(node_id))
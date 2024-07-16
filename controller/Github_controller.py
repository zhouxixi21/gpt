from flask import Blueprint, request

from model import Response

from service import Github_service

github_controller = Blueprint('github_controller', __name__)


@github_controller.route('/getIssueList', methods=['GET'])
def get_issue_list():
    return Response.success(Github_service.get_issue_list())

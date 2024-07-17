import json
import os

from github import Github

from constant.Path_constant import Path_constant


def get_issue_list():
    ghtoken = Path_constant.GIT_TOKEN
    g = Github(ghtoken)
    user = g.get_user()
    issue_list = []
    has_processed_issue_list = []
    file_path = Path_constant.GIT_ISSUE_PATH
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        with open(file_path, 'r') as f:
            has_processed_issue_list = json.load(f)
            f.close()
    issues_assign_to_me = user.get_issues(filter='assigned', state='open')
    for issue in issues_assign_to_me:
        print(issue.repository.full_name)
        issue_format = {'id': issue.id, 'repo': issue.repository.full_name,'number': issue.number, 'title': issue.title, 'body': issue.body}
        if issue_format not in has_processed_issue_list:
            issue_list.append(issue_format)
            has_processed_issue_list.append(issue_format)
    with open(file_path, "w") as file:
        json.dump(has_processed_issue_list, file, indent=4)
        file.close()
    return issue_list



if __name__ == '__main__':
    print(get_issue_list())

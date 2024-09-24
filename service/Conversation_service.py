import json
import os
import uuid
import requests
from constant.Path_constant import Path_constant


def send_email(message, issue, repo, path):

    message_id = str(uuid.uuid1())
    file_path = Path_constant.NODE_CONVERSATION_FILE_PATH
    if os.path.exists(file_path):
        with open(Path_constant.NODE_CONVERSATION_FILE_PATH, 'r') as f:
            content = json.load(f)
            f.close()
    else:
        content = []
    content.append({
        "id": message_id,
        "content": message,
        "issue": issue,
        "repo": repo,
        "path": path
    })
    # TO DO
    # call api for gpt
    with open(file_path, "w") as file:
        json.dump(content, file, indent=4)
        file.close()
    requests.post('http://localhost:8000/develop', json.dumps(content[len(content)-1]))

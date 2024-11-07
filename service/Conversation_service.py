import json
import os
import threading
import uuid
import requests
from constant.Path_constant import Path_constant


def request_develop(form):
    requests.post('http://localhost:8000/develop', form)


def send_email(message_list):
    file_path = Path_constant.NODE_CONVERSATION_FILE_PATH
    if os.path.exists(file_path):
        with open(Path_constant.NODE_CONVERSATION_FILE_PATH, 'r') as f:
            content = json.load(f)
            f.close()
    else:
        content = []
    for messageItem in message_list:
        print(messageItem)
        message_id = str(uuid.uuid1())

        content.append({
            "id": message_id,
            "content": messageItem['message'],
            "issue": messageItem['issue'],
            "repo": messageItem['repo'],
            "path": messageItem['path']
        })
        print(content)
        # TO DO
        # call api for gpt
        with open(file_path, "w") as file:
            json.dump(content, file, indent=4)
            file.close()
        thread = threading.Thread(target=request_develop, args=(json.dumps(content[len(content) - 1]),))
        thread.start()

import json
import os
import uuid

from datagpt.constant.Path_constant import Path_constant


def send_email(node_id, message):
    message_id = str(uuid.uuid1())
    file_path = Path_constant.NODE_CONVERSATION_FILE_PATH.replace("<placeholder>", str(node_id))
    if os.path.exists(file_path):
        with open(Path_constant.NODE_CONVERSATION_FILE_PATH.replace("<placeholder>", str(node_id)), 'r') as f:
            content = json.load(f)
            f.close()
    else:
        content = []
    content.append({
        "id": message_id,
        "content": message
    })
    # TO DO
    # call api for gpt
    with open(file_path, "w") as file:
        json.dump(content, file, indent=4)
        file.close()

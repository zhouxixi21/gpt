import json

from constant.Path_constant import Path_constant

if __name__ == '__main__':
    node_list = [
        {"id": 3, "name": "Bot 3", "status": "Online", "lastMessage": ""},
    ]
    for node in node_list:
        file_path = Path_constant.NODE_CONVERSATION_FILE_PATH.replace("<placeholder>", str(node["id"]))
        gpt_file_path = Path_constant.NODE_GPT_FILE_PATH.replace("<placeholder>", str(node["id"]))
        with open(file_path, "w") as file:
            json.dump([], file, indent=4)
            file.close()
        with open(gpt_file_path, "w") as file:
            file.write('')
            file.close()

    with open(Path_constant.GIT_ISSUE_PATH, "w") as file:
        json.dump([], file, indent=4)
        file.close()
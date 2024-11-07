import json

from constant.Path_constant import Path_constant

if __name__ == '__main__':
    file_path = Path_constant.NODE_CONVERSATION_FILE_PATH
    with open(file_path, "w") as file:
        json.dump([], file, indent=4)
        file.close()
    with open(Path_constant.GIT_ISSUE_PATH, "w") as file:
        json.dump([], file, indent=4)
        file.close()
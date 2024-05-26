import json
import re
import os

from datagpt.constant.Path_constant import Path_constant


def get_content(s):
    start_index = s.find("'")
    content = s[start_index + 1:]
    extract_text = []
    res = []
    while "'" in content:
        end_index = content.find("'")
        extract_text.append(content[:end_index])
        if len(content) == end_index:
            break
        else:
            content = content[end_index+1:]
    need_skip = False
    for i in range(0, len(extract_text)):
        if extract_text[i].endswith('\\') and i < len(extract_text):
            res.append((extract_text[i][:len(extract_text[i]) - 1] + "'" + extract_text[i + 1]).replace('```json', '').replace('```', ''))
            need_skip = True
        elif need_skip is False:
            res.append(extract_text[i].replace('```json', '').replace('```', ''))
        else:
            need_skip = False
    return res


def is_json_string(s):

    try:
        json.loads(s.replace("'", '"').strip())
        return True
    except (ValueError, json.JSONDecodeError):
        return False


def format_task(lines, index, level):

    task = {
        'id': '',
        'internal_id': '',
        'status': 'Waiting',
        'startTime': '',
        'name': '',
        'finishTime': '',
        'response': '',
        'children': []
    }
    i = index
    is_start = False
    has_content = False
    current_level = 1
    while i < len(lines):
        placeholder_pattern = r'\[([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})*?-?(start|end)( [0-9]*-[0-9]*-[0-9]* [0-9]*:[0-9]*:[0-9]*)?\]'
        split = re.split(placeholder_pattern, lines[i])
        if split[0] != '':
            if split[0].strip() != '```' and split[0].strip() != '```json':
                if split[0].startswith('content=') or split[0].startswith('text='):
                    response = split[0]
                    task['response'] = get_content(response)[0].replace('\\n', '\n').replace('\\t', '\t')

                    has_content = True
                elif has_content is False:
                    response = split[0].replace('\\n', '\n').replace('\\t', '\t')
                    task['response'] += response + '\n'
        elif len(split) > 4:
            if split[2] == 'start':
                task['internal_id'] = split[1]
                if level == 0 and is_start is False:
                    if split[1] is not None:
                        task['id'] = split[1]
                        is_start = True
                elif level != 0:
                    task['id'] = level
                if task['status'] == 'Waiting':
                    task['name'] = split[4].strip()
                    task['status'] = 'In Progress'
                    task['startTime'] = split[3]
                else:
                    children_level = str(task['id']) + '-' + str(current_level)
                    task['response'] = ''
                    child_task, i = format_task(lines, i, children_level)
                    if child_task['name'] == 'StrOutputParser':
                        child_task['name'] = 'Execution'
                    if task['name'] == 'RunnableSequence':
                        task['name'] = child_task['name']
                        child_task['name'] = 'Analysing'
                    task['children'].append(child_task)
                    current_level += 1
                    if i > len(lines):
                        return task, i
            elif split[2] == 'end':
                task['status'] = 'Finished'
                task['finishTime'] = split[3]
                return task, i
        i += 1
    return task, len(lines)


def check_status(node_id):
    with open(Path_constant.NODE_CONVERSATION_FILE_PATH.replace("<placeholder>", str(node_id)), 'r') as f:
        data = json.load(f)
        last_id = data[len(data) - 1]['id']
        with open(Path_constant.NODE_GPT_FILE_PATH.replace("<placeholder>", str(node_id)), 'r') as gptf:
            content = gptf.read()
            lines = content.split('\n')
            gptf.close()

            if '['+str(last_id)+'-end' in content:
                tasks = []
                index = 0

                while len(lines) > index:
                    task, index = format_task(lines, index, 0)
                    tasks.append(task)
                    index += 1
                response = tasks[len(tasks) - 1]['response']
                if response == '':
                    print(tasks[len(tasks) - 1])
                    response = ''
                return 'Online', response
            else:
                return 'In Progress', data[len(data) - 1]['content']


def get_detail(node_id):
    with open(Path_constant.NODE_CONVERSATION_FILE_PATH.replace("<placeholder>", str(node_id)), 'r') as f:
        content = json.load(f)
        f.close()
    with open(Path_constant.NODE_GPT_FILE_PATH.replace("<placeholder>", str(node_id)), 'r') as f:
        lines = f.readlines()
        tasks = []
        index = 0
        while len(lines) > index:
            task, index = format_task(lines, index, 0)
            tasks.append(task)
            index += 1
        f.close()
    response = []
    print(json.dumps(tasks, indent=4))
    index = 0
    while index < len(content):
        content_id = content[index]['id']
        response.append({
            'person': 'user',
            'response': content[index]['content']
        })
        task = [task_item for task_item in tasks if task_item['id'] == content_id]
        print(content_id)
        if len(task) == 0:
            response.append({
                'person': 'DEV GPT Agent',
                'response': '',
                'task': []
            })
        else:
            show_task = task[0]['children']
            if task[0]['children'] is None:
                show_task = task
            elif len(task[0]['children']) == 0:
                show_task = task
            response.append({
                'person': 'DEV GPT Agent',
                'response': task[0]['response'],
                'task': show_task
            })
        index += 1
    return response
if __name__ == '__main__':

    text = "Here is a string with a backslash: 'It\\'s easy to use' and another without: 'But it\\'s also easy'"

    # 正则表达式匹配不包含单引号但包含反斜杠的字符串
    print(get_content(text))
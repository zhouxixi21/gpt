import json
import re
import os

from constant.Path_constant import Path_constant




def is_json_string(s):

    try:
        json.loads(s.strip())
        return True
    except (ValueError, json.JSONDecodeError):
        return False


def edit_input_output(task):
    if len(task['input']) > 0:
        task['input'] = task['input'].strip()[10:]
        if task['input'].endswith('"}'):
            task['input'] = task['input'][:len(task['input']) - 2]
    if len(task['output']) > 0:
        task['output'] = task['output'].strip()[11:]
        if task['output'].endswith('"}'):
            task['output'] = task['output'][:len(task['output']) - 2]
    return task


def format_task(lines, index, level):

    task = {
        'id': '',
        'internal_id': '',
        'status': 'Waiting',
        'startTime': '',
        'name': '',
        'finishTime': '',
        'input': '',
        'output': '',
        'summary': '',
        'type': 'Step',
        'description': '',
        'children': []
    }
    i = index
    is_start = False
    has_content = False
    in_input = False
    in_output = False

    current_level = 1
    while i < len(lines):
        placeholder_pattern = r'\[([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})*?-?(start|end)( [0-9]*-[0-9]*-[0-9]* [0-9]*:[0-9]*:[0-9]*)?\]'
        split = re.split(placeholder_pattern, lines[i])
        if split[0] != '':
            if split[0].strip().startswith('{"input":'):
                in_input = True
            if split[0].strip().startswith('{"output":'):
                in_input = False
                in_output = True
            if in_input:
                input_line = split[0]
                task['input'] += input_line
            if in_output:
                task['output'] += split[0]
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
                    title = split[4].strip().split("==>")
                    if len(title) > 2:
                        task['name'] = title[1].strip()
                    else:
                        task['name'] = ''
                    if len(title) > 1:
                        task['type'] = title[0].title()
                    else:
                        task['type'] = ''
                    if len(title) > 3:
                        task['description'] = title[2]
                    else:
                        task['description'] = ''
                    task['status'] = 'In Progress'
                    task['startTime'] = split[3]
                else:
                    children_level = str(task['id']) + '-' + str(current_level)
                    task['input'] = ''
                    task['output'] = ''
                    child_task, i = format_task(lines, i, children_level)
                    if child_task['name'] == 'Summary':
                        task['children'][len(task['children']) - 1]['summary'] = child_task['output']
                    else:
                        task['children'].append(child_task)
                    current_level += 1
                    if i > len(lines):
                        return edit_input_output(task), i
            elif split[2] == 'end':
                task['status'] = 'Finished'
                task['finishTime'] = split[3]
                return edit_input_output(task), i
        i += 1
    return edit_input_output(task), len(lines)


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
                output = tasks[len(tasks) - 1]['output']
                if output == '':
                    output = ''
                return 'Online', output
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
    index = 0
    while index < len(content):
        content_id = content[index]['id']
        response.append({
            'person': 'user',
            'response': content[index]['content']
        })
        task = [task_item for task_item in tasks if task_item['id'] == content_id]
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
                'response': task[0]['output'],
                'task': show_task
            })
        index += 1
    return response


if __name__ == '__main__':
    get_detail(3)

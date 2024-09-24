import time
if __name__ == '__main__':
    with open('./log/template.log', 'r') as f:
        content = f.read()
        content = content.replace("<placeholder>", '11a2ee56-4f0d-11ef-a294-1e006211cf9a')
        content_lines = content.split('\n')
        f.close()
    index = 1
    for line in content_lines:
        with open("./log/node3_gpt.log", "a") as file:
            file.write(line + "\n")
            time.sleep(0.01)
            print('finish insert ' + str(index) + ' line')
            index += 1
            file.close()
        with open('./log/node3_gpt.log', 'r') as f:
            content = f.read()
            print(content)
            f.close()


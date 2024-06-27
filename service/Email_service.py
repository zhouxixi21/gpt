import email
import imaplib
from email.parser import Parser

# 连接到IMAP服务器
mail = imaplib.IMAP4_SSL('outlook.office365.com')

# 登录
mail.login('james1994zhou@hotmail.com', 'Zxt19940304!')

# 选择邮箱
mail.select('gptTest')

result, data = mail.search(None, 'UNSEEN')

for num in data[0].split():
    status, email_data = mail.fetch(num, '(RFC822)')

    email_message = email.message_from_bytes(email_data[0][1])

    for part in email_message.walk():
        if part.get_content_type() == 'text/plain':
            body = part.get_payload(decode=True)
            body_content = str(body, 'utf-8')
            print(body_content)

    # 关闭连接
mail.close()
mail.logout()
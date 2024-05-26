def success(data=None):
    return {
        "code": "0",
        "msg": "success",
        "data": data
    }


def error(msg):
    return {
        "code": "1",
        "msg": msg,
        "data": {}
    }
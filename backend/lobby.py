from user import User

class Lobby(object):
    def __init__(self, id, users: dict, status = "waiting"):
        self.id = id
        self.users = users
        self.completed = 0
        self.status = status
    
    def add_user(self, user: User):
        self.users[user.name] = user
    
    def remove_user(self, user: User):
        self.users.pop(user.name)

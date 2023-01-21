from user import User

class Lobby(object):
    def __init__(self, id, users: list):
        self.id = id
        self.users = users
    
    def add_user(self, user: User):
        self.users.append(user)
    
    def remove_user(self, user: User):
        self.users.remove(user)

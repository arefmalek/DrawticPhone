from user import User

class Lobby(object):
    def __init__(self, id, users: dict, status = "waiting"):
        self.id = id
        self.users = users
        self.completed = 0
        self.status = status
    
    def add_user(self, user: str):
        self.users[user] = User(user)
    
    def remove_user(self, user: User):
        self.users.pop(user.name)

    def json(self):
        sol = dict()
        sol['id'] = self.id
        users_ = dict()
        for attr, value in self.users.items():
            users_[attr] = value.json()
        sol['users'] = users_
        sol['completed'] = self.completed
        sol['status'] = self.status
        return sol

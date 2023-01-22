from user import User


class Lobby(object):
    def __init__(self, id, users: dict, status="waiting"):
        self.id = id
        self.users = users
        self.completed = 0
        self.status = status

    def add_user(self, user: str):
        self.users[user] = User(user)

    def remove_user(self, user: str):
        self.users[user] = User(user)

    def start_game(self):
        self.completed = 0
        self.status = 'prompts'

    def draw_phase(self):
        self.completed = 0
        self.status = 'draw'

    def guess_phase(self):
        self.completed = 0
        self.status = 'guess'
    
    def result_phase(self):
        self.completed = 0
        self.status = 'results'

    # def results page

    def submit_prompt(self, user: str, prompt: str):
        self.users[user].set_prompt(prompt)
        self.completed += 1

    def submit_drawing(self, user: str, image_url: str):
        self.users[user].set_image_url(image_url)
        self.completed += 1

    def submit_guess(self, user: str, guess: str):
        if self.users[user].guess == "":
            self.completed += 1
        self.users[user].set_guess(guess)

    def check_complete(self):
        return self.completed == len(self.users.keys())

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

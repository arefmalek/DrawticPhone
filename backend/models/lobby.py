class Lobby(object):
    def __init__(self, id, completed=0, status='waiting'):
        self.id = id
        self.completed = completed
        self.status = status

    def startGame(self):
        self.completed = 0
        self.status = 'prompts'

    def drawPhase(self):
        self.completed = 0
        self.status = 'draw'

    def guessPhase(self):
        self.completed = 0
        self.status = 'guess'

    def resultPhase(self):
        self.completed = 0
        self.status = 'results'
    
    def mapping(self):
        ret = dict()
        ret['id'] = self.id
        ret['completed'] = self.completed
        ret['status'] = self.status
        return ret

    # def results page

    # def submitPrompt(self, user: str, prompt: str):
    #     self.users[user].setPrompt(prompt)
    #     self.completed += 1

    # def submitDrawing(self, user: str, image_url: str):
    #     self.users[user].setImageUrl(image_url)
    #     self.completed += 1

    # def submitGuess(self, user: str, guess: str):
    #     if self.users[user].guess == "":
    #         self.completed += 1
    #     self.users[user].set_guess(guess)

    # def checkComplete(self):
    #     return self.completed == len(self.users.keys())


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
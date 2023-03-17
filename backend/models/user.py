class User(object):
    def __init__(self, name: str):
        self.name = name
        self.prompt = ""
        self.imageUrl = ""
        self.guess = ""

    def setPrompt(self, prompt: str):
        self.prompt = prompt

    def setImageUrl(self, imageUrl: str):
        self.imageUrl = imageUrl

    def setGuess(self, guess: str):
        self.guess = guess

    def json(self):
        sol = dict()
        sol['prompt'] = self.prompt
        sol['imageURL'] = self.imageUrl
        sol['guess'] = self.guess
        return sol

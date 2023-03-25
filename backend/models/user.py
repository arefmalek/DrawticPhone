class User(object):
    def __init__(self, name: str, user_id: int = -1):
        self.name = name
        self.prompt = ""
        self.imageUrl = ""
        self.guess = ""
        self.id = user_id

    def setPrompt(self, prompt: str):
        self.prompt = prompt

    def setImageUrl(self, imageUrl: str):
        self.imageUrl = imageUrl

    def setGuess(self, guess: str):
        self.guess = guess

    def mapping(self):
        sol = dict()
        sol["user_name"] = self.name
        sol["user_id"] = self.id
        sol['prompt'] = self.prompt
        sol['imageURL'] = self.imageUrl
        sol['guess'] = self.guess
        return sol

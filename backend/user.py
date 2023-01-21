class User(object):
    def __init__(self, name: str, promptDrawUser: str, guessImageUser: str):
        self.name = name
        self.prompt = ""
        self.image_url = ""
        self.guess = ""
        self.promptDrawUser = promptDrawUser
        self.guessImageUser = guessImageUser
    
    def set_prompt(self, prompt: str):
        self.prompt = prompt;

    def set_image_url(self, image_url: str):
        self.image_url = image_url    
    
    def set_guess(self, guess: str):
        self.guess = guess

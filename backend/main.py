from flask import Flask
from flask_socketio import SocketIO, emit
from lobby import Lobby
from random import randrange
from flask_socketio import join_room, leave_room
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
lobbies = dict()

if __name__ == '__main__':
    socketio.run(app)


# lobby functions
@socketio.on('enter_lobby')
def enter_lobby(lobbyId: int):
    join_room(lobbyId)
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


@socketio.on('create_lobby')
def create_lobby():
    id = randrange(10000, 99999)
    lobby = Lobby(id, {})
    lobbies[lobby.id] = lobby
    join_room(lobby.id)
    print(lobbies[lobby.id].json())
    emit("lobby", lobbies[lobby.id].json(), to=lobby.id)


@socketio.on('join_lobby')
def join_lobby(lobbyId: int, user: str):
    lobbies[lobbyId].add_user(user)
    join_room(lobbyId)
    print('join room')
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


@socketio.on('leave_lobby')
def leave_lobby(lobbyId: int, user: str):
    lobbies[lobbyId].remove_user(user)
    leave_room(lobbyId)
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


# game functions
@socketio.on('start_game')
def start_game(lobbyId: int):
    lobbies[lobbyId].start_game()
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


@socketio.on('submit_prompt')
def submit_prompt(lobbyId: int, user: str, prompt: str):
    lobbies[lobbyId].submit_prompt(user, prompt)
    if (lobbies[lobbyId].check_complete()):
        lobbies[lobbyId].draw_phase()
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


@socketio.on('submit_drawing')
def submit_drawing(lobbyId: int, user: str, image_url: str):
    lobbies[lobbyId].submit_drawing(user, image_url)
    if (lobbies[lobbyId].check_complete()):
        lobbies[lobbyId].guess_phase()
        emit("lobby", lobbies[lobbyId].json(), to=lobbyId)


@socketio.on('submit_guess')
def submit_guess(guess: str, lobbyId: int, user: str):
    lobbies[lobbyId].submit_guess(user, guess)
    if (lobbies[lobbyId].check_complete()):
        lobbies[lobbyId].result_phase()
    emit("lobby", lobbies[lobbyId].json(), to=lobbyId)

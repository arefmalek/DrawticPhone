from flask import Flask
from flask_socketio import SocketIO, join_room, send, emit
from flask_cors import CORS
import redis
from models.lobby import Lobby
import json
from db import generateLobbyId, storeLobby, loadLobby

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
r = redis.Redis(host='localhost', port=6379, db=0)


# lobby functions:
@socketio.on('createLobby')
def createLobby():
    lobby = Lobby(generateLobbyId(r))
    storeLobby(r, lobby)
    emit('lobby', json.dumps(lobby.mapping()))
    join_room(lobby.id)


@socketio.on('enterLobby')
def enterLobby(lobbyId: str):
    lobby: Lobby = loadLobby(r, int(lobbyId))
    send(json.dumps(lobby.mapping()))
    join_room(lobbyId)


@socketio.on('joinLobby')
def joinLobby(lobbyId: int, user: str):
    # create new user object
    # add to users:lobbyId list
    # joinroom(lobbyId)
    pass


@socketio.on('leaveLobby')
def leaveLobby(lobbyId: int, user: str):
    # remove user from lobby list
    # delete user hashmap
    pass

# game functions:
# start_game
# submit_prompt
# submit_drawing
# submit_guess


if __name__ == '__main__':
    socketio.run(app)

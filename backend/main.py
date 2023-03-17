from flask import Flask
from flask_socketio import SocketIO, join_room, send, emit
from flask_cors import CORS
import redis
from models.lobby import Lobby
import json

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
r = redis.Redis(host='localhost', port=6379, db=0)


# lobby functions:
@socketio.on('createLobby')
def createLobby():
    lobbyId = r.incr('nextLobbyId') - 1
    lobby = Lobby(lobbyId)
    r.hmset('lobby:{}'.format(lobbyId), lobby.mapping())
    emit('lobby', json.dumps(lobby.mapping()))
    join_room(lobbyId)


@socketio.on('enterLobby')
def enterLobby(lobbyId: str):
    lobby = r.hgetall('lobby:{}'.format(lobbyId))
    lobby = {k.decode('utf-8'): v.decode('utf-8') for k, v in lobby.items()}
    send(json.dumps(lobby))
    # may need a 'leave lobby' function, requires more tesing
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

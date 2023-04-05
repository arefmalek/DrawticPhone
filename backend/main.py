from flask import Flask
from flask_socketio import SocketIO, join_room, send, emit
from flask_cors import CORS
import redis
from models.lobby import Lobby
from models.user import User
import json

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
r = redis.Redis(host='localhost', port=6379, db=0)


# lobby functions:
@socketio.on('createLobby')
def createLobby():
    """
    Adds a new lobby at nextLobbyId at
    redis 'lobby:{lobbyid}'
    """
    lobbyid = r.incr('nextLobbyId') - 1
    lobby = Lobby(lobbyid)

    # ignoring deprecation errors, for some reason this crashes
    # when changing to r.hset()
    r.hmset('lobby:{}'.format(lobbyid), lobby.mapping())
    emit('lobby', json.dumps(lobby.mapping()))
    join_room(lobbyid)


@socketio.on('enterLobby')
def enterLobby(lobbyId: str):
    lobby = r.hgetall('lobby:{}'.format(lobbyId))
    lobby = {k.decode('utf-8'): v.decode('utf-8') for k, v in lobby.items()}
    send(json.dumps(lobby))
    join_room(lobbyId)


@socketio.on('joinLobby')
def joinLobby(lobbyId: int, user_name: str):
    # create new user object
    user_id = r.incr('nextUserId') - 1
    user = User(name=user_name, user_id=user_id)

    user_json = user.mapping()

    # ignoring deprecation errors, for some reason this crashes
    # when changing to r.hset()
    r.hmset('users:{}'.format(user_id), user_json)  # add to users

    # add to users:lobbyId set
    # print('user-id-table:{}'.format(lobbyId), user_id, user_name)
    r.hset('user-id-table:{}'.format(lobbyId), str(user_id), user_name)

    # add the name back for testing purposes
    emit('lobbyJoined', json.dumps(user_json))


@socketio.on('leaveLobby')
def leaveLobby(lobby_id: int, user_id: int):
    # delete user hashmap object at this id
    userDict: dict = r.hgetall('users:{}'.format(user_id))
    r.delete('users:{}'.format(user_id))
    userDict = {key.decode(): value.decode()
                for key, value in userDict.items()}

    # remove userid and username from userid hashmap
    removal = r.hdel(f"user-id-table:{lobby_id}", str(user_id))

    # TODO: delete the user object?

    emit('lobbyLeft', json.dumps(userDict))
    join_room(lobby_id)

# game functions:
# start_game
# submit_prompt
# submit_drawing
# submit_guess


if __name__ == '__main__':
    socketio.run(app)

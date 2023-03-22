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
    r.hmset('lobby:{}'.format(lobbyid), lobby.mapping())
    emit('lobby', json.dumps(lobby.mapping()))
    join_room(lobbyid)


@socketio.on('enterLobby')
def enterLobby(lobbyId: str):
    lobby = r.hgetall('lobby:{}'.format(lobbyId))
    lobby = {k.decode('utf-8'): v.decode('utf-8') for k, v in lobby.items()}
    send(json.dumps(lobby))
    # may need a 'leave lobby' function, requires more tesing
    join_room(lobbyId)


@socketio.on('joinLobby')
def joinLobby(lobbyId: int, user_name: str):
    # create new user object
    user_id = r.incr('nextUserId') - 1
    user = User(name=user_name, user_id = user_id)

    user_json = user.json()
    r.hmset('users:{}'.format(user_id), user_json) # add to users

    # add to users:lobbyId set
    r.hmset('user-ids:{}'.format(lobbyId), user_id, user_name)
    print(user_json)

    # add the name back for testing purposes
    emit('lobbyJoined', json.dumps(user_json), to=lobbyId)
    pass


@socketio.on('leaveLobby')
def leaveLobby(lobbyId: int, user_id: id):
    # delete user hashmap object at this id
    userDict: dict = r.delete('users:{}'.format(user_id))

    # remove userid and username from userid hashmap
    removal = r.hdel(f"user-ids:{lobbyId}", user_id)

    leaveDict = {}
    leaveDict['removal_operation'] = removal
    leaveDict['user_object'] = userDict

    print(leaveDict)

    emit('lobbyLeft', json.dumps(leaveDict))
    join_room(lobbyid)
    pass

# game functions:
# start_game
# submit_prompt
# submit_drawing
# submit_guess


if __name__ == '__main__':
    socketio.run(app)

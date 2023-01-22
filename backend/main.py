from flask import Flask, session, render_template, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit, send
import redis
from lobby import Lobby
from user import User
from random import randrange
from flask_socketio import join_room, leave_room
from flask_cors import CORS

app = Flask(__name__)
# Check Configuration section for more details
CORS(app)
SESSION_TYPE = 'redis'
Session(app)
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__== '__main__':
    socketio.run(app)

@app.route('/')
def index():
    return render_template('index.html')

# lobby functions

@socketio.on('view_lobby')
def view_lobby(lobbyId: int):
    emit("lobby", session['lobbies'][lobbyId])

@socketio.on('create_lobby')
def create_lobby():
    id = randrange(10000, 99999)
    lobby = Lobby(id, {})
    session[lobby.id] = lobby
    join_room(lobby.id)
    print(session[lobby.id].json())
    emit("lobby", session[lobby.id].json(), to=lobby.id)

@socketio.on('join_lobby')
def join_lobby(lobbyId: Lobby, user: User):
    session[lobbyId].add_user(user)
    join_room(lobbyId)
    print('join room')
    emit("lobby", session[lobbyId].json(), to=lobbyId)

@socketio.on('leave_lobby')
def leave_lobby(lobbyId: Lobby, user: User):
    session['lobbies'][lobbyId].remove_user(user)
    leave_room(lobbyId)
    emit("lobby", session['lobbies'][lobbyId], to=lobbyId)

# game functions

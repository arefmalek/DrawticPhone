from flask import Flask, session
from flask_session import Session
from flask_socketio import SocketIO, emit
import redis
from lobby import Lobby
from user import User
from random import randrange

app = Flask(__name__)
# Check Configuration section for more details
SESSION_TYPE = 'redis'
app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'secret!'
Session(app)
socketio = SocketIO(app)

if __name__== '__main__':
    socketio.run(app)
    session['lobbies'] = {} 

@socketio.on('create_lobby')
def create_lobby(user):
    id = randrange(10000, 99999)
    lobby = Lobby(id, [user])
    session['lobbies'].append(id, lobby)
    emit("lobby.status", session['lobbies'][id])

@socketio.on('join_lobby')
def join_lobby(lobby: Lobby, user: User):
    session['lobbies'][lobby.id].addUser(user)
    emit("user.connected", user.name)
    emit("lobby.status", session['lobbies'][lobby.id])

@socketio.on('leave_lobby')
def leave_lobby(lobby: Lobby, user: User) :
    session['lobbies'][lobby.id].remove_user(user)
    emit("user.connected", user.name)
    emit("lobby.status", session['lobbies'][lobby.id])

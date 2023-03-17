import redis
from models.lobby import Lobby


def generateLobbyId(r: redis.client.Redis):
    return (r.incr('nextLobbyId') - 1)


def storeLobby(r: redis.client.Redis, lobby: Lobby):
    r.hmset('lobby:{}'.format(lobby.id), lobby.mapping())


def loadLobby(r: redis.client.Redis, lobbyId: int):
    lobby = r.hgetall('lobby:{}'.format(lobbyId))
    lobby = {k.decode('utf-8'): v.decode('utf-8') for k, v in lobby.items()}
    return Lobby(int(lobby['id']), lobby['completed'], lobby['status'])


# generate userID
#   incrementa and return the pervious value of nextlobbyid

# store user
#   param: lobbyId, userId
#   adds userId to users:lobbyId
#   create new user hashmap user:userId

# remove user
#   param: lobbyId, userId
#   delete user hashmap and remove from lobby user list

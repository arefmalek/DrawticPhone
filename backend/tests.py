from flask_socketio import SocketIOTestClient
import redis
import json
from models.lobby import Lobby
import unittest
from main import app, socketio


class TestBackend(unittest.TestCase):
    def setUp(self):
        self.testClient = SocketIOTestClient(app, socketio)
        self.r = redis.Redis(host='localhost', port=6379, db=0)
        self.r.ping()  # check connection

    def tearDown(self):
        self.testClient.disconnect()
        self.r.quit()

    def testCreateLobby(self):
        self.testClient.emit('createLobby')
        recieved = self.testClient.get_received()

        # check message
        self.assertNotEqual(len(recieved), 0, msg='no message recieved')
        message = recieved[0]['args']
        lobbyDict: dict = json.loads(message[0])
        lobbyObj = Lobby(
            lobbyDict['id'], lobbyDict['completed'], lobbyDict['status'])

        # check ID
        nextId = self.r.get('nextLobbyId')
        self.assertIsNotNone(nextId, msg='nextLobbyId is None')
        if nextId is not None:
            self.assertEqual(lobbyObj.id, int(
                nextId) - 1, msg='incorrect lobby ID')

        # check other attributes
        self.assertEqual(lobbyObj.completed, 0)
        self.assertEqual(lobbyObj.status, 'waiting')

        # check db values
        lobbyDBDict = self.r.hgetall('lobby:{}'.format(lobbyObj.id))
        self.assertEqual(lobbyObj.id, int(lobbyDBDict[bytes('id', 'utf-8')]))
        self.assertEqual(lobbyObj.completed, int(
            lobbyDBDict[bytes('completed', 'utf-8')]))
        self.assertEqual(
            lobbyObj.status, (lobbyDBDict[bytes('status', 'utf-8')]).decode('utf-8'))

    def testEnterLobby(self):
        nextId = self.r.get('nextLobbyId')
        if nextId is not None:
            nextId = int(nextId)
            self.testClient.emit('enterLobby', nextId - 1)
        recieved = self.testClient.get_received()

        # check message
        self.assertNotEqual(len(recieved), 0, msg='no message recieved')
        message = recieved[0]['args']
        lobbyDict: dict = json.loads(message)
        lobbyObj = Lobby(
            lobbyDict['id'], lobbyDict['completed'], lobbyDict['status'])
        self.assertEqual(lobbyObj.status, 'waiting',
                         msg='lobby is not in waiting')

    def testJoinLobby(self):
        # get parameters, test functionality


        # get lobby and user to join
        lobby_id = self.r.get('nextLobbyId')
        username = "drawticPhoneGOAT"
        if lobby_id is not None:
            lobby_id = int(lobby_id) - 1
            # print("Lobby ID: ", lobby_id)
            # join lobby with user
            self.testClient.emit("joinLobby", lobby_id, username)

        recieved = self.testClient.get_received()
        print(recieved)
        
        # test that we've actually joined the lobby

        self.assertNotEqual(len(recieved), 0, msg='no message recieved')
        #   check what our response looks like
        message = recieved[0]['args']

        #   check that our userid set
        userDict: dict = json.loads(message)
        user_id = userDict['user_id']

        # check that it's in the user HM
        userHM = self.r.hmget("users:{}".format(user_id))
        self.assertGreater(len(userHM), 0, msg="user_id not found in user HM!")
        

        pass

    def testLeaveLobby(self):
        pass

    def testStartGame(self):
        pass

    def testSubmitPrompt(self):
        pass

    def testSubmitDrawing(self):
        pass

    def testSubmitGuess(self):
        pass


if __name__ == "__main__":
    tester = TestBackend()
    tester.setUp()

    # create Lobby works I think
    # tester.testCreateLobby()
    # tester.testEnterLobby()


    tester.testJoinLobby()


    tester.tearDown()
    # unittest.main()
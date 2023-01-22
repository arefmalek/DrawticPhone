import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import Game from './game/Game'
import Prompt from './game/Prompt'
import Results from './game/Results'
import Drawing from './game/Drawing'
import Home from './Home'
import Lobby from './game/Lobby'
import { LobbyContext } from './LobbyContext'
import { useState } from 'react'
import { UserContext } from './UserContext'
import { socket, WS_URL, setSocket } from './ws';
import { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  const [lobbyData, setLobbyData] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    setSocket();

    socket.on('disconnect', () => {
      console.log("disconnected!")
      setLobbyData(null);
    })
    socket.on('lobby', (data) => {
      console.log({ data })
      setLobbyData(data);
    })

    socket.on('connect', () => {
      console.log("connected!");
    })

    return () => {
      socket.close();
    }
  }, []);


  return (
    <LobbyContext.Provider
      value={[lobbyData, setLobbyData]}
    >
      <UserContext.Provider
        value={[user, setUser]}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />

            <Route
              path='/game'
              element={<Game />}
            >
              <Route
                index
                element={<Lobby />}
              />
              <Route
                path='draw'
                element={<Drawing />}
              />
              <Route
                path='prompts'
                element={<Prompt />}
              />
              <Route
                path='results'
                element={<Results />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </LobbyContext.Provider>
  )
}

export default App

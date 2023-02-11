import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

import { socket, setSocket } from './ws'

import { LobbyContext } from './context/LobbyContext'
import { UserContext } from './context/UserContext'
import { HandsContext } from './context/HandsContext'
import { Hands } from '@mediapipe/hands'

import Home from './Home'
import Game from './game/Game'
import Prompt from './game/Prompt'
import Results from './game/Results'
import Drawing from './game/Drawing'
import Guess from './game/Guess'
import Lobby from './game/Lobby'

const initHands = async() => {
  const hands = new Hands(
    {
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    }
  )

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true,
  });

  console.log("starting load")
  try {
    await hands.initialize();
  } catch (err) {
    alert("initialization failed")
  }
  console.log("resolving")
  return hands;
}

const App = () => {
  const [lobbyData, setLobbyData] = useState();
  const [user, setUser] = useState();
  const [hands, setHands] = useState();

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

    setHands(initHands());

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
                  element={
                    <HandsContext.Provider
                      value={hands}
                    >
                      <Drawing />
                    </HandsContext.Provider>
                  }
                />
                
                <Route
                  path='prompts'
                  element={<Prompt />}
                />

                <Route
                  path='guess'
                  element={<Guess />}
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

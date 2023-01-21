import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import Game from './game/Game'
import Prompt from './game/Prompt'
import Results from './game/Results'
import Drawing from './game/Drawing'
import Lobby from './Lobby'
import Loading from './game/Loading'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/lobby'
          element={<Lobby/>}
        />

        <Route
          path='/game'
          element={<Game/>}
        >
          <Route
            index
            element={<Loading/>}
          />
          <Route
            path='draw'
            element={<Drawing/>}
          />
          <Route
            path='prompts'
            element={<Prompt/>}
          />
          <Route
            path='results'
            element={<Results/>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { Outlet } from 'react-router-dom'

const Game = () => {
  return (
    <div>
        Game

        <div
            style={{
                border: '5px solid white',
                height: '200px',
                width: '300px',
                margin: 'auto'
            }}
        >
            <Outlet/>
        </div>
    </div>
  )
}

export default Game
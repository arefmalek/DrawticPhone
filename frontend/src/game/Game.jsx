import React from 'react'
import { Outlet } from 'react-router-dom'

const Game = () => {
  return (
    <div>
        Game

        <div
            style={{
                border: '4px solid white',
                height: '200px',
                width: '300px',
                margin: 'auto',
                borderRadius: '10px',
                padding: '5px'
            }}
        >
            <Outlet/>
        </div>
    </div>
  )
}

export default Game
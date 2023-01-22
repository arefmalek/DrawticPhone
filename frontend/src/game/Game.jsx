import React from 'react'
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { LobbyContext } from '../LobbyContext';

const Game = () => {
    return (
        <div
            style={{
                border: '4px solid white',
                height: '250px',
                width: '80%',
                maxWidth: 500,
                margin: 'auto',
                borderRadius: '10px',
                padding: '10px'
            }}
        >
            <Outlet />
        </div>
    )
}

export default Game
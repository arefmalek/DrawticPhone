import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { LobbyContext } from '../LobbyContext';
import { socket } from '../ws';

const Game = () => {
    
    const [ lobbyData, setLobbyData ] = useContext(LobbyContext);

    useEffect(() => {
        socket.on('disconnect', () => {
            setLobbyData(null);
        })
        socket.on('lobby', (data) => {
            setLobbyData(data);
        })

        return () => {
            socket.close();
        }
    }, []);

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
import React, { useEffect } from 'react'
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Game = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh'
            }}
        >
        <div
            style={{
                border: '4px solid white',
                height: '250px',
                width: '80%',
                maxWidth: 500,
                borderRadius: '10px',
                padding: '10px'
            }}
        >
            <Outlet />
        </div>
        </div>
    )
}

export default Game
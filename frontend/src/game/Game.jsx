import React, { useEffect } from 'react'
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Game = () => {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     navigate('/game/results');
    // }, [])

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
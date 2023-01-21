import React, { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LobbyContext } from './LobbyContext'
import { createLobby, enterLobby, joinLobby } from './requests'
import { buttonStyle } from './util'

const title = {
    margin: 'auto',
    marginBottom: 20,
    fontSize: 30
}

const Home = () => {

    const [ lobbyData, setLobbyData ] = useContext(LobbyContext);
    const [ joinUrl, setJoinURL ] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (lobbyData) {
            navigate('/game');
        }
    }, [lobbyData]);

    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    top: 'calc(50vh - 71.5px)',
                    left: 'calc(50vw - 150px)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 143,
                    width: 300
                }}
            >
                <div
                    style={title}
                >
                    GARTIC PHONY
                </div>

                <button
                    style={buttonStyle}
                    onClick={() => createLobby()}
                >
                    Create a Lobby
                </button>

                <div style={{
                    display: 'flex',
                    marginTop: 5
                }}>
                    <input
                        style={{
                            ...buttonStyle,
                            width: 167,
                            cursor: 'text',
                            marginRight: 5
                        }}
                        onChange={(e) => setJoinURL(e.target.value)}
                        placeholder="Join Lobby Code"
                    />
                    <button
                        style={{
                            ...buttonStyle,
                            minWidth: 110,
                            // margin: 5
                        }}
                        onClick={() => enterLobby(joinUrl)}
                    >
                        Join Lobby
                    </button>
                </div>
                
            </div>
        </div>
    )
};

export default Home;
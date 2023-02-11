import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import './Home.css'

import { LobbyContext } from './context/LobbyContext'

import { createLobby, enterLobby } from './requests'
import { buttonStyle } from './util'

const t = ["D", "r", "a", "w", "t", "i", "c", " ", "P", "h", "o", "n", "e"]


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
                    className="title"
                >
                    {/* DRAWTIC PHONE */}
                    {t.map((ch, i) => (
                        <div
                            className="chars"
                            key={i}
                        >
                            {ch}
                        </div>
                    ))}
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
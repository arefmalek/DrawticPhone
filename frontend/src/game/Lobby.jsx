import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { buttonStyle, getUserEmoji } from '../util';

import { joinLobby, start_game } from '../requests';

import { LobbyContext } from '../context/LobbyContext';
import { UserContext } from '../context/UserContext';

const userCard = {
    margin: '10px 0 0 20px'
}


const Lobby = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const [user, setUser] = useContext(UserContext);
    
    const navigate = useNavigate();

    const [name, setName] = useState('');

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        } else {
            const { status: screen } = lobbyData;
            if (screen && screen !== 'waiting') {
                console.log(screen)
                navigate('/game/' + screen)
            }
        }
    }, [lobbyData]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                height: '250px'
            }}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>
                        Waiting on other players...
                    </span>
                    <span>
                        Lobby ID: {lobbyData?.id}
                    </span>
                </div>
                <div
                    style={{
                        width: '100%',
                        background: 'white',
                        height: '4px',
                        borderRadius: '2px',
                        marginTop: 5
                    }}
                />
            </div>

            {lobbyData?.users &&
                <div>
                    {Object.entries(lobbyData.users).map(
                        ([userName, userData]) => (
                            <span
                                style={userCard}
                            >
                                {getUserEmoji(userName)}
                                {' '}
                                {userName}
                            </span>
                        )
                    )}
                </div>
            }

            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <input
                    style={{
                        ...buttonStyle,
                        width: 'calc(100% - 230px)',
                        cursor: 'text'
                    }}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <button
                    style={{
                        ...buttonStyle,
                        width: 100
                    }}
                    onClick={() => {
                        if (!user && name.length > 0) {
                            joinLobby(lobbyData.id, name)
                            setUser(name);
                        }
                    }}
                >
                    Join Lobby
                </button>

                <button
                    style={{
                        ...buttonStyle,
                        width: 100
                    }}
                    onClick={() => {
                        start_game(lobbyData.id);
                    }}
                >
                    Start Game
                </button>
            </div>
            
        </div>
    )
}

export default Lobby;
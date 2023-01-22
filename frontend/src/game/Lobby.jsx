import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../LobbyContext';
import { joinLobby } from '../requests';
import { UserContext } from '../UserContext';
import { buttonStyle } from '../util';

const userCard = {
    margin: '10px 0 0 20px'
}

// from: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
const simpleHash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return Math.ceil(hash / 3);
};

const getUserEmoji = (name) => {
    const min = 129408;
    const max = 129431;
    const rand = simpleHash(name);
    const val = rand % (max - min + 1) + min;
    return "&#" + val + ";";
}

const Lobby = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const [user, setUser] = useContext(UserContext);
    
    const navigate = useNavigate();

    const [name, setName] = useState('');

    useEffect(() => {
        if (!lobbyData) {
            // navigate('/');
        } else {
            const { screen } = lobbyData;
            if (screen && screen !== 'results') {
                navigate('/' + screen)
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
                    style={{display: 'flex'}}
                >
                    <span>
                        Waiting on other players...
                    </span>
                    <span>
                        {lobbyData?.id}
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
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: getUserEmoji(userName)
                                    }}
                                />
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
                        width: 'calc(100% - 200px)',
                        cursor: 'text',
                        marginRight: 5
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
                        if (!user) {
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
                        startGame();
                    }}
                >
                    Start Game
                </button>
            </div>
            
        </div>
    )
}

export default Lobby;
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../LobbyContext';
import { buttonStyle, getUserEmoji } from '../util';

const Results = () => {
    
    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const navigate = useNavigate();
    const [index, setIndex] = useState();

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        }
        else {
            const { screen } = lobbyData;
            if (screen && screen !== 'results') {
                navigate("/game/" + screen)
            }
        }
    }, [lobbyData]);

    const userArr = Object.entries(lobbyData.users);
    const n = userArr.length;
    const prev = userArr[(index + 1) % n];
    const curr = userArr[index % n];
    const next = userArr[(index - 1) % n];
    console.log(userArr)

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginButton: 20
                }}
            >
                {userArr.map(([userName, userData], ind) => (
                    <button
                        onClick={() => {
                            setIndex(ind);
                        }}
                        style={buttonStyle}
                    >
                        {getUserEmoji(userName)}
                        {' '}
                        {userName}
                    </button>
                ))}
            </div>

            {(index !== null || index !== undefined) &&
                <div>
                    
                    <div>
                        {prev?.name}'s Prompt: {prev?.prompt}
                    </div>
                    Image:
                    <div>
                        {curr?.name}: <img src={prev?.imageURL}/>
                    </div>
                    Guess:
                    <div>
                        {next?.name}: {next?.guess}
                    </div>
                </div>
            }

            {/* <div>
                <button
                    style={{
                        ...buttonStyle,
                        width: '100%'
                    }}
                    onClick={() => submitPrompt(lobbyData.id, user, prompt)}
                >
                    Prev
                </button>
                <button
                    style={{
                        ...buttonStyle,
                        width: '100%'
                    }}
                    onClick={() => submitPrompt(lobbyData.id, user, prompt)}
                >
                    Next
                </button>
            </div> */}
        </div>
    )
}

export default Results
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
    const prev = userArr[(index - 1) % n][1];
    const curr = userArr[index % n][1];
    const next = userArr[(index + 1) % n][1];
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
                    <div>
                        {curr?.name}'s Image: <img src={prev?.imageURL}/>
                    </div>
                    <div>
                        {next?.name}'s Guess: {next?.guess}
                    </div>
                </div>
            }
        </div>
    )
}

export default Results
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../LobbyContext';
import { buttonStyle, getUserEmoji } from '../util';

const Results = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    
    const [data, setData] = useState({prev: {}, next: {}, curr: {}, userArr: []});

    const setTheData = () => {
        try {
            console.log({lobbyData})
            const userArr = Object.entries(lobbyData.users);
            console.log('here: ', userArr);
            const n = userArr.length;
            const prev = userArr[(index + n - 1) % n];
            const curr = userArr[index % n];
            const next = userArr[(index + 1) % n];
            setData({
                prev: { ...prev[1], name: prev[0] },
                curr: { ...curr[1], name: curr[0] },
                next: { ...next[1], name: next[0] },
                userArr
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setTheData();
    }, [data])

    useEffect(() => {
        setTheData();

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
    
    const { prev, curr, next, userArr } = data;
    console.log(data)

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginButton: 20
                }}
            >
                {userArr?.map(([userName, userData], ind) => (
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

            <div>
                <div>
                    {prev?.name}'s Prompt: {prev?.prompt}
                </div>
                <div>
                    {curr?.name}'s Image:
                    <img
                        src={prev?.imageURL}
                        style={{
                            height: 150
                        }}
                    />
                </div>
                <div>
                    {next?.name}'s Guess: {next?.guess}
                </div>
            </div>
        </div>
    )
}

export default Results
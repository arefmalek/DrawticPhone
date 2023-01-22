import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { LobbyContext } from '../LobbyContext';
import { submitGuess } from '../requests';
import Timer from '../Timer';
import { UserContext } from '../UserContext';
import { buttonStyle } from '../util';

const Guess = () => {
    const [user, setUser] = useContext(UserContext)
    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const navigate = useNavigate();
    const [guess, setGuess] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        }
        else {
            const { status: screen } = lobbyData;
            if (screen && screen !== 'guess') {
                console.log("going to:", screen)
                navigate("/game/" + screen)
            }
        }
    }, [lobbyData]);

    const userArr = Object.entries(lobbyData.users);
    console.log({userArr})
    const index = userArr.findIndex(x => x[0] == user);
    console.log({index, user})
    const n = userArr.length;
    const prev = userArr[(index + n - 1) % n][1]; // drawer

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                height: '175px'
            }}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <span>
                        Submit Your Guess...
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

            <div>
                <img
                    src={prev.imageURL}
                    alt={'no img :('}
                />
            </div>

            <div>
                <div>
                    <input
                        style={{
                            ...buttonStyle,
                            width: 'calc(100% - 18px)',
                            cursor: 'text',
                            marginBottom: 5
                        }}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Your Guess"
                    />
                </div>

                <div>
                    <button
                        style={{
                            ...buttonStyle,
                            width: '100%'
                        }}
                        disabled={submitted}
                        onClick={() => {
                            setSubmitted(true)
                            submitGuess(guess, lobbyData.id, user)
                        }}
                    >
                        Submit
                    </button>
                </div>

                <div>
                    {submitted ?
                        <p>Waiting for other players...</p>
                    :
                        <Timer
                            time={30}
                            callback={() => {
                                setSubmitted(true)
                                submitGuess(guess, lobbyData.id, user)
                            }}
                        />
                    }
                </div>
            </div>

        </div>
    )
}

export default Guess
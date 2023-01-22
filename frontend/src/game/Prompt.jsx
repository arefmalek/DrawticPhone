import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../LobbyContext';
import { submitPrompt } from '../requests';
import Timer from '../Timer';
import { UserContext } from '../UserContext';
import { buttonStyle } from '../util';

const Prompt = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const [user, setUser] = useContext(UserContext);

    const navigate = useNavigate();

    const [prompt, setPrompt] = useState('');
    const [submitted, setSubmit] = useState(false);

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        } else {
            const { status: screen } = lobbyData;
            if (screen && screen !== 'prompts') {
                console.log(screen)
                navigate('/game/' + screen)
            }
        }
    }, [lobbyData]);

    const submit = () => {
        console.log('submitted prompt')
        submitPrompt(lobbyData.id, user, prompt);
        setSubmit(true);
    };

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
                        Submit Your Prompt...
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
                <div>
                    <input
                        style={{
                            ...buttonStyle,
                            width: 'calc(100% - 18px)',
                            cursor: 'text',
                            marginBottom: 5
                        }}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Your Prompt"
                    />
                </div>

                <div>
                    <button
                        style={{
                            ...buttonStyle,
                            width: '100%'
                        }}
                        disabled={submitted}
                        onClick={() => submit()}
                    >
                        Submit
                    </button>
                </div>

                <div>
                    {submitted ? <p>Waiting for other players...</p> :
                        <Timer time={30} callback={() => submit()}></Timer>}
                </div>
            </div>

        </div>
    )
}

export default Prompt
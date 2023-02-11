import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CameraCanvas from '../camera/CameraCanvas';
import { LobbyContext } from '../context/LobbyContext';
import { useRef } from 'react';
import { buttonStyle } from '../util';
import { submitDrawing } from '../requests';

// get users
import { UserContext } from '../context/UserContext';

const Drawing = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const [userName, setUser] = useContext(UserContext);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const [mount, setMount] = useState(true);

    const dlRef = useRef(
        {
            download: false,
            image: null
        }
    );

    useEffect(() => {
        if (!lobbyData) {
            // navigate('/');
        }
        else {
            const { status: screen } = lobbyData;
            if (screen && screen !== 'draw') {
                navigate('/game/' + screen)
            }
        }
    }, [lobbyData]);

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [mount])

    const getPrompt = () => {
        try {
            const userArr = Object.entries(lobbyData.users);
            console.log({userArr})
            const index = userArr.findIndex(x => x[0] == userName);
            console.log({index, userName})
            const n = userArr.length;
            const prev = userArr[(index + n - 1) % n][1]; // prompt
            return prev.prompt;
        } catch (err) {
            console.log(err)
            return 'bad'
        } 
    }

    return (
        <div>
            <div>
                <span>
                    Draw The Prompt: {getPrompt()}
                </span>
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

            <div style={{
                margin: '5px 0',
                display: 'flex',
                justifyContent: 'center',
            }}>
                    {submitted ? 
                        <>
                            {dlRef.current.image &&
                                <img
                                    src={dlRef.current.image}
                                    alt="Image not submitted"
                                    style={{
                                        height: '180px'
                                    }}
                                />
                            }
                        </>
                    :
                        <>
                            {mount && 
                                <CameraCanvas
                                    downloadRef={dlRef}
                                    theCallback={() => {
                                        setSubmitted(true)
                                        submitDrawing(lobbyData?.id, userName, dlRef.current.image);
                                    }}
                                />
                            }
                        </>
                        
                    }
            </div>

            <div>
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <button
                        style={{
                            ...buttonStyle,
                            width: '100%',
                            marginRight: 5
                        }}
                        onClick={() => {
                            dlRef.current.download = true;
                        }}
                    >
                        Submit
                    </button>
                    <button
                        style={{
                            ...buttonStyle,
                            width: '100%'
                        }}
                        onClick={() => {
                            setMount(false);
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>
            
        </div >

    )
}

export default Drawing
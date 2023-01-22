import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CameraCanvas from '../camera/CameraCanvas';
import { LobbyContext } from '../LobbyContext';
import { useRef } from 'react';
import { buttonStyle } from '../util';
import { submitDrawing } from '../requests';

// get users
import { UserContext } from '../UserContext';

const Drawing = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const [userName, setUser] = useContext(UserContext);

    const navigate = useNavigate();

    const dlRef = useRef(
        {
            download: false,
            image: null
        }
    );

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        }
        else {
            const { status: screen } = lobbyData;
            if (screen && screen !== 'draw') {
                navigate('/game/' + screen)
            }
        }
    }, [lobbyData]);

    return (
        <div>
            <CameraCanvas
                downloadRef={dlRef}
                theCallback={() => {
                    submitDrawing(lobbyData?.id, userName, dlRef.current.image);
                }}
            />

            <div>
                <div>
                    <button
                        style={{
                            ...buttonStyle,
                            width: '100%'
                        }}
                        onClick={() => {
                            dlRef.current.download = true;
                            // loop till DL true
                            // while (dlRef.current.download) { }
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div>
                {dlRef.current.image && <img src={dlRef.current.image} alt="Image not submitted" />}
            </div>
        </div >

    )
}

export default Drawing
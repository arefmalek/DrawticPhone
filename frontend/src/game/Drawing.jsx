import React, { useContext } from 'react'
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

    // useEffect(() => {
    //     // const lobbyData = lobbyData?.lastJsonMessage;

    //     // get lobby id and uname now


    //     if (!lobbyData) {
    //         // navigate('/');
    //     }
    //     else {
    //         const { screen } = lobbyData;
    //         if (screen && screen !== 'results') {
    //             navigate(screen)
    //         }
    //     }
    // }, [lobbyData]);

    return (
        <div>
            <CameraCanvas downloadRef={dlRef}

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

        </div >

    )
}

export default Drawing
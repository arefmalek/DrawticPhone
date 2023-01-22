import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import CameraCanvas from '../camera/CameraCanvas';
import { LobbyContext } from '../LobbyContext';

const Drawing = () => {

    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!lobbyData) {
            navigate('/');
        }
        else {
            const { screen } = lobbyData;
            if (screen && screen !== 'results') {
                navigate('/game/' + screen)
            }
        }
    }, [lobbyData]);

    return (
        <div>
            <CameraCanvas/>
        </div>
    )
}

export default Drawing
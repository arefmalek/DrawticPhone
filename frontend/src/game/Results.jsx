import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { LobbyContext } from '../LobbyContext';

const Results = () => {
    
    const [lobbyData, setLobbyData] = useContext(LobbyContext);
    const navigate = useNavigate();

    useEffect(() => {
        const lobbyData = lobbyData?.lastJsonMessage;

        if (!lobbyData) {
            // navigate('/');
        }
        else {
            const { screen } = lobbyData;
            if (screen && screen !== 'results') {
                navigate(screen)
            }
        }
    }, [lobbyData]);

    return (
        <div>
            Results
        </div>
    )
}

export default Results
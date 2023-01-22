import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { LobbyContext } from '../LobbyContext';

const Guess = () => {
    
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

export default Guess
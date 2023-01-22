import React, { useState, useEffect } from 'react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

const Timer = ({
    time,
    callback
}) => {

    const [t, setT] = useState(time);
    
    useEffect(() => {
        console.log(t)
        if (t === 0) {
            callback();
        }
    }, [t]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(t)
            setT(_t => _t - 1);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <CircularProgress
            value={t / time * 100}
            size='40px'
            thickness='10px'
            color="white"
            trackColor='black'
        >
            <CircularProgressLabel
                style={{
                    marginTop: -4,
                    fontSize: 10
                }}
            >
                {t}
            </CircularProgressLabel>
        </CircularProgress>
    )
}

export default Timer
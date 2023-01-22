import io from 'socket.io-client';

export const WS_URL = 'http://localhost:5000';

export let socket;

export const setSocket = () => {
    socket = io(WS_URL);
}

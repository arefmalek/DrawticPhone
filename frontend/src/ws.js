import io from 'socket.io-client';

export const WS_URL = 'http://localhost:5000';
// export const WS_URL = 'https://b3f0-128-210-107-131.ngrok.io/';

export let socket;

export const setSocket = () => {
    socket = io(WS_URL);
}

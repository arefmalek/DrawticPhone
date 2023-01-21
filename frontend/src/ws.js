import io from 'socket.io-client';

const WS_URL = 'ws://localhost:4000';

export let socket = io(WS_URL);

socket.on('connect', () => {
    console.log("connected!");
})

socket.on('disconnect', () => {
    console.log("disconnected!");
})
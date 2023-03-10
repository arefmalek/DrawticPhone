
import { socket } from "./ws";

export const createLobby = () => {
    try {
        console.log("creating_lobby")
        socket.emit("create_lobby");
    } catch (err) {
        console.log(err);
    }
}

export const enterLobby = (lobbyId) => {
    console.log({ lobbyId })
    const id = parseInt(lobbyId)
    console.log({ id })
    try {
        socket.emit("enter_lobby", id);
    } catch (err) {
        console.log(err)
    }
}

export const joinLobby = (lobbyId, userName) => {
    try {
        socket.emit("join_lobby", lobbyId, userName);
    } catch (err) {
        console.log(err);
    }
}

export const submitPrompt = (lobbyId, userName, prompt) => {
    try {
        socket.emit("submit_prompt", lobbyId, userName, prompt);
    } catch (err) {
        console.log(err);
    }
}

export const start_game = (lobbyId) => {
    try {
        socket.emit("start_game", lobbyId);
    } catch (err) {
        console.log(err);
    }
}

export const submitGuess = (guess, lobbyId, userName) => {
    console.log({
        guess, lobbyId, userName
    })
    try {
        socket.emit('submit_guess', guess, lobbyId, userName)
    } catch (err) {
        console.log(err);
    }
}

export const submitDrawing = (lobbyId, userName, imageURL) => {
    try {
        console.log(lobbyId, userName, imageURL)
        socket.emit("submit_drawing", lobbyId, userName, imageURL);
    } catch (err) {
        console.log(err);
    }
}
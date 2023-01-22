
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
    try {
        socket.emit("enterLobby", lobbyId);
    } catch (err) {
        console.log(err)
    }
}

export const joinLobby = (lobbyId, userName) => {
    try {
        socket.emit("joinLobby", lobbyId, userName);
    } catch (err) {
        console.log(err);
    }
}

export const submitPrompt = (lobbyId, userName, prompt) => {
    try {
        socket.emit("submitPrompt", lobbyId, userName, prompt);
    } catch (err) {
        console.log(err);
    }
}
// src/http_server/websocket_server.js
import { WebSocketServer } from 'ws';
import { MESSAGE_TYPES } from './constants.js';
import PlayerManager from './player_manager.js';
import RoomManager from './room_manager.js';

console.log('Starting WebSocket server...');
const server = new WebSocketServer({ port: 8080 });
console.log('WebSocketServer created');
const playerManager = new PlayerManager();
console.log('PlayerManager instance created');
const roomManager = new RoomManager();
console.log('RoomManager instance created');

server.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        handleClientMessage(ws, parsedMessage);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Optionally, handle cleanup for disconnected clients here
    });
});
console.log('WebSocket server is running on ws://localhost:8080');

function handleClientMessage(ws, message) {
    switch (message.type) {
        case MESSAGE_TYPES.REG:
            playerManager.registerPlayer(ws, message.data);
            break;
        case MESSAGE_TYPES.CREATE_ROOM:
            roomManager.createRoom(ws);
            break;
        case MESSAGE_TYPES.ADD_USER_TO_ROOM:
            roomManager.addUserToRoom(ws, message.data.indexRoom);
            break;
        case MESSAGE_TYPES.ADD_SHIPS:
            roomManager.addShips(ws, message.data);
            break;
        case MESSAGE_TYPES.ATTACK:
            roomManager.handleAttack(ws, message.data);
            break;
        default:
            console.log('Unknown command:', message.type);
    }
}

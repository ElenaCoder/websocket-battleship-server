import { MESSAGE_TYPES } from './constants.js';
import { rooms } from './data_storage.js';

class RoomManager {
    createRoom(ws) {
        const roomId = rooms.size + 1;
        rooms.set(roomId, { players: [ws], id: roomId });
        ws.send(JSON.stringify({
            type: MESSAGE_TYPES.UPDATE_ROOM,
            data: [{ roomId, roomUsers: [] }],
            id: 0
        }));
    }

    addUserToRoom(ws, indexRoom) {
        const room = rooms.get(indexRoom);
        if (room) {
            room.players.push(ws);
            if (room.players.length === 2) {
                this.startGame(room);
            }
        }
    }

    startGame(room) {
        const gameId = room.id;
        room.players.forEach((player, index) => {
            player.send(JSON.stringify({
                type: MESSAGE_TYPES.CREATE_GAME,
                data: { idGame: gameId, idPlayer: index + 1 },
                id: 0
            }));
        });
        this.setTurn(room);
    }

    addShips(ws, { gameId, ships, indexPlayer }) {
        const room = rooms.get(gameId);
        if (room) {
            room.players[indexPlayer - 1].ships = ships;
            if (room.players.every(player => player.ships)) {
                room.players.forEach(player => {
                    player.send(JSON.stringify({
                        type: MESSAGE_TYPES.START_GAME,
                        data: { ships: player.ships, currentPlayerIndex: indexPlayer },
                        id: 0
                    }));
                });
            }
        }
    }

    handleAttack(ws, { gameId, x, y, indexPlayer }) {
        const room = rooms.get(gameId);
        if (room) {
            const opponent = room.players[1 - (indexPlayer - 1)];
            const attackResult = this.checkAttack(opponent, x, y);
            ws.send(JSON.stringify({
                type: MESSAGE_TYPES.ATTACK,
                data: { position: { x, y }, currentPlayer: indexPlayer, status: attackResult },
                id: 0
            }));
            this.setTurn(room);
        }
    }

    checkAttack(player, x, y) {
        // Placeholder attack logic
        return "miss"; // Implement game logic for "hit", "kill", or "miss"
    }

    setTurn(room) {
        const nextPlayerIndex = room.players.findIndex(player => player === room.currentPlayer);
        room.currentPlayer = room.players[1 - nextPlayerIndex];
        room.currentPlayer.send(JSON.stringify({
            type: MESSAGE_TYPES.TURN,
            data: { currentPlayer: room.currentPlayer.id },
            id: 0
        }));
    }
}

export default RoomManager;

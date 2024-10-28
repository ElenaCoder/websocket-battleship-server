import { MESSAGE_TYPES } from './constants.js';
import { players } from './data_storage.js';

class PlayerManager {
    registerPlayer(ws, { name, password }) {
        if (players.has(name)) {
            ws.send(JSON.stringify({
                type: MESSAGE_TYPES.REG,
                data: { error: true, errorText: 'Player already exists' },
                id: 0
            }));
        } else {
            const playerId = players.size + 1;
            players.set(name, { name, password, id: playerId });
            ws.send(JSON.stringify({
                type: MESSAGE_TYPES.REG,
                data: { name, index: playerId, error: false },
                id: 0
            }));
        }
    }
}

export default PlayerManager;

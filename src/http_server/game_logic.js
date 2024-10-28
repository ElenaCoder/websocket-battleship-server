export function isValidShipPlacement(ship, board) {
    const { position: { x, y }, direction, length } = ship;

    // Get board dimensions
    const boardHeight = board.length;
    const boardWidth = board[0].length;

    // Check if ship is within board boundaries
    if (direction) { // Horizontal
        if (x + length > boardWidth) return false;
    } else { // Vertical
        if (y + length > boardHeight) return false;
    }

    // Check for overlap with other ships
    for (let i = 0; i < length; i++) {
        const checkX = direction ? x + i : x;
        const checkY = direction ? y : y + i;

        if (board[checkY][checkX] === 1) {
            return false; // Overlap found
        }
    }

    // Placement is valid, mark cells as occupied
    for (let i = 0; i < length; i++) {
        const placeX = direction ? x + i : x;
        const placeY = direction ? y : y + i;
        board[placeY][placeX] = 1; // Mark cells with ship part
    }

    return true; // Ship placement is valid
}

export function checkHit(board, x, y) {
    // Check if coordinates are out of bounds
    if (x < 0 || y < 0 || y >= board.length || x >= board[0].length) {
        return 'miss'; // Out of bounds shot is treated as a miss
    }

    // Determine the result of the shot
    if (board[y][x] === 0) {
        return 'miss'; // Shot missed
    } else if (board[y][x] === 1) {
        // Mark the cell as hit
        board[y][x] = 2;

        // Check if this was a killing shot
        if (isShipSunk(board, x, y)) {
            return 'kill'; // Ship has been fully destroyed
        } else {
            return 'hit'; // Hit, but ship is not yet destroyed
        }
    } else if (board[y][x] === 2) {
        return 'miss'; // Already hit cell, count as miss
    }
}

// Helper function to determine if a ship is fully sunk
function isShipSunk(board, x, y) {
    // Helper to find all connected parts of the ship
    const queue = [[x, y]];
    while (queue.length > 0) {
        const [cx, cy] = queue.pop();

        // Check surrounding cells to see if any part of the ship is not hit
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = cx + dx;
            const ny = cy + dy;

            // Skip cells out of bounds
            if (nx < 0 || ny < 0 || ny >= board.length || nx >= board[0].length) continue;

            // If we find an unhit part of the ship, it’s not fully sunk
            if (board[ny][nx] === 1) {
                return false; // Ship is not yet fully sunk
            } else if (board[ny][nx] === 2) {
                // Keep checking adjacent parts of the ship
                queue.push([nx, ny]);
            }
        }
    }
    return true; // All parts of the ship are hit
}

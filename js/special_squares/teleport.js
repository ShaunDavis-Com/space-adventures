export async function handleTeleportSquare(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];
    const position = player.position;

    game.uiManager.updateGameMessage(`🛸 ${player.name} activated an alien teleporter! Calculating destination...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentRow = Math.floor((position - 1) / 10);
    const currentCol = (position - 1) % 10;

    const teleportOptions = [];

    // Horizontal
    if (currentCol > 0) {
        for (let col = 0; col < currentCol; col++) {
            teleportOptions.push({ direction: 'left', distance: currentCol - col, targetSquare: (currentRow * 10) + col + 1 });
        }
    }
    if (currentCol < 9) {
        for (let col = currentCol + 1; col < 10; col++) {
            teleportOptions.push({ direction: 'right', distance: col - currentCol, targetSquare: (currentRow * 10) + col + 1 });
        }
    }
    // Vertical
    if (currentRow > 0) {
        for (let rowOffset = 1; rowOffset <= 3 && (currentRow - rowOffset) >= 0; rowOffset++) {
            teleportOptions.push({ direction: 'down', distance: rowOffset, targetSquare: ((currentRow - rowOffset) * 10) + currentCol + 1 });
        }
    }
    if (currentRow < 9) {
        for (let rowOffset = 1; rowOffset <= 3 && (currentRow + rowOffset) < 10; rowOffset++) {
            teleportOptions.push({ direction: 'up', distance: rowOffset, targetSquare: ((currentRow + rowOffset) * 10) + currentCol + 1 });
        }
    }

    if (teleportOptions.length === 0) {
        if (!fromKnockback) game.completeTurn();
        return;
    }

    const selectedOption = teleportOptions[Math.floor(Math.random() * teleportOptions.length)];

    game.uiManager.updateGameMessage(`🎆 Alien technology teleports ${player.name} ${selectedOption.direction} ${selectedOption.distance} spaces!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await game.uiManager.lightUpTeleportPath(position, selectedOption.targetSquare, selectedOption.direction);
    await game.uiManager.animateTeleportMovement(player, selectedOption.targetSquare);
    game.uiManager.clearTeleportPath();

    await game.handlePlayerCollisions(selectedOption.targetSquare);

    if (game.boardManager.specialSquares[selectedOption.targetSquare]) {
        game.uiManager.updateGameMessage(`🎲 ${player.name} teleported onto another special square!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await game.handleSpecialSquare(selectedOption.targetSquare, fromKnockback);
        return;
    }

    if (selectedOption.targetSquare === 100) {
        game.handleWin();
        return;
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

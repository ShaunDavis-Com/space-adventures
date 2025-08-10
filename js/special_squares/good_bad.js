async function handleGoodOrBadSquare(game, isGood, fromKnockback) {
    const player = game.playerManager.players[game.currentPlayer];
    const randomMovement = 1 + Math.floor(Math.random() * 12);
    const newPosition = isGood ?
        Math.min(player.position + randomMovement, 100) :
        Math.max(player.position - randomMovement, 1);

    const message = isGood ?
        `🟢 Green square! Moving forward ${randomMovement} spaces!` :
        `🔴 Red square! Moving backward ${randomMovement} spaces!`;
    game.uiManager.updateGameMessage(message);

    isGood ? game.audioManager.playGoodSound() : game.audioManager.playBadSound();

    await game.uiManager.lightUpPath(player.position, newPosition, isGood);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await game.uiManager.animateMovement(player, newPosition);
    game.uiManager.clearLitPath();

    await game.handlePlayerCollisions(newPosition);

    if (game.boardManager.specialSquares[newPosition]) {
        await game.handleSpecialSquare(newPosition, fromKnockback);
        return;
    }

    if (player.position === 100) {
        game.handleWin();
        return;
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

export function handleGoodSquare(game, fromKnockback = false) {
    return handleGoodOrBadSquare(game, true, fromKnockback);
}

export function handleBadSquare(game, fromKnockback = false) {
    return handleGoodOrBadSquare(game, false, fromKnockback);
}

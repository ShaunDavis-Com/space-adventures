export async function handleBoardSwitcher(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];

    game.uiManager.updateGameMessage(`🔀 Board Switcher activated! Randomizing all special squares...`);
    game.audioManager.playBoardSwitcherSound();

    const gameBoard = document.getElementById('gameBoard');
    gameBoard.classList.add('board-glitch');

    await new Promise(resolve => setTimeout(resolve, 2000));

    game.boardManager.generateRandomSpecialSquares();
    game.boardManager.recreateBoardSquares();

    gameBoard.classList.remove('board-glitch');

    game.uiManager.updateGameMessage('🎲 Board randomized! Checking all player positions...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await processAllPlayersAfterBoardSwitch(game);

    if (!fromKnockback) {
        game.completeTurn();
    }
}

async function processAllPlayersAfterBoardSwitch(game) {
    const originalCurrentPlayer = game.currentPlayer;

    const playersOnSpecialSquares = Object.values(game.playerManager.players)
        .filter(p => p.isAlive && game.boardManager.specialSquares[p.position])
        .sort(() => 0.5 - Math.random());

    if (playersOnSpecialSquares.length === 0) return;

    game.uiManager.updateGameMessage(`⚡ Processing ${playersOnSpecialSquares.length} players on special squares in random order!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (const player of playersOnSpecialSquares) {
        if (!player.isAlive) continue;

        game.currentPlayer = player.id;
        const special = game.boardManager.specialSquares[player.position];

        game.uiManager.updateGameMessage(`${player.name} is on a new ${special.type} square!`);
        await new Promise(resolve => setTimeout(resolve, 500));

        // We pass 'true' for fromKnockback to prevent turn completion
        await game.handleSpecialSquare(player.position, true);

        if (game.gameWon) return; // Stop if a player wins
    }

    game.currentPlayer = originalCurrentPlayer;
}

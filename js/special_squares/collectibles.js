async function handleCollectible(game, type) {
    const player = game.playerManager.players[game.currentPlayer];
    let message = '';
    let alreadyFull = false;

    switch (type) {
        case 'life_collectible':
            if (player.lives >= player.maxLives) {
                alreadyFull = true;
                message = `❤️ ${player.name} found a life heart but is already at max lives!`;
            } else {
                player.lives++;
                message = `❤️ ${player.name} found a life heart! +1 life gained!`;
            }
            break;
        case 'shield_collectible':
            if (player.reverseCard) {
                alreadyFull = true;
                message = `🛡️ ${player.name} found a shield but already has one!`;
            } else {
                player.reverseCard = true;
                message = `🛡️ ${player.name} found a protective shield!`;
            }
            break;
        case 'dice_collectible':
            player.extraDiceRemaining = 3;
            message = `🎲 ${player.name} found extra dice! Awarded 3 bonus moves!`;
            break;
    }

    game.uiManager.updateGameMessage(message);

    if (alreadyFull) {
        game.audioManager.playBadSound();
    } else {
        game.audioManager.playGoodSound();
        game.uiManager.generatePlayerStatusCards();

        // Remove the collectible square from the board
        const position = player.position;
        delete game.boardManager.specialSquares[position];
        const square = document.getElementById(`square-${position}`);
        if (square) {
            square.classList.remove('life_collectible', 'shield_collectible', 'dice_collectible');
            square.innerHTML = '✨';
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    game.completeTurn();
}

export function handleLifeCollectible(game) {
    return handleCollectible(game, 'life_collectible');
}

export function handleShieldCollectible(game) {
    return handleCollectible(game, 'shield_collectible');
}

export function handleDiceCollectible(game) {
    return handleCollectible(game, 'dice_collectible');
}

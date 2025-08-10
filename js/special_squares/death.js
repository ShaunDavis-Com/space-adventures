export async function handleDeathSquare(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];

    game.uiManager.updateGameMessage(`💀 Death trap triggers! ${player.name} loses a life!`);
    game.audioManager.playExplosionSound();

    const playerCard = document.getElementById(`player${game.currentPlayer}Card`);
    if (playerCard) {
        playerCard.classList.add('death-hit');
        setTimeout(() => playerCard.classList.remove('death-hit'), 2000);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    await game.uiManager.animateHeartLoss(game.currentPlayer);
    player.lives--;
    game.uiManager.generatePlayerStatusCards();

    if (player.lives <= 0) {
        player.isAlive = false;
        game.playerManager.updateAllPlayerTokens();
        game.uiManager.updateGameMessage(`💀 ${player.name} has been eliminated!`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const alivePlayers = Object.values(game.playerManager.players).filter(p => p.isAlive);
        if (alivePlayers.length <= 1) {
            game.handleLastPlayerWin();
            return;
        }
    } else {
        game.uiManager.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

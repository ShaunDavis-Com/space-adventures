export async function handleBombSquare(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];
    game.audioManager.playExplosionSound();

    const alivePlayers = Object.values(game.playerManager.players).filter(p => p.isAlive).map(p => p.id);

    const victimPlayerNum = await game.uiManager.animatePlayerSelection(alivePlayers, `💣 ${player.name} triggered a bomb! Calculating blast radius...`);
    const victim = game.playerManager.players[victimPlayerNum];

    const victimCard = document.getElementById(`player${victimPlayerNum}Card`);
    if (victimCard) {
        victimCard.classList.add('bomb-hit');
        setTimeout(() => victimCard.classList.remove('bomb-hit'), 2000);
    }

    game.uiManager.updateGameMessage(`💥 The bomb hits ${victim.name}!`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (victim.reverseCard && victimPlayerNum !== game.currentPlayer) {
        victim.reverseCard = false;
        game.uiManager.generatePlayerStatusCards();

        game.uiManager.updateGameMessage(`🛡️💥 ${victim.name} deflects the bomb blast back at ${player.name}!`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const bomberCard = document.getElementById(`player${game.currentPlayer}Card`);
        if (bomberCard) {
            bomberCard.classList.add('bomb-hit');
            setTimeout(() => bomberCard.classList.remove('bomb-hit'), 2000);
        }

        await game.uiManager.animateHeartLoss(game.currentPlayer);
        player.lives--;
        game.uiManager.generatePlayerStatusCards();

        if (player.lives <= 0) {
            player.isAlive = false;
            game.playerManager.updateAllPlayerTokens();
            game.uiManager.updateGameMessage(`💀 ${player.name} has been eliminated by their own reversed bomb!`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) {
                game.handleLastPlayerWin();
                return;
            }
        }
    } else {
        await game.uiManager.animateHeartLoss(victimPlayerNum);
        victim.lives--;
        game.uiManager.generatePlayerStatusCards();

        if (victim.lives <= 0) {
            victim.isAlive = false;
            game.playerManager.updateAllPlayerTokens();
            game.uiManager.updateGameMessage(`💀 ${victim.name} has been eliminated by the bomb!`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) {
                game.handleLastPlayerWin();
                return;
            }
        }
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

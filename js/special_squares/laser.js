export async function handleLaserSquare(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];

    const possibleTargets = Object.values(game.playerManager.players)
        .filter(p => p.isAlive && p.id !== game.currentPlayer)
        .map(p => p.id);

    if (possibleTargets.length === 0) {
        game.uiManager.updateGameMessage(`🔫 Laser activated but no targets available!`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!fromKnockback) game.completeTurn();
        return;
    }

    game.audioManager.playGoodSound();

    const targetPlayerNum = await game.uiManager.animatePlayerSelection(possibleTargets, `🔫 ${player.name} activating laser targeting system...`);
    const target = game.playerManager.players[targetPlayerNum];

    const targetCard = document.getElementById(`player${targetPlayerNum}Card`);
    if (targetCard) {
        targetCard.classList.add('laser-hit');
        setTimeout(() => targetCard.classList.remove('laser-hit'), 2000);
    }

    game.uiManager.updateGameMessage(`🔫 ${player.name} fires laser at ${target.name}!`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (target.reverseCard) {
        target.reverseCard = false;
        game.uiManager.generatePlayerStatusCards();

        game.uiManager.updateGameMessage(`🛡️💥 ${target.name} deflects the laser back at ${player.name}!`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const attackerCard = document.getElementById(`player${game.currentPlayer}Card`);
        if (attackerCard) {
            attackerCard.classList.add('laser-hit');
            setTimeout(() => attackerCard.classList.remove('laser-hit'), 2000);
        }

        await game.uiManager.animateHeartLoss(game.currentPlayer);
        player.lives--;
        game.uiManager.generatePlayerStatusCards();

        if (player.lives <= 0) {
            player.isAlive = false;
            game.playerManager.updateAllPlayerTokens();
            game.uiManager.updateGameMessage(`💀 ${player.name} has been eliminated by their own reversed laser!`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) {
                game.handleLastPlayerWin();
                return;
            }
        } else {
            game.uiManager.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } else {
        await game.uiManager.animateHeartLoss(targetPlayerNum);
        target.lives--;
        game.uiManager.generatePlayerStatusCards();

        if (target.lives <= 0) {
            target.isAlive = false;
            game.playerManager.updateAllPlayerTokens();
            game.uiManager.updateGameMessage(`💀 ${target.name} has been eliminated by laser!`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) {
                game.handleLastPlayerWin();
                return;
            }
        } else {
            game.uiManager.updateGameMessage(`${target.name} has ${target.lives} lives remaining.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

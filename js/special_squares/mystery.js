export async function handleMysteryBox(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];

    const square = document.getElementById(`square-${player.position}`);
    if(square) square.classList.add('mystery-box-opening');

    game.uiManager.updateGameMessage(`❓ ${player.name} found a mystery box! Opening...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const rewards = [
        { type: 'extra_dice', weight: 15, icon: '🎲', name: 'Extra Dice' },
        { type: 'life_bonus', weight: 20, icon: '❤️', name: 'Life Bonus' },
        { type: 'reverse_card', weight: 10, icon: '🛡️', name: 'Reverse Card' },
        { type: 'forward_move', weight: 15, icon: '🚀', name: 'Forward Move' },
        { type: 'backward_move', weight: 10, icon: '⬅️', name: 'Backward Move' },
        { type: 'death_trap', weight: 8, icon: '💀', name: 'Death Trap' },
        { type: 'laser_attack', weight: 7, icon: '🔫', name: 'Laser Attack' },
        { type: 'bomb_blast', weight: 5, icon: '💣', name: 'Bomb Blast' },
        { type: 'wild_card', weight: 10, icon: '🎭', name: 'Wild Card' }
    ];

    const selectedReward = await game.uiManager.showSlotMachine(rewards);

    await applyMysteryReward(game, selectedReward.type, player);

    if(square) square.classList.remove('mystery-box-opening');

    delete game.boardManager.specialSquares[player.position];
    if(square) {
        square.classList.remove('mystery');
        square.innerHTML = '⭐';
    }

    if (!fromKnockback) {
        game.completeTurn();
    }
}

async function applyMysteryReward(game, rewardType, player) {
    switch (rewardType) {
        case 'extra_dice':
            player.extraDiceRemaining = 3;
            game.uiManager.updateGameMessage(`🎲 ${player.name} earned an Extra Dice!`);
            game.audioManager.playGoodSound();
            break;
        case 'life_bonus':
            if (player.lives < player.maxLives) {
                player.lives++;
                game.uiManager.updateGameMessage(`❤️ ${player.name} gained a life!`);
                game.audioManager.playGoodSound();
                game.uiManager.generatePlayerStatusCards();
            } else {
                game.uiManager.updateGameMessage(`💔 ${player.name} is already at maximum lives!`);
            }
            break;
        case 'reverse_card':
            player.reverseCard = true;
            game.uiManager.updateGameMessage(`🛡️ ${player.name} earned a Reverse Card!`);
            game.audioManager.playGoodSound();
            break;
        case 'forward_move':
            const forwardSpaces = 1 + Math.floor(Math.random() * 12);
            const newForwardPos = Math.min(player.position + forwardSpaces, 100);
            game.uiManager.updateGameMessage(`🚀 ${player.name} moves forward ${forwardSpaces} spaces!`);
            await game.uiManager.lightUpPath(player.position, newForwardPos, true);
            await game.uiManager.animateMovement(player, newForwardPos);
            game.uiManager.clearLitPath();
            await game.handlePlayerCollisions(newForwardPos);
            if (game.boardManager.specialSquares[newForwardPos]) await game.handleSpecialSquare(newForwardPos);
            else if (newForwardPos === 100) game.handleWin();
            break;
        case 'backward_move':
            const backwardSpaces = 1 + Math.floor(Math.random() * 12);
            const newBackwardPos = Math.max(player.position - backwardSpaces, 1);
            game.uiManager.updateGameMessage(`⬅️ ${player.name} moves backward ${backwardSpaces} spaces!`);
            await game.uiManager.lightUpPath(player.position, newBackwardPos, false);
            await game.uiManager.animateMovement(player, newBackwardPos);
            game.uiManager.clearLitPath();
            await game.handlePlayerCollisions(newBackwardPos);
            if (game.boardManager.specialSquares[newBackwardPos]) await game.handleSpecialSquare(newBackwardPos);
            break;
        case 'death_trap':
            game.uiManager.updateGameMessage(`💀 ${player.name} triggered a death trap!`);
            await game.uiManager.animateHeartLoss(game.currentPlayer);
            player.lives--;
            game.uiManager.generatePlayerStatusCards();
            if (player.lives <= 0) {
                player.isAlive = false;
                game.playerManager.updateAllPlayerTokens();
                if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) game.handleLastPlayerWin();
            }
            break;
        case 'laser_attack':
            game.uiManager.updateGameMessage(`🔫 ${player.name} activated a laser cannon!`);
            await game.specialSquareHandlers.laser(game, true); // True to prevent double turn completion
            break;
        case 'bomb_blast':
            game.uiManager.updateGameMessage(`💣 ${player.name} triggered a bomb!`);
            await game.specialSquareHandlers.bomb(game, true); // True to prevent double turn completion
            break;
        case 'wild_card':
            const wildRewards = ['extra_dice', 'life_bonus', 'reverse_card', 'forward_move'];
            const randomReward = wildRewards[Math.floor(Math.random() * wildRewards.length)];
            game.uiManager.updateGameMessage(`🎭 Wild Card! ${player.name} gets...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await applyMysteryReward(game, randomReward, player);
            break;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
}

export async function handleCometSquare(game, fromKnockback = false) {
    const player = game.playerManager.players[game.currentPlayer];

    game.audioManager.playExplosionSound();
    game.uiManager.updateGameMessage(`☄️ ${player.name} disturbed a comet field! Incoming meteor shower!`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const numComets = 3 + Math.floor(Math.random() * 4);
    game.uiManager.updateGameMessage(`☄️ ${numComets} comets incoming! Take cover!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const cometAnimations = [];
    for (let i = 0; i < numComets; i++) {
        cometAnimations.push(launchComet(game, i));
    }

    await Promise.all(cometAnimations);

    game.uiManager.updateGameMessage(`☄️ Meteor shower complete!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!fromKnockback) {
        game.completeTurn();
    }
}

async function launchComet(game, cometId) {
    const comet = document.createElement('div');
    comet.className = 'comet';
    comet.id = `comet-${cometId}`;
    comet.innerHTML = '☄️';

    const gameBoard = document.getElementById('gameBoard');
    const boardRect = gameBoard.getBoundingClientRect();

    const startEdge = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;

    switch (startEdge) {
        case 0: startX = Math.random() * boardRect.width; startY = -50; endX = Math.random() * boardRect.width; endY = boardRect.height + 50; break;
        case 1: startX = boardRect.width + 50; startY = Math.random() * boardRect.height; endX = -50; endY = Math.random() * boardRect.height; break;
        case 2: startX = Math.random() * boardRect.width; startY = boardRect.height + 50; endX = Math.random() * boardRect.width; endY = -50; break;
        case 3: startX = -50; startY = Math.random() * boardRect.height; endX = boardRect.width + 50; endY = Math.random() * boardRect.height; break;
    }

    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    comet.style.position = 'absolute';
    comet.style.left = `${startX}px`;
    comet.style.top = `${startY}px`;
    comet.style.transform = `rotate(${angle}deg)`;
    comet.style.fontSize = '2em';
    comet.style.zIndex = '2000';
    comet.style.transition = 'all 3s linear';
    comet.style.filter = 'drop-shadow(0 0 10px orange)';

    gameBoard.appendChild(comet);

    const collisionChecker = startCometCollisionDetection(game, comet, cometId);

    await new Promise(resolve => setTimeout(resolve, 100));
    comet.style.left = `${endX}px`;
    comet.style.top = `${endY}px`;

    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(collisionChecker);
    if (comet.parentNode) {
        comet.parentNode.removeChild(comet);
    }
}

function startCometCollisionDetection(game, comet, cometId) {
    return setInterval(() => {
        if (!comet.parentNode) return;

        const cometRect = comet.getBoundingClientRect();
        const cometCenterX = cometRect.left + cometRect.width / 2;
        const cometCenterY = cometRect.top + cometRect.height / 2;

        for (let playerNum = 1; playerNum <= game.playerManager.playerCount; playerNum++) {
            const player = game.playerManager.players[playerNum];
            if (!player.isAlive || !player.element) continue;

            const tokenRect = player.element.getBoundingClientRect();
            const tokenCenterX = tokenRect.left + tokenRect.width / 2;
            const tokenCenterY = tokenRect.top + tokenRect.height / 2;

            const distance = Math.sqrt(Math.pow(cometCenterX - tokenCenterX, 2) + Math.pow(cometCenterY - tokenCenterY, 2));

            if (distance < 40) {
                handleCometHit(game, player, playerNum, comet, cometId);
                return;
            }
        }
    }, 50);
}

async function handleCometHit(game, player, playerNum, comet, cometId) {
    if (comet.parentNode) {
        comet.parentNode.removeChild(comet);
    }

    const cometRect = comet.getBoundingClientRect();
    game.uiManager.createExplosionAt(cometRect.left + cometRect.width / 2, cometRect.top + cometRect.height / 2);
    game.audioManager.playExplosionSound();

    const loseLife = await game.uiManager.animateCometCoinFlip(player);

    if (loseLife) {
        game.uiManager.updateGameMessage(`☄️💥 Comet hit ${player.name}! Life lost!`);
        await new Promise(resolve => setTimeout(resolve, 500));

        await game.uiManager.animateHeartLoss(playerNum);
        player.lives--;
        game.uiManager.generatePlayerStatusCards();

        if (player.lives <= 0) {
            player.isAlive = false;
            game.playerManager.updateAllPlayerTokens();
            game.uiManager.updateGameMessage(`💀 ${player.name} has been eliminated by the comet!`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (Object.values(game.playerManager.players).filter(p => p.isAlive).length <= 1) {
                game.handleLastPlayerWin();
            }
        }
    } else {
        const knockbackSpaces = 1 + Math.floor(Math.random() * 12);
        const newPosition = Math.max(player.position - knockbackSpaces, 1);

        game.uiManager.updateGameMessage(`☄️💥 Comet hit ${player.name}! Knocked back ${knockbackSpaces} spaces!`);
        await new Promise(resolve => setTimeout(resolve, 500));

        await game.uiManager.animateSpinningMovement(player, newPosition);
        await game.handlePlayerCollisions(newPosition);
    }
}

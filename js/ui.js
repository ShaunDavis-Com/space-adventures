export class UIManager {
    constructor(game) {
        this.game = game;
        this.gameBoard = document.getElementById('gameBoard');
        this.dice1 = document.getElementById('dice1');
        this.diceCube1 = document.getElementById('diceCube1');
        this.dice2 = document.getElementById('dice2');
        this.gameMessage = document.getElementById('gameMessage');
        this.specialEffects = document.getElementById('specialEffects');
        this.tokenOverlay = document.getElementById('tokenOverlay');
        this.connectionsContainer = document.getElementById('boardConnections');
        this.playerStatus = document.getElementById('playerStatus');
        this.previousRankings = {};
    }

    // --- Core UI Updates ---
    updateGameMessage(message) {
        if (this.gameMessage) this.gameMessage.textContent = message;
    }

    setDiceInteractable(isInteractable) {
        this.dice1.classList.toggle('human-turn', isInteractable);
        this.dice1.style.opacity = '0.7';
    }

    updateControlPanel() {
        const activeAvatar = document.getElementById('activePlayerAvatar');
        if (!activeAvatar) return;
        const avatarToken = activeAvatar.querySelector('.avatar-token');
        const playerName = activeAvatar.querySelector('.player-name');

        const currentPlayer = this.game.playerManager.players[this.game.currentPlayer];
        avatarToken.textContent = currentPlayer.icon;
        avatarToken.style.background = currentPlayer.color;
        playerName.textContent = `${currentPlayer.name}'s Turn`;

        this.generatePlayerStatusCards();
    }

    generatePlayerStatusCards() {
        if (!this.playerStatus) return;
        const isInitialLoad = Object.keys(this.previousRankings).length === 0;
        this.playerStatus.className = 'player-status';

        const playersForLeaderboard = Object.values(this.game.playerManager.players).map(p => ({ id: p.id, player: p }));

        playersForLeaderboard.sort((a, b) => b.player.position - a.player.position || a.id - b.id);

        const currentRankings = {};
        playersForLeaderboard.forEach((entry, index) => { currentRankings[entry.id] = index + 1; });

        if (!isInitialLoad) {
            this.playerStatus.classList.add('leaderboard-shuffling');
            setTimeout(() => this.playerStatus.classList.remove('leaderboard-shuffling'), 1500);

            playersForLeaderboard.forEach((entry, newIndex) => {
                const cardId = `player${entry.id}Card`;
                const existingCard = document.getElementById(cardId);
                if (existingCard) {
                    existingCard.style.order = newIndex;
                    this.updatePlayerCardContent(existingCard, entry.player, entry.id);
                }
            });
        } else {
            this.playerStatus.innerHTML = '';
            playersForLeaderboard.forEach((entry, index) => {
                const card = this.createLeaderboardCard(entry, index);
                this.playerStatus.appendChild(card);
            });
        }
        this.previousRankings = currentRankings;
    }

    createLeaderboardCard(entry, index) {
        const card = document.createElement('div');
        card.className = `player-card ${entry.id === this.game.currentPlayer ? 'active' : ''}`;
        card.id = `player${entry.id}Card`;
        card.style.order = index;
        this.updatePlayerCardContent(card, entry.player, entry.id);
        return card;
    }

    updatePlayerCardContent(card, player, playerId) {
        const livesDisplay = player.isAlive ? '❤️'.repeat(player.lives) + '🖤'.repeat(Math.max(0, player.maxLives - player.lives)) : '🖤'.repeat(player.maxLives);
        const statusIndicators = [];
        if (player.extraDiceRemaining > 0) statusIndicators.push(`<span class="status-indicator extra-dice">🎲×${player.extraDiceRemaining}</span>`);
        if (player.reverseCard) statusIndicators.push(`<span class="status-indicator reverse-card">🛡️</span>`);
        card.classList.toggle('active', playerId === this.game.currentPlayer);
        card.innerHTML = `<div class="player-profile-section"><div class="player-avatar-container"><div class="avatar-token-clean" style="background: ${player.color};">${player.isAlive ? player.icon : '💀'}</div>${player.isBot && player.isAlive ? '<div class="bot-indicator-clean">🤖</div>' : ''}</div></div><div class="player-info-section"><div class="player-name-leaderboard">${player.name}${player.isBot ? ' (Bot)' : ''}</div><div class="player-stats-row"><div class="player-lives-leaderboard">${livesDisplay}</div></div>${statusIndicators.length > 0 ? '<div class="player-status-indicators-leaderboard">' + statusIndicators.join('') + '</div>' : ''}</div>`;
    }

    updateWinnerDisplay(winner) {
        const display = document.querySelector('.current-player-display');
        if(!display) return;
        display.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e)';
        const nameEl = display.querySelector('.player-name');
        nameEl.textContent = `🏆 ${winner.name} WINS! 🏆`;
    }

    // --- Animations & Effects ---
    async animateDiceRoll(roll1, roll2) {
        this.dice1.classList.add('rolling');
        if (roll2 > 0) this.dice2.style.display = 'block';
        await new Promise(r => setTimeout(r, 1000));
        this.dice1.classList.remove('rolling');
        this.diceCube1.className = 'dice-cube show-' + roll1;
        if (roll2 > 0) {
            await new Promise(r => setTimeout(r, 200));
            this.dice2.classList.add('rolling');
            await new Promise(r => setTimeout(r, 1000));
            this.dice2.classList.remove('rolling');
            document.getElementById('bonusValue').textContent = roll2;
        }
        await new Promise(r => setTimeout(r, 300));
    }

    async animateMovement(player, targetPosition) {
        const startPosition = player.position;
        const steps = Math.abs(targetPosition - startPosition);
        if (steps > 0) {
            const direction = targetPosition > startPosition ? 1 : -1;
            for (let i = 1; i <= steps; i++) {
                await this.animateToSingleSquare(player, startPosition + i * direction);
            }
        }
        player.position = targetPosition;
        this.game.boardManager.positionAllTokensOnSquare(targetPosition);
    }

    async animateToSingleSquare(player, targetPosition) {
        const targetSquare = document.getElementById(`square-${targetPosition}`);
        if (!targetSquare || !this.tokenOverlay) return;
        const overlayRect = this.tokenOverlay.getBoundingClientRect();
        const targetRect = targetSquare.getBoundingClientRect();
        const targetX = targetRect.left - overlayRect.left + targetRect.width / 2 - (player.element.offsetWidth / 2);
        const targetY = targetRect.top - overlayRect.top + targetRect.height / 2 - (player.element.offsetHeight / 2);
        player.element.style.transition = 'all 0.4s ease-in-out';
        player.element.style.left = `${targetX}px`;
        player.element.style.top = `${targetY}px`;
        await new Promise(r => setTimeout(r, 400));
        player.element.style.transition = '';
    }

    async lightUpPath(start, end, isGood) {
        const color = isGood ? '#00ff00' : '#ff0000';
        const direction = end > start ? 1 : -1;
        for (let i = start + direction; i !== end + direction; i += direction) {
            const square = document.getElementById(`square-${i}`);
            if (square) {
                square.style.boxShadow = `0 0 20px ${color}`;
                square.classList.add('lit-path');
            }
        }
    }

    clearLitPath() {
        document.querySelectorAll('.lit-path').forEach(sq => {
            sq.style.boxShadow = '';
            sq.classList.remove('lit-path');
        });
    }

    async animateHeartLoss(playerNum) {
        const card = document.getElementById(`player${playerNum}Card`);
        if (!card) return;
        card.classList.add('life-lost');
        setTimeout(() => card.classList.remove('life-lost'), 1500);
        const livesElement = card.querySelector('.player-lives-leaderboard');
        if (livesElement && livesElement.textContent.includes('❤️')) {
            const heartSpan = document.createElement('span');
            heartSpan.textContent = '❤️';
            heartSpan.className = 'heart-losing';
            livesElement.innerHTML = livesElement.innerHTML.replace(/❤️(?!.*❤️)/, heartSpan.outerHTML);
            await new Promise(r => setTimeout(r, 1200));
        }
    }

    createKnockbackEffect(position) {
        const square = document.getElementById(`square-${position}`);
        if(!square) return;
        const rect = square.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.className = 'knockback-effect';
        effect.textContent = '💥';
        effect.style.position = 'absolute';
        effect.style.left = `${rect.left + rect.width / 2 - 20}px`;
        effect.style.top = `${rect.top + rect.height / 2 - 20}px`;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    createCelebrationEffects() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'explosion-effect';
                effect.style.left = `${Math.random() * window.innerWidth}px`;
                effect.style.top = `${Math.random() * window.innerHeight}px`;
                this.specialEffects.appendChild(effect);
                setTimeout(() => effect.remove(), 1000);
            }, i * 200);
        }
    }

    startAnimatedBackground() {
        setInterval(() => {
            const rocket = document.createElement('div');
            rocket.className = 'background-rocket';
            rocket.textContent = '🚀';
            rocket.style.left = `${Math.random() * 100}%`;
            rocket.style.animationDuration = `${5 + Math.random() * 5}s`;
            document.body.appendChild(rocket);
            setTimeout(() => rocket.remove(), 10000);
        }, 8000);
    }
}

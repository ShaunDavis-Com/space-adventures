import { AVAILABLE_COLORS, CHARACTER_PROFILES, CHARACTER_TYPES } from './config.js';

export class Player {
    constructor(id, name, icon, color, isBot = false) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.isBot = isBot;
        this.position = 1;
        this.lives = 3;
        this.maxLives = 3;
        this.isAlive = true;
        this.extraDiceRemaining = 0;
        this.reverseCard = false;
        this.element = null; // The token element on the board
    }
}

export class PlayerManager {
    constructor(game) {
        this.game = game;
        this.players = {};
        this.playerCount = 2;
        this.maxPlayers = 6;
        this.minPlayers = 2;

        this.availableColors = [...AVAILABLE_COLORS];
        this.characterProfiles = { ...CHARACTER_PROFILES };
        this.characterTypes = [...CHARACTER_TYPES];

        this.initializePlayers();
    }

    initializePlayers() {
        const oldPlayers = this.players;
        this.players = {};
        for (let i = 1; i <= this.playerCount; i++) {
            if (oldPlayers[i]) {
                this.players[i] = oldPlayers[i];
            } else {
                const characterType = this.characterTypes[i - 1];
                const profile = this.characterProfiles[characterType];
                this.players[i] = new Player(
                    i,
                    profile.name,
                    profile.icon,
                    this.availableColors[i - 1]
                );
            }
        }
    }

    setupPlayerManagement() {
        const addPlayerBtn = document.getElementById('addPlayer');
        const removePlayerBtn = document.getElementById('removePlayer');

        addPlayerBtn.addEventListener('click', () => this.updatePlayerCount(1));
        removePlayerBtn.addEventListener('click', () => this.updatePlayerCount(-1));

        this.updateStartButtonState();
        this.generatePlayerCards();
    }

    updatePlayerCount(change) {
        const newCount = this.playerCount + change;
        if (newCount >= this.minPlayers && newCount <= this.maxPlayers) {
            this.playerCount = newCount;
            this.initializePlayers();
            this.generatePlayerCards();
            this.updateStartButtonState();
        }
    }

    updateStartButtonState() {
        const startBtn = document.getElementById('startBtn');
        if (!startBtn) return;
        startBtn.disabled = this.playerCount < this.minPlayers;
        startBtn.textContent = this.playerCount < this.minPlayers ? 'Need at least 2 players' : 'Start Cosmic Adventure';
    }

    generatePlayerCards() {
        const container = document.getElementById('setupContainer');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= this.playerCount; i++) {
            const card = this.createPlayerCard(i);
            container.appendChild(card);
        }
        const playerCountDisplay = document.getElementById('playerCount');
        if(playerCountDisplay) {
            playerCountDisplay.textContent = `${this.playerCount}`;
        }
    }

    createPlayerCard(playerNum) {
        const player = this.players[playerNum];
        const card = document.createElement('div');
        card.className = 'player-card-setup';
        card.id = `player-card-setup-${playerNum}`;

        const characterType = Object.keys(this.characterProfiles).find(key => this.characterProfiles[key].icon === player.icon);

        card.innerHTML = `
            <h3>${player.name}</h3>
            <div class="player-icon-setup" style="background-color: ${player.color};">${player.icon}</div>
            <div class="player-controls">
                <button class="icon-change-btn prev-icon" data-player="${playerNum}" data-direction="-1">◀</button>
                <span>${characterType}</span>
                <button class="icon-change-btn next-icon" data-player="${playerNum}" data-direction="1">▶</button>
            </div>
            <div class="player-color-controls">
                <button class="color-change-btn prev-color" data-player="${playerNum}" data-direction="-1">◀</button>
                <span>Color</span>
                <button class="color-change-btn next-color" data-player="${playerNum}" data-direction="1">▶</button>
            </div>
            <div class="player-name-input-container">
                <input type="text" class="player-name-input" value="${player.name}" placeholder="Enter Name" data-player="${playerNum}">
            </div>
            <button class="toggle-bot-btn" data-player="${playerNum}">${player.isBot ? '🤖 Bot' : '🧑 Human'}</button>
        `;
        this.setupCardEventListeners(card);
        return card;
    }

    setupCardEventListeners(card) {
        card.querySelector('.prev-icon').addEventListener('click', (e) => this.changePlayerIcon(parseInt(e.target.dataset.player), parseInt(e.target.dataset.direction)));
        card.querySelector('.next-icon').addEventListener('click', (e) => this.changePlayerIcon(parseInt(e.target.dataset.player), parseInt(e.target.dataset.direction)));
        card.querySelector('.prev-color').addEventListener('click', (e) => this.changePlayerColor(parseInt(e.target.dataset.player), parseInt(e.target.dataset.direction)));
        card.querySelector('.next-color').addEventListener('click', (e) => this.changePlayerColor(parseInt(e.target.dataset.player), parseInt(e.target.dataset.direction)));
        card.querySelector('.toggle-bot-btn').addEventListener('click', (e) => this.togglePlayerBot(parseInt(e.target.dataset.player)));
        card.querySelector('.player-name-input').addEventListener('change', (e) => {
            this.players[parseInt(e.target.dataset.player)].name = e.target.value;
            this.updatePlayerCard(parseInt(e.target.dataset.player));
        });
    }

    changePlayerIcon(playerNum, direction) {
        const player = this.players[playerNum];
        const currentProfileKey = Object.keys(this.characterProfiles).find(key => this.characterProfiles[key].icon === player.icon);
        const currentIndex = this.characterTypes.indexOf(currentProfileKey);

        let newIndex = (currentIndex + direction + this.characterTypes.length) % this.characterTypes.length;
        const newType = this.characterTypes[newIndex];
        const newProfile = this.characterProfiles[newType];

        player.icon = newProfile.icon;
        if (player.name === this.characterProfiles[currentProfileKey].name) {
            player.name = newProfile.name;
        }
        this.updatePlayerCard(playerNum);
    }

    changePlayerColor(playerNum, direction) {
        const player = this.players[playerNum];
        const currentIndex = AVAILABLE_COLORS.indexOf(player.color);
        let newIndex = (currentIndex + direction + AVAILABLE_COLORS.length) % AVAILABLE_COLORS.length;

        player.color = AVAILABLE_COLORS[newIndex];
        this.updatePlayerCard(playerNum);
    }

    togglePlayerBot(playerNum) {
        const player = this.players[playerNum];
        player.isBot = !player.isBot;
        this.updatePlayerCard(playerNum);
    }

    updatePlayerCard(playerNum) {
        const player = this.players[playerNum];
        const card = document.getElementById(`player-card-setup-${playerNum}`);
        if (!card) return;

        const characterType = Object.keys(this.characterProfiles).find(key => this.characterProfiles[key].icon === player.icon);

        card.querySelector('h3').textContent = player.name;
        card.querySelector('.player-icon-setup').style.backgroundColor = player.color;
        card.querySelector('.player-icon-setup').textContent = player.icon;
        card.querySelector('.player-name-input').value = player.name;
        card.querySelector('.toggle-bot-btn').textContent = player.isBot ? '🤖 Bot' : '🧑 Human';
        card.querySelector('.prev-icon + span').textContent = characterType;
    }

    handleBotTurn() {
        const player = this.players[this.game.currentPlayer];
        if (!player.isBot || this.game.isRolling || this.game.gameWon || !player.isAlive) {
            return;
        }

        this.game.ui.setDiceInteractable(false);

        const thinkTime = 1000 + Math.random() * 2000;

        setTimeout(() => {
            if (player.isBot && !this.game.gameWon && !this.game.isRolling) {
                this.game.rollDice();
            }
        }, thinkTime);
    }

    createPlayerToken(playerNum) {
        const player = this.players[playerNum];
        const token = document.createElement('div');
        token.className = 'player-token';
        token.id = `token-${playerNum}`;
        token.style.zIndex = '2000';

        this.updatePlayerTokenContent(token, player);
        return token;
    }

    updatePlayerTokenContent(token, player) {
        const displayIcon = player.isAlive ? player.icon : '💀';

        token.innerHTML = `
            <div class="token-circle" style="background: ${player.color}; z-index: 2001; position: relative;">
                ${displayIcon}
            </div>
            <div class="token-name" style="z-index: 2002; position: relative;">${player.name}</div>
        `;
    }

    updateAllPlayerTokens() {
        for (let i = 1; i <= this.playerCount; i++) {
            const token = document.getElementById(`token-${i}`);
            if (token) {
                this.updatePlayerTokenContent(token, this.players[i]);
            }
        }
    }
}

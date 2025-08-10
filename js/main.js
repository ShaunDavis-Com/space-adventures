import { AudioManager } from './audio.js';
import { PlayerManager } from './player.js';
import { UIManager } from './ui.js';
import { BoardManager } from './board.js';
// Import handlers for special squares
import { handleDeathSquare } from './special_squares/death.js';
import { handleLaserSquare } from './special_squares/laser.js';
import { handleBombSquare } from './special_squares/bomb.js';
import { handleCometSquare } from './special_squares/comet.js';
import { handleTeleportSquare } from './special_squares/teleport.js';
import { handleMysteryBox } from './special_squares/mystery.js';
import { handleBoardSwitcher } from './special_squares/switcher.js';
import { handleLifeCollectible, handleShieldCollectible, handleDiceCollectible } from './special_squares/collectibles.js';
import { handleGoodSquare, handleBadSquare } from './special_squares/good_bad.js';


class SpaceSnakesAndLadders {
    constructor() {
        this.audioManager = new AudioManager(this);
        this.playerManager = new PlayerManager(this);
        this.uiManager = new UIManager(this);
        this.boardManager = new BoardManager(this);

        this.specialSquareHandlers = {
            'death': handleDeathSquare,
            'laser': handleLaserSquare,
            'bomb': handleBombSquare,
            'comet': handleCometSquare,
            'teleport': handleTeleportSquare,
            'mystery': handleMysteryBox,
            'switcher': handleBoardSwitcher,
            'life_collectible': handleLifeCollectible,
            'shield_collectible': handleShieldCollectible,
            'dice_collectible': handleDiceCollectible,
            'good': handleGoodSquare,
            'bad': handleBadSquare
        };

        this.currentPlayer = 1;
        this.isRolling = false;
        this.gameWon = false;
        this.gameStarted = false;
        this.lastRoll = 0;
        this.mainDiceRoll = 0;

        this.audioManager.initializeAudio();
        this.init();
    }

    init() {
        this.playerManager.setupPlayerManagement();
        this.uiManager.updateGameMessage('Welcome to Space! Customize your astronauts and begin your cosmic journey!');
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('toggleAudio').addEventListener('click', () => this.audioManager.toggleAudio());
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
    }

    async startGame() {
        this.gameStarted = true;

        await this.audioManager.initializeAudioContext();

        document.getElementById('playerSetup').style.display = 'none';
        const gameTitle = document.querySelector('.game-title');
        if (gameTitle) gameTitle.style.display = 'none';
        document.getElementById('gameLayout').style.display = 'flex';

        this.uiManager.updateControlPanel();
        this.boardManager.createBoard();
        this.setupGameEventListeners();
        this.boardManager.placeInitialTokens();
        this.uiManager.startAnimatedBackground();
        this.audioManager.playBackgroundMusic();

        const firstPlayer = this.playerManager.players[1];
        this.uiManager.updateGameMessage(`${firstPlayer.name}'s turn! ${firstPlayer.isBot ? 'Bot is thinking...' : 'Roll the dice to begin your space adventure!'}`);

        if (firstPlayer.isBot) {
            this.playerManager.handleBotTurn();
        } else {
            this.uiManager.setDiceInteractable(true);
        }
    }

    startNewGame() {
        this.gameStarted = false;
        this.gameWon = false;
        this.currentPlayer = 1;
        this.isRolling = false;

        this.playerManager.initializePlayers();

        document.getElementById('gameLayout').style.display = 'none';
        document.getElementById('playerSetup').style.display = 'block';

        const newGameBtn = document.getElementById('newGameBtn');
        const diceSection = document.querySelector('.dice-section');
        if (newGameBtn) newGameBtn.style.display = 'none';
        if (diceSection) diceSection.style.display = 'block';

        this.playerManager.updateStartButtonState();
        this.uiManager.updateGameMessage('Select your space explorers for the next adventure!');

        if (this.audioManager.backgroundMusic) {
            this.audioManager.backgroundMusic.pause();
            this.audioManager.backgroundMusic.currentTime = 0;
        }

        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) gameBoard.innerHTML = '';
        const tokenOverlay = document.getElementById('tokenOverlay');
        if (tokenOverlay) tokenOverlay.innerHTML = '';
    }

    setupGameEventListeners() {
        this.uiManager.dice1.addEventListener('click', () => {
            if (!this.playerManager.players[this.currentPlayer].isBot && !this.isRolling && !this.gameWon) {
                this.rollDice();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling && !this.gameWon && this.gameStarted) {
                e.preventDefault();
                if (!this.playerManager.players[this.currentPlayer].isBot) {
                    this.rollDice();
                }
            }
        });
    }

    async rollDice() {
        if (this.isRolling || this.gameWon) return;

        const player = this.playerManager.players[this.currentPlayer];
        if (!player.isAlive) {
            this.switchPlayer();
            return;
        }

        this.isRolling = true;
        this.uiManager.setDiceInteractable(false);
        this.audioManager.playDiceSound();

        const hasExtraDice = player.extraDiceRemaining > 0;
        let roll1 = Math.floor(Math.random() * 6) + 1;
        let roll2 = 0;
        let finalValue;

        if (hasExtraDice) {
            roll2 = Math.floor(Math.random() * 6) + 1;
            finalValue = roll1 + roll2;
            this.uiManager.updateGameMessage(`🎲💰 ${player.name} rolls twice: ${roll1} + ${roll2} = ${finalValue} spaces!`);
            player.extraDiceRemaining--;
        } else {
            finalValue = roll1;
        }

        this.lastRoll = finalValue;
        this.mainDiceRoll = roll1;

        await this.uiManager.animateDiceRoll(roll1, hasExtraDice ? roll2 : 0);
        await this.movePlayer(finalValue);
    }

    async movePlayer(diceValue) {
        const player = this.playerManager.players[this.currentPlayer];
        const newPosition = Math.min(player.position + diceValue, 100);

        this.uiManager.updateGameMessage(`${player.name} rolled ${diceValue}! Moving to square ${newPosition}...`);

        await this.uiManager.animateMovement(player, newPosition);

        await this.handlePlayerCollisions(newPosition);

        if (this.boardManager.specialSquares[newPosition]) {
            await this.handleSpecialSquare(newPosition);
        } else if (newPosition === 100) {
            this.handleWin();
        } else {
            this.completeTurn();
        }
    }

    async handlePlayerCollisions(position) {
        if (position === 1) return;

        const currentPlayerNum = this.currentPlayer;
        const playersOnSquare = Object.values(this.playerManager.players).filter(p => p.position === position && p.id !== currentPlayerNum);

        for (const otherPlayer of playersOnSquare) {
            if (otherPlayer.isAlive) {
                await this.knockPlayerBack(otherPlayer.id, position);
            } else {
                const totalAlive = Object.values(this.playerManager.players).filter(p => p.isAlive).length;
                if (totalAlive > 1) {
                    await this.handlePlayerRevival(otherPlayer.id, currentPlayerNum);
                }
            }
        }
    }

    async knockPlayerBack(playerNum, fromPosition) {
        const player = this.playerManager.players[playerNum];
        if (!player.isAlive) return;

        const originalCurrentPlayer = this.currentPlayer;

        const randomMovement = 1 + Math.floor(Math.random() * 12);
        const goForward = Math.random() < 0.5;
        const newPosition = goForward ? Math.min(player.position + randomMovement, 100) : Math.max(player.position - randomMovement, 1);

        this.uiManager.updateGameMessage(`💥 ${this.playerManager.players[this.currentPlayer].name} landed on ${player.name}! Random knockback!`);
        goForward ? this.audioManager.playGoodSound() : this.audioManager.playBadSound();
        this.uiManager.createKnockbackEffect(fromPosition);
        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.uiManager.lightUpPath(player.position, newPosition, goForward);
        await this.uiManager.animateMovement(player, newPosition);
        this.uiManager.clearLitPath();

        await this.handlePlayerCollisions(newPosition);

        if (this.boardManager.specialSquares[newPosition]) {
            this.currentPlayer = playerNum;
            await this.handleSpecialSquare(newPosition, true);
        }

        if (player.position === 100) {
            this.currentPlayer = playerNum;
            this.handleWin();
        }

        this.currentPlayer = originalCurrentPlayer;
    }

    async handlePlayerRevival(deadPlayerNum, reviverPlayerNum) {
        const deadPlayer = this.playerManager.players[deadPlayerNum];
        const reviverPlayer = this.playerManager.players[reviverPlayerNum];

        if (reviverPlayer.lives <= 1) {
            this.uiManager.updateGameMessage(`💔 ${reviverPlayer.name} doesn't have enough lives to revive ${deadPlayer.name}!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }

        this.uiManager.updateGameMessage(`✨ ${reviverPlayer.name} sacrifices a life to revive ${deadPlayer.name}! 💖`);
        this.audioManager.playGoodSound();

        reviverPlayer.lives--;
        deadPlayer.lives = 1;
        deadPlayer.isAlive = true;

        this.playerManager.updateAllPlayerTokens();
        this.uiManager.updateControlPanel();

        await new Promise(resolve => setTimeout(resolve, 500));
        await this.knockPlayerBack(deadPlayerNum, deadPlayer.position);
    }

    async handleSpecialSquare(position, fromKnockback = false) {
        const special = this.boardManager.specialSquares[position];
        if (!special) {
            if (!fromKnockback) this.completeTurn();
            return;
        }
        const handler = this.specialSquareHandlers[special.type];
        if (handler) {
            await handler(this, fromKnockback);
        } else {
            console.warn(`No handler for special square type: ${special.type}`);
            if (!fromKnockback) this.completeTurn();
        }
    }

    completeTurn() {
        if (this.gameWon) return;
        if (this.mainDiceRoll === 6) {
            const player = this.playerManager.players[this.currentPlayer];
            this.uiManager.updateGameMessage(`🎉 ${player.name} rolled a 6! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    enableNextTurn() {
        this.isRolling = false;
        const player = this.playerManager.players[this.currentPlayer];
        if (player.isBot) {
            this.playerManager.handleBotTurn();
        } else {
            this.uiManager.setDiceInteractable(true);
        }
    }

    switchPlayer() {
        let nextPlayerId = this.currentPlayer;
        let attempts = 0;
        do {
            nextPlayerId = (nextPlayerId % this.playerManager.playerCount) + 1;
            attempts++;
        } while (!this.playerManager.players[nextPlayerId].isAlive && attempts <= this.playerManager.playerCount);

        this.currentPlayer = nextPlayerId;

        this.uiManager.updateControlPanel();
        this.isRolling = false;

        const newPlayer = this.playerManager.players[this.currentPlayer];
        if (newPlayer.isAlive) {
            this.uiManager.updateGameMessage(`${newPlayer.name}'s turn! ${newPlayer.isBot ? 'Bot is thinking...' : 'Click the dice!'}`);
            if (newPlayer.isBot) {
                setTimeout(() => this.playerManager.handleBotTurn(), 500);
            } else {
                this.uiManager.setDiceInteractable(true);
            }
        }
    }

    handleWin() {
        if (this.gameWon) return;
        this.gameWon = true;
        const winner = this.playerManager.players[this.currentPlayer];
        this.uiManager.updateGameMessage(`🎉 ${winner.name} wins! Congratulations, Space Explorer! 🚀`);
        this.uiManager.updateWinnerDisplay(winner);
        this.uiManager.setDiceInteractable(false);
        this.audioManager.playWinnerSound();
        this.uiManager.createCelebrationEffects();

        const diceSection = document.querySelector('.dice-section');
        const newGameBtn = document.getElementById('newGameBtn');
        if (diceSection) diceSection.style.display = 'none';
        if (newGameBtn) newGameBtn.style.display = 'block';
    }

    handleLastPlayerWin() {
        const lastAlivePlayer = Object.values(this.playerManager.players).find(p => p.isAlive);
        if (lastAlivePlayer) {
            this.currentPlayer = lastAlivePlayer.id;
            this.handleWin();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new SpaceSnakesAndLadders();
});

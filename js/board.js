export class BoardManager {
    constructor(game) {
        this.game = game;
        this.specialSquares = {};
        this.gameBoard = document.getElementById('gameBoard');
        this.tokenOverlay = document.getElementById('tokenOverlay');
        this.connectionsContainer = document.getElementById('boardConnections');
    }

    createBoard() {
        this.generateRandomSpecialSquares();

        const squares = [];
        for (let i = 1; i <= 100; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `square-${i}`;

            this.styleSquare(square, i);
            squares[i] = square;
        }

        for (let row = 9; row >= 0; row--) {
            const isEvenRow = row % 2 === 0;
            for (let col = 0; col < 10; col++) {
                const realCol = isEvenRow ? col : 9 - col;
                const squareNum = (row * 10) + realCol + 1;
                if (squares[squareNum]) {
                    this.gameBoard.appendChild(squares[squareNum]);
                }
            }
        }
        this.createBoardConnections();
    }

    styleSquare(square, i) {
        if (i === 1) {
            square.classList.add('start');
            square.innerHTML = '🚀';
        } else if (i === 100) {
            square.classList.add('finish');
            square.innerHTML = '🏆';
        } else if (this.specialSquares[i]) {
            const special = this.specialSquares[i];
            square.classList.add(special.type);
            const iconMap = {
                good: '🟢', bad: '🔴', switcher: '🔀', death: '💀', laser: '🔫',
                bomb: '💣', mystery: '❓', teleport: '🛸', comet: '☄️',
                life_collectible: '❤️', shield_collectible: '🛡️', dice_collectible: '🎲'
            };
            square.innerHTML = iconMap[special.type] || '⭐';
        } else {
            square.classList.add('normal');
            const spaceIcons = ['⭐', '🌟', '✨', '💫', '🌠', '🌌', '⚡', '🌍', '🌙', '🪐', '🛰️', '🤖', '👽', '👾'];
            square.innerHTML = spaceIcons[Math.floor(Math.random() * spaceIcons.length)];
        }
    }

    generateRandomSpecialSquares() {
        // Implementation from game.js, simplified for brevity
        this.specialSquares = {};
        const usedSquares = new Set([1, 100]);

        const addSpecial = (type, count, min, max) => {
            for (let i = 0; i < count; i++) {
                let squareNum;
                do {
                    squareNum = min + Math.floor(Math.random() * (max - min));
                } while (usedSquares.has(squareNum));
                usedSquares.add(squareNum);
                this.specialSquares[squareNum] = { type: type, effect: type };
            }
        };

        addSpecial('switcher', 4 + Math.floor(Math.random() * 5), 10, 90);
        addSpecial('life_collectible', 2 + Math.floor(Math.random() * 5), 5, 95);
        addSpecial('shield_collectible', 2 + Math.floor(Math.random() * 5), 5, 95);
        addSpecial('dice_collectible', 1 + Math.floor(Math.random() * 4), 10, 90);
        addSpecial('comet', 2 + Math.floor(Math.random() * 5), 15, 85);
        addSpecial('death', 2 + Math.floor(Math.random() * 2), 15, 85);
        addSpecial('laser', 2 + Math.floor(Math.random() * 2), 15, 85);
        addSpecial('bomb', 2 + Math.floor(Math.random() * 2), 15, 85);
        addSpecial('teleport', 2 + Math.floor(Math.random() * 3), 10, 90);
        addSpecial('mystery', 4 + Math.floor(Math.random() * 5), 5, 95);
        addSpecial('good', 4 + Math.floor(Math.random() * 2), 2, 99);
        addSpecial('bad', 4 + Math.floor(Math.random() * 2), 2, 99);
    }

    createBoardConnections() {
        // This is primarily a UI function, but is tied to board state.
        // A better refactor might move this to UI manager and have it query board manager.
        // For now, keeping it here for simplicity.
        this.connectionsContainer.innerHTML = '';
        // Visual connection logic would go here...
    }

    placeInitialTokens() {
        const players = this.game.playerManager.players;
        for (let i = 1; i <= this.game.playerManager.playerCount; i++) {
            players[i].element = this.game.playerManager.createPlayerToken(i);
            this.tokenOverlay.appendChild(players[i].element);
        }
        this.positionAllTokensOnSquare(1);
    }

    positionAllTokensOnSquare(squareNumber) {
        const square = document.getElementById(`square-${squareNumber}`);
        if (!square) return;

        const overlayRect = this.tokenOverlay.getBoundingClientRect();
        const squareRect = square.getBoundingClientRect();
        const baseX = squareRect.left - overlayRect.left + squareRect.width / 2;
        const baseY = squareRect.top - overlayRect.top + squareRect.height / 2;

        const playersOnSquare = Object.values(this.game.playerManager.players).filter(p => p.position === squareNumber);

        playersOnSquare.forEach((player, index) => {
            const token = player.element;
            if (!token) return;
            token.style.display = 'block';
            const offset = this.calculateTokenOffset(index, playersOnSquare.length);
            token.style.left = `${baseX + offset.x - 30}px`;
            token.style.top = `${baseY + offset.y - 37.5}px`;
        });
    }

    calculateTokenOffset(index, totalTokens) {
        if (totalTokens === 1) return { x: 0, y: 0 };
        if (totalTokens === 2) return { x: index === 0 ? -15 : 15, y: 0 };
        if (totalTokens === 3) {
            if (index === 0) return { x: 0, y: -10 };
            return { x: index === 1 ? -15 : 15, y: 10 };
        }
        // Add more cases as needed for 4, 5, 6 players
        const angle = (index / totalTokens) * 2 * Math.PI;
        const radius = 20;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }

    recreateBoardSquares() {
        for (let i = 1; i <= 100; i++) {
            const square = document.getElementById(`square-${i}`);
            if (!square) continue;
            this.styleSquare(square, i);
        }
        this.createBoardConnections();
    }
}

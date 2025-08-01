class SpaceSnakesAndLadders {
    constructor() {
        this.currentPlayer = 1;
        this.playerCount = 2;
        this.maxPlayers = 6;
        this.minPlayers = 2;
        this.players = {};
        this.gameBoard = null;
        this.dice = null;
        this.rollButton = null;
        this.gameMessage = null;
        this.specialEffects = null;
        this.isRolling = false;
        this.gameWon = false;
        this.gameStarted = false;
        this.lastRoll = 0;
        this.mainDiceRoll = 0;
        
        // Audio system
        this.backgroundMusic = null;
        this.musicTracks = [];
        this.diceSounds = [];
        this.goodSounds = [];
        this.badSounds = [];
        this.robotSounds = [];
        this.randomSounds = [];
        this.explosionSounds = [];
        this.winnerSounds = [];
        this.audioEnabled = true;
        
        // Available colors for players
        this.availableColors = [
            { name: 'blue', value: '#4285f4' },
            { name: 'pink', value: '#e91e63' },
            { name: 'green', value: '#34a853' },
            { name: 'red', value: '#ea4335' },
            { name: 'purple', value: '#9c27b0' },
            { name: 'orange', value: '#ff9800' },
            { name: 'cyan', value: '#00ffff' },
            { name: 'yellow', value: '#ffff00' }
        ];

        // Available character profiles
        this.characterProfiles = [
            { id: 'astronaut_male', icon: '👨‍🚀', name: 'Male Astronaut', category: 'Human' },
            { id: 'astronaut_female', icon: '👩‍🚀', name: 'Female Astronaut', category: 'Human' },
            { id: 'alien_green', icon: '👽', name: 'Green Alien', category: 'Alien' },
            { id: 'alien_ufo', icon: '🛸', name: 'UFO Pilot', category: 'Alien' },
            { id: 'robot', icon: '🤖', name: 'Android', category: 'Robot' },
            { id: 'scientist_male', icon: '👨‍🔬', name: 'Male Scientist', category: 'Human' },
            { id: 'scientist_female', icon: '👩‍🔬', name: 'Female Scientist', category: 'Human' },
            { id: 'explorer_male', icon: '👨‍🚀', name: 'Male Explorer', category: 'Human' },
            { id: 'explorer_female', icon: '👩‍🚀', name: 'Female Explorer', category: 'Human' },
            { id: 'alien_monster', icon: '👾', name: 'Space Monster', category: 'Alien' },
            { id: 'computer_operator', icon: '🧑‍💻', name: 'Computer Operator', category: 'Human' }
        ];

        // Available character types for players
        this.characterTypes = [
            { id: 'astronaut_male', name: 'Male Astronaut', icon: '👨‍🚀', type: 'human' },
            { id: 'astronaut_female', name: 'Female Astronaut', icon: '👩‍🚀', type: 'human' },
            { id: 'alien_green', name: 'Green Alien', icon: '👽', type: 'alien' },
            { id: 'alien_monster', name: 'Space Monster', icon: '👾', type: 'alien' },
            { id: 'robot', name: 'Space Robot', icon: '🤖', type: 'robot' },
            { id: 'satellite', name: 'Satellite', icon: '🛰️', type: 'tech' },
            { id: 'ufo', name: 'UFO Pilot', icon: '🛸', type: 'alien' },
            { id: 'rocket', name: 'Rocket Ship', icon: '🚀', type: 'tech' },
            { id: 'alien_blue', name: 'Space Creature', icon: '👹', type: 'alien' },
            { id: 'wizard', name: 'Space Wizard', icon: '🧙‍♂️', type: 'magic' },
            { id: 'witch', name: 'Space Witch', icon: '🧙‍♀️', type: 'magic' }
        ];

        this.currentPlayer = 1;
        this.playerCount = 2;
        this.maxPlayers = 6;
        this.minPlayers = 2;
        this.players = {};
        
        // Initialize audio and players
        this.initializeAudio();
        this.initializePlayers();

        // Special squares configuration (1-100)
        this.specialSquares = {
            // Good squares (teleporters, wormholes, friendly aliens)
            7: { type: 'good', effect: 'teleport', destination: 23, message: '🛸 Friendly aliens beam you forward!' },
            15: { type: 'good', effect: 'wormhole', destination: 35, message: '🌌 You found a cosmic wormhole!' },
            22: { type: 'good', effect: 'boost', destination: 42, message: '🚀 Rocket boost activated!' },
            28: { type: 'good', effect: 'teleport', destination: 50, message: '👽 Alien allies teleport you ahead!' },
            36: { type: 'good', effect: 'wormhole', destination: 58, message: '⭐ Space-time shortcut discovered!' },
            45: { type: 'good', effect: 'boost', destination: 67, message: '🛰️ Satellite slingshot maneuver!' },
            51: { type: 'good', effect: 'teleport', destination: 73, message: '🌟 Cosmic energy propels you forward!' },
            62: { type: 'good', effect: 'wormhole', destination: 81, message: '🚀 Hyperdrive engaged!' },
            71: { type: 'good', effect: 'boost', destination: 89, message: '👽 Friendly mothership gives you a lift!' },

            // Bad squares (black holes, meteor showers, hostile aliens)
            13: { type: 'bad', effect: 'blackhole', destination: 3, message: '🕳️ Sucked into a black hole!' },
            19: { type: 'bad', effect: 'meteor', destination: 8, message: '☄️ Meteor shower knocks you back!' },
            31: { type: 'bad', effect: 'hostile', destination: 12, message: '👾 Hostile aliens capture you!' },
            38: { type: 'bad', effect: 'blackhole', destination: 18, message: '🌑 Dark matter pulls you backward!' },
            47: { type: 'bad', effect: 'meteor', destination: 26, message: '💥 Asteroid collision detected!' },
            54: { type: 'bad', effect: 'hostile', destination: 33, message: '🛸 UFO abduction in progress!' },
            64: { type: 'bad', effect: 'blackhole', destination: 44, message: '🕳️ Gravitational anomaly detected!' },
            76: { type: 'bad', effect: 'meteor', destination: 55, message: '☄️ Space debris field encountered!' },
            87: { type: 'bad', effect: 'hostile', destination: 68, message: '👾 Caught in alien tractor beam!' },
            92: { type: 'bad', effect: 'blackhole', destination: 72, message: '🌌 Pulled into space-time vortex!' },
            98: { type: 'bad', effect: 'meteor', destination: 79, message: '💫 Solar flare pushes you back!' }
        };

        this.init();
    }

    initializeAudio() {
        // Initialize Web Audio Context immediately
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✓ Web Audio Context created');
        } catch (error) {
            console.warn('Could not create audio context:', error);
        }
        
        // Always create backup sounds first
        this.createBackupSounds();
        
        // Try to load music tracks from music folder - check different extensions
        this.musicTracks = [];
        this.diceSounds = [];
        
        // Load actual music files from the music directory
        const musicFiles = [
            './music/above-enzalla-main-version-02-10-12207.mp3',
            './music/evolution-all-good-folks-main-version-01-08-6202.mp3',
            './music/slow-current-adi-goldstein-main-version-04-24-6894.mp3',
            './music/vast-expanse-philip-anderson-main-version-13626-03-09.mp3'
        ];
        
        // Dice roll sound effects only
        const diceFiles = [
            './sound effects/dice roll/missle-launcher-shot-epic-stock-media-3-3-00-02.mp3',
            './sound effects/dice roll/rocket-engine-rumble-danijel-zambo-1-00-04.mp3',
            './sound effects/dice roll/rocket-launcher-blast-epic-stock-media-1-1-00-01.mp3',
            './sound effects/dice roll/rocket-whoosh-epic-stock-media-1-00-02.mp3',
            './sound effects/dice roll/sci-fi-missle-launcher-blast-epic-stock-media-1-00-04.mp3'
        ];
        
        // Bad movement sound effects
        const badFiles = [
            './sound effects/bad/siren-emergency-alert-joshua-chivers-1-00-18.mp3'
        ];
        
        // Good movement sound effects
        const goodFiles = [
            './sound effects/good/level-complete-mobile-app-game-soundroll-variation-1-1-00-04.mp3',
            './sound effects/good/level-up-retro-video-game-soundroll-1-00-02.mp3',
            './sound effects/good/ta-da-brass-soundroll-1-00-02.mp3'
        ];
        
        // Robot sound effects
        const robotFiles = [
            './sound effects/robot/data-process-beeps-scanning-glitchedtones-1-00-02.mp3',
            './sound effects/robot/notification-security-scan-identity-accepted-joshua-chivers-1-00-01.mp3',
            './sound effects/robot/robot-processing-confirmation-10-smartsound-fx-1-00-00.mp3',
            './sound effects/robot/robot-processing-confirmation-3-smartsound-fx-1-00-00.mp3',
            './sound effects/robot/robot-processing-menu-opening-4-smartsound-fx-1-00-00.mp3'
        ];
        
        // Explosion sound effects
        const explosionFiles = [
            './sound effects/explosion/bomb-explosion-large-short-gamemaster-audio-1-00-02.mp3',
            './sound effects/explosion/cinematic-trailer-crash-impact-jeff-kaale-1-00-04.mp3',
            './sound effects/explosion/explosion-far-away-gamemaster-audio-1-00-03.mp3',
            './sound effects/explosion/explosion-massive-debris-collapse-hyped-gregor-quendel-1-00-13.mp3',
            './sound effects/explosion/explosion-nearby-with-reverb-gamemaster-audio-2-00-02.mp3',
            './sound effects/explosion/impact-boom-with-sizzling-debris-gregor-quendel-1-00-07.mp3'
        ];
        
        // Winner sound effects
        const winnerFiles = [
            './sound effects/Winner/heavenly-choir-chimes-betacut-1-00-09.mp3',
            './sound effects/Winner/winner-sting-hollywood-fanfare-soundroll-variation-1-1-00-06.mp3'
        ];
        
        // Random/board switcher sound effects (using dice sounds as backup)
        const randomFiles = [
            './sound effects/dice roll/sub-bass-hit-glitchedtones-1-00-02.mp3'
        ];
        
        // Load audio files
        this.loadAudioFiles(musicFiles, diceFiles, badFiles, goodFiles, robotFiles, explosionFiles, winnerFiles, randomFiles);
    }

    async loadAudioFiles(musicFiles, diceFiles, badFiles, goodFiles, robotFiles, explosionFiles, winnerFiles, randomFiles) {
        // Load music tracks
        for (const trackPath of musicFiles) {
            try {
                const audio = new Audio(trackPath);
                audio.loop = false;
                audio.volume = 0.3;
                audio.preload = 'auto';
                
                // Simple availability check
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('timeout')), 2000);
                    audio.addEventListener('canplaythrough', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                    audio.addEventListener('error', () => {
                        clearTimeout(timeout);
                        reject(new Error('load error'));
                    }, { once: true });
                    audio.load();
                });
                
                this.musicTracks.push(audio);
                console.log(`✓ Loaded music: ${trackPath}`);
            } catch (error) {
                // Silently continue - file doesn't exist
            }
        }
        
        // Load dice sound effects
        await this.loadSoundCategory(diceFiles, this.diceSounds, 'dice', 0.7);
        
        // Load bad sound effects
        await this.loadSoundCategory(badFiles, this.badSounds, 'bad', 0.6);
        
        // Load good sound effects
        await this.loadSoundCategory(goodFiles, this.goodSounds, 'good', 0.6);
        
        // Load robot sound effects
        await this.loadSoundCategory(robotFiles, this.robotSounds, 'robot', 0.7);
        
        // Load explosion sound effects
        await this.loadSoundCategory(explosionFiles, this.explosionSounds, 'explosion', 0.4);
        
        // Load winner sound effects
        await this.loadSoundCategory(winnerFiles, this.winnerSounds, 'winner', 0.5);
        
        // Load random/board switcher sound effects
        await this.loadSoundCategory(randomFiles, this.randomSounds, 'random', 0.8);
        
        console.log(`🎵 Loaded ${this.musicTracks.length} music tracks, ${this.diceSounds.length} dice sounds, ${this.goodSounds.length} good sounds, ${this.badSounds.length} bad sounds, ${this.robotSounds.length} robot sounds, ${this.explosionSounds.length} explosion sounds, ${this.winnerSounds.length} winner sounds, ${this.randomSounds.length} random sounds`);
        
        // If no audio files found, try to create some backup sounds
        if (this.diceSounds.length === 0) {
            this.createBackupSounds();
        }
    }

    async loadSoundCategory(soundFiles, targetArray, categoryName, volume) {
        for (const soundPath of soundFiles) {
            try {
                const audio = new Audio(soundPath);
                audio.volume = volume;
                audio.preload = 'auto';
                
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('timeout')), 2000);
                    audio.addEventListener('canplaythrough', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                    audio.addEventListener('error', () => {
                        clearTimeout(timeout);
                        reject(new Error('load error'));
                    }, { once: true });
                    audio.load();
                });
                
                targetArray.push(audio);
                console.log(`✓ Loaded ${categoryName} sound: ${soundPath}`);
            } catch (error) {
                // Silently continue - file doesn't exist
            }
        }
    }

    createBackupSounds() {
        console.log('🔊 Creating backup dice sounds using Web Audio API');
        
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('✓ Web Audio Context created in backup');
            } catch (error) {
                console.warn('Could not create audio context in backup:', error);
                return;
            }
        }
        
        // Create backup background music using oscillators
        this.createBackgroundSynth();
    }

    createBackgroundSynth() {
        if (!this.audioContext) return;
        
        // Create a simple background music loop
        this.synthMusic = {
            isPlaying: false,
            nodes: [],
            play: () => this.playBackgroundSynth(),
            stop: () => this.stopBackgroundSynth()
        };
        
        console.log('✓ Backup synth music created');
    }

    playBackgroundSynth() {
        if (!this.audioContext || this.synthMusic.isPlaying) return;
        
        try {
            this.synthMusic.isPlaying = true;
            
            // Create a simple melody with oscillators
            const frequencies = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale
            
            const playNote = (freq, startTime, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, startTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
                
                this.synthMusic.nodes.push(oscillator);
            };
            
            // Play a simple melody
            const now = this.audioContext.currentTime;
            let time = now;
            
            for (let i = 0; i < 8; i++) {
                const freq = frequencies[i % frequencies.length];
                playNote(freq, time, 0.5);
                time += 0.6;
            }
            
            // Schedule next loop
            setTimeout(() => {
                if (this.synthMusic.isPlaying) {
                    this.playBackgroundSynth();
                }
            }, 5000);
            
            console.log('🎵 Playing backup synth music');
        } catch (error) {
            console.warn('Error playing synth music:', error);
        }
    }

    stopBackgroundSynth() {
        if (this.synthMusic) {
            this.synthMusic.isPlaying = false;
            this.synthMusic.nodes.forEach(node => {
                try {
                    node.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.synthMusic.nodes = [];
        }
    }

    playBackupDiceSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Random frequency for variety
            oscillator.frequency.setValueAtTime(200 + Math.random() * 300, this.audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
            
            console.log('🎲 Played backup dice sound');
        } catch (error) {
            console.warn('Could not play backup sound:', error);
        }
    }

    async playBackgroundMusic() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                console.log('🎵 Audio context resumed');
            }
            
            if (this.musicTracks.length === 0) {
                console.log('⚠️ No music tracks available, using backup synth music');
                if (this.synthMusic) {
                    this.synthMusic.play();
                }
                return;
            }
            
            // Stop any currently playing music
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            
            // Pick a random track
            const randomTrack = this.musicTracks[Math.floor(Math.random() * this.musicTracks.length)];
            this.backgroundMusic = randomTrack;
            
            // Set up next track when current one ends
            this.backgroundMusic.addEventListener('ended', () => {
                setTimeout(() => this.playBackgroundMusic(), 2000);
            }, { once: true });
            
            // Play the track
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('🎵 Playing background music file');
                }).catch(error => {
                    console.warn('Background music blocked by browser, using backup:', error.message);
                    if (this.synthMusic) {
                        this.synthMusic.play();
                    }
                });
            }
        } catch (error) {
            console.warn('Error playing background music, using backup:', error);
            if (this.synthMusic) {
                this.synthMusic.play();
            }
        }
    }

    async playDiceSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.diceSounds.length > 0) {
                // Pick a random dice sound
                const randomSound = this.diceSounds[Math.floor(Math.random() * this.diceSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('🎲 Played dice sound');
                    }).catch(error => {
                        console.warn('Dice sound blocked, using backup');
                        this.playBackupDiceSound();
                    });
                }
            } else {
                // Use backup sound
                this.playBackupDiceSound();
            }
        } catch (error) {
            console.warn('Error playing dice sound:', error);
            this.playBackupDiceSound();
        }
    }

    async playGoodSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.goodSounds.length > 0) {
                // Pick a random good sound
                const randomSound = this.goodSounds[Math.floor(Math.random() * this.goodSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('✨ Played good sound');
                    }).catch(error => {
                        console.warn('Good sound blocked');
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing good sound:', error);
        }
    }

    async playBadSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.badSounds.length > 0) {
                // Pick a random bad sound
                const randomSound = this.badSounds[Math.floor(Math.random() * this.badSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('💥 Played bad sound');
                    }).catch(error => {
                        console.warn('Bad sound blocked');
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing bad sound:', error);
        }
    }

    async playBoardSwitcherSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.randomSounds.length > 0) {
                // Pick a random board switcher sound
                const randomSound = this.randomSounds[Math.floor(Math.random() * this.randomSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('🔀 Played board switcher sound');
                    }).catch(error => {
                        console.warn('Board switcher sound blocked');
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing board switcher sound:', error);
        }
    }



    initializePlayers() {
        this.players[1] = {
            position: 1,
            element: null,
            icon: '👨‍🚀',
            characterId: 'astronaut_male',
            color: this.availableColors[0].value,
            name: 'Player 1',
            isBot: false,
            lives: 3,
            maxLives: 3,
            isAlive: true,
            extraDiceRemaining: 0,
            reverseCard: false
        };
        this.players[2] = {
            position: 1,
            element: null,
            icon: '👩‍🚀',
            characterId: 'astronaut_female',
            color: this.availableColors[1].value,
            name: 'Player 2',
            isBot: false,
            lives: 3,
            maxLives: 3,
            isAlive: true,
            extraDiceRemaining: 0,
            reverseCard: false
        };
    }

    init() {
        this.setupPlayerManagement();
        this.generatePlayerCards();
        this.updateGameMessage('Welcome to Space! Customize your astronauts and begin your cosmic journey!');
    }

    generatePlayerCards() {
        const container = document.getElementById('setupContainer');
        container.innerHTML = '';
        
        for (let i = 1; i <= this.playerCount; i++) {
            const card = this.createPlayerCard(i);
            container.appendChild(card);
        }
    }

    createPlayerCard(playerNum) {
        const card = document.createElement('div');
        card.className = 'player-setup-card';
        
        card.innerHTML = `
            <h3>Player ${playerNum}</h3>
            ${this.playerCount > this.minPlayers ? `<button class="remove-player-btn" data-player="${playerNum}">×</button>` : ''}
            <div class="customization-options">
                <div class="name-selection">
                    <input type="text" class="player-name-input" placeholder="Enter player name" 
                           value="${this.players[playerNum].name}" data-player="${playerNum}">
                </div>
                <div class="bot-selection">
                    <label class="bot-toggle">
                        <input type="checkbox" class="bot-checkbox" data-player="${playerNum}" 
                               ${this.players[playerNum].isBot ? 'checked' : ''}>
                        <span class="bot-slider"></span>
                        <span class="bot-label">🤖 Bot Player</span>
                    </label>
                </div>
                <div class="character-selection">
                    <label>Character Profile:</label>
                    <div class="character-grid">
                        ${this.characterProfiles.map(profile => `
                            <div class="character-option ${this.players[playerNum].icon === profile.icon ? 'selected' : ''}" 
                                 data-player="${playerNum}" data-character="${profile.id}" data-icon="${profile.icon}">
                                <div class="character-icon">${profile.icon}</div>
                                <div class="character-name">${profile.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="color-selection">
                    <label>Astronaut Color:</label>
                    <div class="color-options">
                        ${this.availableColors.map(color => `
                            <button class="color-btn ${this.players[playerNum].color === color.value ? 'active' : ''}" 
                                    data-player="${playerNum}" data-color="${color.name}" 
                                    style="background: ${color.value};"></button>
                        `).join('')}
                    </div>
                </div>
                <div class="player-preview" id="preview${playerNum}">
                    <div class="preview-token" style="background: ${this.players[playerNum].color};">
                        ${this.players[playerNum].icon}
                    </div>
                    ${this.players[playerNum].isBot ? '<div class="bot-indicator">🤖</div>' : ''}
                </div>
            </div>
        `;
        
        // Add event listeners
        this.setupCardEventListeners(card, playerNum);
        
        return card;
    }

    setupCardEventListeners(card, playerNum) {
        // Name input
        const nameInput = card.querySelector('.player-name-input');
        nameInput.addEventListener('input', (e) => {
            this.players[playerNum].name = e.target.value || `Player ${playerNum}`;
        });

        // Bot toggle
        const botCheckbox = card.querySelector('.bot-checkbox');
        botCheckbox.addEventListener('change', (e) => {
            const player = e.target.dataset.player;
            this.players[player].isBot = e.target.checked;
            
            // Update name if it's a bot
            if (e.target.checked && this.players[player].name === `Player ${player}`) {
                this.players[player].name = `Bot ${player}`;
                nameInput.value = `Bot ${player}`;
            }
            
            // Update preview
            this.updatePlayerPreview(player);
        });
        
        // Character selection buttons
        card.querySelectorAll('.character-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const player = e.currentTarget.dataset.player;
                const characterId = e.currentTarget.dataset.character;
                const icon = e.currentTarget.dataset.icon;
                
                // Remove selected class from other character options for this player
                card.querySelectorAll('.character-option').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Update player data
                this.players[player].icon = icon;
                this.players[player].characterId = characterId;
                
                // Update preview
                this.updatePlayerPreview(player);
            });
        });
        
        // Color buttons
        card.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const player = e.target.dataset.player;
                const colorName = e.target.dataset.color;
                
                // Remove active class from other color buttons for this player
                card.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update player data
                this.players[player].color = this.getColorValue(colorName);
                
                // Update preview
                this.updatePlayerPreview(player);
            });
        });
        
        // Remove player button
        const removeBtn = card.querySelector('.remove-player-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                const playerToRemove = parseInt(e.target.dataset.player);
                this.removeSpecificPlayer(playerToRemove);
            });
        }
    }

    updatePlayerPreview(player) {
        const preview = document.getElementById(`preview${player}`);
        const token = preview.querySelector('.preview-token');
        token.textContent = this.players[player].icon;
        token.style.background = this.players[player].color;
        
        // Update bot indicator
        let botIndicator = preview.querySelector('.bot-indicator');
        if (this.players[player].isBot) {
            if (!botIndicator) {
                botIndicator = document.createElement('div');
                botIndicator.className = 'bot-indicator';
                botIndicator.textContent = '🤖';
                preview.appendChild(botIndicator);
            }
        } else {
            if (botIndicator) {
                botIndicator.remove();
            }
        }
    }

    getColorValue(colorName) {
        const colors = {
            blue: '#4285f4',
            red: '#ea4335',
            green: '#34a853',
            purple: '#9c27b0',
            orange: '#ff9800',
            pink: '#e91e63',
            cyan: '#00ffff',
            yellow: '#ffff00'
        };
        return colors[colorName] || '#4285f4';
    }

    setupPlayerManagement() {
        // Setup add/remove player buttons
        document.getElementById('addPlayer').addEventListener('click', () => this.addPlayer());
        document.getElementById('removePlayer').addEventListener('click', () => this.removePlayer());
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('toggleAudio').addEventListener('click', () => this.toggleAudio());
        
        // Setup new game button (initially hidden)
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.startNewGame());
        }
        
        this.updatePlayerControls();
    }

    addPlayer() {
        if (this.playerCount >= this.maxPlayers) return;
        
        this.playerCount++;
        const newPlayerNum = this.playerCount;
        
        // Assign next available color
        const colorIndex = (newPlayerNum - 1) % this.availableColors.length;
        
        this.players[newPlayerNum] = {
            position: 1,
            element: null,
            icon: '👨‍🚀',
            color: this.availableColors[colorIndex].value,
            gender: 'male',
            name: `Player ${newPlayerNum}`,
            isBot: false,
            lives: 3,
            maxLives: 3,
            isAlive: true,
            extraDiceRemaining: 0,
            reverseCard: false
        };
        
        this.generatePlayerCards();
        this.updatePlayerControls();
    }

    removePlayer() {
        if (this.playerCount <= this.minPlayers) return;
        
        // Remove the last player
        delete this.players[this.playerCount];
        this.playerCount--;
        
        this.generatePlayerCards();
        this.updatePlayerControls();
    }

    removeSpecificPlayer(playerToRemove) {
        if (this.playerCount <= this.minPlayers) return;
        
        // Remove the player
        delete this.players[playerToRemove];
        
        // Renumber remaining players
        const remainingPlayers = {};
        let newNum = 1;
        for (let i = 1; i <= this.playerCount; i++) {
            if (i !== playerToRemove && this.players[i]) {
                remainingPlayers[newNum] = { ...this.players[i] };
                remainingPlayers[newNum].name = remainingPlayers[newNum].name.replace(`Player ${i}`, `Player ${newNum}`);
                newNum++;
            }
        }
        
        this.players = remainingPlayers;
        this.playerCount--;
        
        this.generatePlayerCards();
        this.updatePlayerControls();
    }

    updatePlayerControls() {
        document.getElementById('playerCount').textContent = this.playerCount;
        document.getElementById('addPlayer').disabled = this.playerCount >= this.maxPlayers;
        document.getElementById('removePlayer').disabled = this.playerCount <= this.minPlayers;
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const button = document.getElementById('toggleAudio');
        
        if (this.audioEnabled) {
            button.textContent = '🔊 Audio: ON';
            button.classList.remove('audio-off');
            // Restart music if game has started
            if (this.gameStarted) {
                this.playBackgroundMusic();
            }
        } else {
            button.textContent = '🔇 Audio: OFF';
            button.classList.add('audio-off');
            // Stop any playing music
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        }
    }







    async startGame() {
        this.gameStarted = true;
        
        // Initialize audio context with user interaction
        await this.initializeAudioContext();
        
        // Hide setup screen
        document.getElementById('playerSetup').style.display = 'none';
        
        // Hide the title to save space on game board
        const gameTitle = document.querySelector('.game-title');
        if (gameTitle) {
            gameTitle.style.display = 'none';
        }
        
        // Show game elements
        document.getElementById('gameLayout').style.display = 'flex';
        
        // Update control panel with player data
        this.updateControlPanel();
        
        // Initialize game
        this.createBoard();
        this.createBoardConnections();
        this.addSpaceCreatures();
        this.setupGameEventListeners();
        this.placeInitialTokens();
        this.startAnimatedBackground();
        this.updateGameMessage(`${this.players[1].name}'s turn! ${this.players[1].isBot ? 'Bot is thinking...' : 'Roll the dice to begin your space adventure!'}`);
        
        // Start background music
        this.playBackgroundMusic();
        
        // Start square animations
        this.startSquareAnimations();
        
        // Start bot turn if first player is a bot
        if (this.players[1].isBot) {
            this.handleBotTurn();
        }
    }

    startNewGame() {
        // Reset game state
        this.gameStarted = false;
        this.gameWon = false;
        this.currentPlayer = 1;
        this.players = {};
        this.isRolling = false;
        
        // Hide game layout
        document.getElementById('gameLayout').style.display = 'none';
        
        // Show player setup with previous selections preserved
        document.getElementById('playerSetup').style.display = 'block';
        
        // Hide new game button and restore dice
        const newGameBtn = document.getElementById('newGameBtn');
        const diceSection = document.querySelector('.dice-section');
        if (newGameBtn) {
            newGameBtn.style.display = 'none';
        }
        if (diceSection) {
            diceSection.style.display = 'block';
        }
        
        // Reset board state but keep selected players
        this.updateStartButtonState();
        this.updateGameMessage('Select your space explorers for the next adventure!');
        
        // Stop background music
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        
        // Clear any existing board
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.innerHTML = '';
        }
        
        const tokenOverlay = document.getElementById('tokenOverlay');
        if (tokenOverlay) {
            tokenOverlay.innerHTML = '';
        }
    }

    async initializeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('🎵 Audio context resumed on game start');
            } catch (error) {
                console.warn('Could not resume audio context:', error);
            }
        }
    }

    updateControlPanel() {
        // Update active player display
        const activeAvatar = document.getElementById('activePlayerAvatar');
        const avatarToken = activeAvatar.querySelector('.avatar-token');
        const playerName = activeAvatar.querySelector('.player-name');
        
        avatarToken.textContent = this.players[this.currentPlayer].icon;
        avatarToken.style.background = this.players[this.currentPlayer].color;
        playerName.textContent = `${this.players[this.currentPlayer].name}'s Turn`;
        
        // Generate player status cards
        this.generatePlayerStatusCards();
    }

    generatePlayerStatusCards() {
        const playerStatus = document.getElementById('playerStatus');
        
        // Store previous rankings for animation detection
        const previousRankings = this.previousRankings || {};
        const isInitialLoad = Object.keys(previousRankings).length === 0;
        
        // Set leaderboard layout class
        playerStatus.className = 'player-status';
        
        // Create array of players with their IDs for sorting
        const playersForLeaderboard = [];
        for (let i = 1; i <= this.playerCount; i++) {
            playersForLeaderboard.push({
                id: i,
                player: this.players[i]
            });
        }
        
        // Sort by position (highest first), then by player ID as tiebreaker
        playersForLeaderboard.sort((a, b) => {
            if (b.player.position !== a.player.position) {
                return b.player.position - a.player.position;
            }
            return a.id - b.id; // Stable sort for same positions
        });
        
        // Store current rankings for next comparison
        const currentRankings = {};
        playersForLeaderboard.forEach((entry, index) => {
            currentRankings[entry.id] = index + 1;
        });
        
        // For animations, preserve existing cards and reorder them
        if (!isInitialLoad) {
            // Add leaderboard shuffle animation class
            playerStatus.classList.add('leaderboard-shuffling');
            
            // Remove after animation
            setTimeout(() => {
                playerStatus.classList.remove('leaderboard-shuffling');
            }, 1500);
            
            // Animate existing cards to new positions
            playersForLeaderboard.forEach((entry, newIndex) => {
                const cardId = `player${entry.id}Card`;
                const existingCard = document.getElementById(cardId);
                const previousRank = previousRankings[entry.id];
                const currentRank = newIndex + 1;
                
                if (existingCard) {
                    // Update order for CSS flexbox ordering
                    existingCard.style.order = newIndex;
                    
                    // Add position change animations
                    if (previousRank !== undefined && previousRank !== currentRank) {
                        existingCard.classList.add('leaderboard-position-change');
                        
                        if (previousRank > currentRank) {
                            existingCard.classList.add('moving-up');
                        } else {
                            existingCard.classList.add('moving-down');
                        }
                        
                        // Remove animation classes after completion
                        setTimeout(() => {
                            existingCard.classList.remove('leaderboard-position-change', 'moving-up', 'moving-down');
                        }, 2000);
                    }
                    
                    // Update card content
                    this.updatePlayerCardContent(existingCard, entry.player, entry.id);
                }
            });
        } else {
            // Initial load - create all cards normally
            playerStatus.innerHTML = '';
            
            playersForLeaderboard.forEach((entry, index) => {
                const card = this.createLeaderboardCard(entry, index);
                playerStatus.appendChild(card);
            });
        }
        
        // Update stored rankings for next comparison
        this.previousRankings = currentRankings;
    }

    createLeaderboardCard(entry, index) {
        const i = entry.id;
        const player = entry.player;
        
        const card = document.createElement('div');
        card.className = `player-card ${i === this.currentPlayer ? 'active' : ''}`;
        card.id = `player${i}Card`;
        card.style.order = index;
        
        this.updatePlayerCardContent(card, player, i);
        return card;
    }

    updatePlayerCardContent(card, player, playerId) {
        const livesDisplay = player.isAlive ? 
            '❤️'.repeat(player.lives) + '🖤'.repeat(Math.max(0, player.maxLives - player.lives)) : 
            '🖤'.repeat(player.maxLives); // Show broken hearts when dead, not skulls
        
        // Status indicators for active rewards
        const statusIndicators = [];
        if (player.extraDiceRemaining > 0) {
            const remaining = player.extraDiceRemaining;
            statusIndicators.push(`<span class="status-indicator extra-dice">🎲×${remaining}</span>`);
        }
        if (player.reverseCard) {
            statusIndicators.push(`<span class="status-indicator reverse-card">🛡️</span>`);
        }
        
        // Update active class
        if (playerId === this.currentPlayer) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
        
        card.innerHTML = `
            <div class="player-profile-section">
                <div class="player-avatar-container">
                    <div class="avatar-token-clean" style="background: ${player.color};">
                        ${player.isAlive ? player.icon : '💀'}
                    </div>
                    ${player.isBot && player.isAlive ? '<div class="bot-indicator-clean">🤖</div>' : ''}
                </div>
            </div>
            <div class="player-info-section">
                <div class="player-name-leaderboard">${player.name}${player.isBot ? ' (Bot)' : ''}</div>
                <div class="player-stats-row">
                    <div class="player-lives-leaderboard">${livesDisplay}</div>
                </div>
                ${statusIndicators.length > 0 ? '<div class="player-status-indicators-leaderboard">' + statusIndicators.join('') + '</div>' : ''}
            </div>
        `;
    }

    setupGameEventListeners() {
        // Make dice clickable
        this.dice.addEventListener('click', () => {
            if (!this.players[this.currentPlayer].isBot && !this.isRolling && !this.gameWon) {
                this.rollDice();
            }
        });

        // Setup legend toggle
        const legendToggle = document.getElementById('legendToggle');
        const legendPanel = document.getElementById('legendPanel');
        if (legendToggle && legendPanel) {
            legendToggle.addEventListener('click', () => {
                const isVisible = legendPanel.style.display !== 'none';
                legendPanel.style.display = isVisible ? 'none' : 'block';
                legendToggle.textContent = isVisible ? '📖 Square Guide' : '📖 Hide Guide';
            });
        }
        
        // Add keyboard support for space bar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling && !this.gameWon && this.gameStarted) {
                e.preventDefault();
                if (!this.players[this.currentPlayer].isBot) {
                    this.rollDice();
                }
            }
        });
    }

    handleBotTurn() {
        if (!this.players[this.currentPlayer].isBot || this.isRolling || this.gameWon || !this.players[this.currentPlayer].isAlive) {
            console.log(`Bot turn skipped: isBot=${this.players[this.currentPlayer]?.isBot}, isRolling=${this.isRolling}, gameWon=${this.gameWon}, isAlive=${this.players[this.currentPlayer]?.isAlive}`);
            return;
        }
        
        console.log(`Bot turn starting for ${this.players[this.currentPlayer].name}`);
        
        // Disable dice for bot turns
        this.dice.style.cursor = 'not-allowed';
        this.dice.style.opacity = '0.7';
        
        // Keep dice instruction as "Click dice to roll!" for consistency
        const instruction = document.querySelector('.dice-instruction');
        if (instruction) {
            instruction.textContent = 'Click dice to roll!';
        }
        
        // Bot takes time to "think" (1-3 seconds)
        const thinkTime = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
            if (this.players[this.currentPlayer].isBot && !this.gameWon && !this.isRolling) {
                console.log(`Bot ${this.players[this.currentPlayer].name} is rolling dice`);
                this.rollDice();
            } else {
                console.log(`Bot roll cancelled: isBot=${this.players[this.currentPlayer]?.isBot}, gameWon=${this.gameWon}, isRolling=${this.isRolling}`);
            }
        }, thinkTime);
    }

    createBoard() {
        this.gameBoard = document.getElementById('gameBoard');
        this.dice = document.getElementById('dice1'); // Primary dice for clicks
        this.dice2 = document.getElementById('dice2'); // Secondary dice for extra rolls
        this.gameMessage = document.getElementById('gameMessage');
        this.specialEffects = document.getElementById('specialEffects');

        // Generate random special squares for this game
        this.generateRandomSpecialSquares();

        // Create squares in proper snakes and ladders order
        const squares = [];
        
        // Generate squares 1-100 but arrange them in snake pattern
        for (let i = 1; i <= 100; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `square-${i}`;
            
            // Determine square type and icon
            if (i === 1) {
                square.classList.add('start');
                square.innerHTML = '🚀';
            } else if (i === 100) {
                square.classList.add('finish');
                square.innerHTML = '🏆';
            } else if (this.specialSquares[i]) {
                const special = this.specialSquares[i];
                square.classList.add(special.type);
                if (special.type === 'good') {
                    square.innerHTML = '🟢';
                } else if (special.type === 'bad') {
                    square.innerHTML = '🔴';
                } else if (special.type === 'switcher') {
                    square.innerHTML = '🔀';
                } else if (special.type === 'death') {
                    square.innerHTML = '💀';
                } else if (special.type === 'laser') {
                    square.innerHTML = '🔫';
                } else if (special.type === 'bomb') {
                    square.innerHTML = '💣';
                } else if (special.type === 'mystery') {
                    square.innerHTML = '❓';
                } else if (special.type === 'teleport') {
                    square.innerHTML = '🛸';
                } else if (special.type === 'comet') {
                    square.innerHTML = '☄️';
                } else if (special.type === 'life_collectible') {
                    square.innerHTML = '❤️';
                } else if (special.type === 'shield_collectible') {
                    square.innerHTML = '🛡️';
                } else if (special.type === 'dice_collectible') {
                    square.innerHTML = '🎲';
                }
            } else {
                square.classList.add('normal');
                const spaceIcons = [
                    // Stars and celestial bodies
                    '⭐', '🌟', '✨', '💫', '🌠', '🌌', '⚡', 
                    // Planets and moons
                    '🌍', '🌎', '🌏', '🌙', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🪐',
                    // Space objects and technology
                    '🛰️', '🚀', '🛸', '🌌', '☄️', '🌞', '🔭',
                    // Aliens and space creatures
                    '👽', '👾', '🛸', '🤖', '🧠', 
                    // Space elements
                    '🌌', '⭐', '🔮', '⚛️', '🌀'
                ];
                const robotIcons = ['🤖', '🤖'];  // Reduced frequency since robots are now in spaceIcons
                const allIcons = [...spaceIcons, ...robotIcons];
                const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
                square.innerHTML = randomIcon;
            }
            
            squares[i] = square;
        }
        
        // Now arrange them in the correct snakes and ladders pattern (bottom to top)
        // Top row shown (91-100): left to right
        // Second row shown (81-90): right to left  
        // Third row shown (71-80): left to right
        // ...
        // Bottom row shown (1-10): left to right
        
        for (let row = 9; row >= 0; row--) { // Start from row 9 (top) and go to 0 (bottom)
            const isEvenRow = row % 2 === 0;
            
            if (isEvenRow) {
                // Left to right (1-10, 21-30, 41-50, 61-70, 81-90)
                for (let col = 0; col < 10; col++) {
                    const squareNum = (row * 10) + col + 1;
                    if (squares[squareNum]) {
                        this.gameBoard.appendChild(squares[squareNum]);
                    }
                }
            } else {
                // Right to left (11-20, 31-40, 51-60, 71-80, 91-100)
                for (let col = 9; col >= 0; col--) {
                    const squareNum = (row * 10) + col + 1;
                    if (squares[squareNum]) {
                        this.gameBoard.appendChild(squares[squareNum]);
                    }
                }
            }
        }
    }

    generateRandomSpecialSquares() {
        this.specialSquares = {};
        
        // Generate 4-8 board switcher squares first (increased from 2-5)
        const numBoardSwitchers = 4 + Math.floor(Math.random() * 5);
        const usedSquares = new Set([1, 100]); // Don't use start/finish
        
        for (let i = 0; i < numBoardSwitchers; i++) {
            let squareNum;
            do {
                squareNum = 10 + Math.floor(Math.random() * 80); // 10-89 (avoid edges)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'switcher',
                effect: 'randomize'
            };
        }
        
        // Generate 2-6 life squares (collectible)
        const numLifeSquares = 2 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numLifeSquares; i++) {
            let squareNum;
            do {
                squareNum = 5 + Math.floor(Math.random() * 90); // 5-94 (avoid edges)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'life_collectible',
                effect: 'collect_life'
            };
        }
        
        // Generate 2-6 shield/reverse squares (collectible)
        const numShieldSquares = 2 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numShieldSquares; i++) {
            let squareNum;
            do {
                squareNum = 5 + Math.floor(Math.random() * 90); // 5-94 (avoid edges)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'shield_collectible',
                effect: 'collect_shield'
            };
        }
        
        // Generate 1-4 dice squares (collectible)
        const numDiceSquares = 1 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numDiceSquares; i++) {
            let squareNum;
            do {
                squareNum = 10 + Math.floor(Math.random() * 80); // 10-89 (avoid edges)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'dice_collectible',
                effect: 'collect_dice'
            };
        }
        
        // Generate 2-6 comet squares first
        const numCometSquares = 2 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numCometSquares; i++) {
            let squareNum;
            do {
                squareNum = 15 + Math.floor(Math.random() * 70); // 15-84 (avoid early game)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'comet',
                effect: 'comet'
            };
        }
        
        // Generate 6-9 other dangerous squares (death, laser, bomb)
        const numDangerousSquares = 6 + Math.floor(Math.random() * 4);
        const dangerousTypes = ['death', 'laser', 'bomb'];
        
        for (let i = 0; i < numDangerousSquares; i++) {
            let squareNum;
            do {
                squareNum = 15 + Math.floor(Math.random() * 70); // 15-84 (avoid early game)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            const dangerType = dangerousTypes[Math.floor(Math.random() * dangerousTypes.length)];
            this.specialSquares[squareNum] = {
                type: dangerType,
                effect: dangerType
            };
        }
        
        // Generate 2-4 teleport squares
        const numTeleportSquares = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numTeleportSquares; i++) {
            let squareNum;
            do {
                squareNum = 10 + Math.floor(Math.random() * 80); // 10-89 (avoid edges)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'teleport',
                effect: 'teleport'
            };
        }
        
        // Generate 4-8 mystery boxes
        const numMysteryBoxes = 4 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numMysteryBoxes; i++) {
            let squareNum;
            do {
                squareNum = 5 + Math.floor(Math.random() * 90); // 5-94 (avoid edges and end game)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            this.specialSquares[squareNum] = {
                type: 'mystery',
                effect: 'mystery_box'
            };
        }
        
        // Generate 8-10 regular good/bad special squares
        const numSpecialSquares = 8 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numSpecialSquares; i++) {
            let squareNum;
            do {
                squareNum = 2 + Math.floor(Math.random() * 98); // 2-99 (never square 1 or 100)
            } while (usedSquares.has(squareNum));
            
            usedSquares.add(squareNum);
            
            // 50/50 chance of good or bad
            const isGood = Math.random() < 0.5;
            this.specialSquares[squareNum] = {
                type: isGood ? 'good' : 'bad',
                effect: isGood ? 'boost' : 'setback'
            };
        }
        
        console.log(`Generated ${numBoardSwitchers} board switchers, ${numLifeSquares} life squares, ${numShieldSquares} shield squares, ${numDiceSquares} dice squares, ${numCometSquares} comet squares, ${numDangerousSquares} other dangerous squares, ${numTeleportSquares} teleport squares, ${numMysteryBoxes} mystery boxes, and ${numSpecialSquares} regular special squares`);
    }

    createBoardConnections() {
        const connectionsContainer = document.getElementById('boardConnections');
        connectionsContainer.innerHTML = ''; // Clear existing connections
        
        // Create visual connections between special squares
        for (const [fromSquare, specialData] of Object.entries(this.specialSquares)) {
            const from = parseInt(fromSquare);
            const to = specialData.destination;
            
            if (from !== to) {
                this.createConnection(from, to, specialData.type, specialData.effect);
            }
        }
    }

    createConnection(from, to, type, effect) {
        const fromElement = document.getElementById(`square-${from}`);
        const toElement = document.getElementById(`square-${to}`);
        const connectionsContainer = document.getElementById('boardConnections');
        
        if (!fromElement || !toElement) return;
        
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const containerRect = connectionsContainer.getBoundingClientRect();
        
        // Calculate relative positions
        const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
        const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
        const toX = toRect.left - containerRect.left + toRect.width / 2;
        const toY = toRect.top - containerRect.top + toRect.height / 2;
        
        // Calculate distance and angle
        const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        // Create connection line
        const connection = document.createElement('div');
        connection.style.position = 'absolute';
        connection.style.left = `${fromX}px`;
        connection.style.top = `${fromY}px`;
        connection.style.width = `${distance}px`;
        connection.style.transformOrigin = '0 50%';
        connection.style.transform = `rotate(${angle}deg)`;
        
        if (type === 'good') {
            connection.className = 'beam-connection';
            
            // Add spaceship effect
            const spaceship = document.createElement('div');
            spaceship.className = 'spaceship-effect';
            spaceship.textContent = '🛸';
            spaceship.style.left = `${toX - 20}px`;
            spaceship.style.top = `${toY - 20}px`;
            connectionsContainer.appendChild(spaceship);
            
        } else {
            connection.className = 'asteroid-trail';
            
            // Add asteroid effect
            const asteroid = document.createElement('div');
            asteroid.className = 'spaceship-effect';
            asteroid.textContent = '☄️';
            asteroid.style.left = `${toX - 20}px`;
            asteroid.style.top = `${toY - 20}px`;
            asteroid.style.animation = 'asteroidMove 3s ease-in-out infinite';
            connectionsContainer.appendChild(asteroid);
        }
        
        connectionsContainer.appendChild(connection);
    }

    addSpaceCreatures() {
        const gameBoard = this.gameBoard;
        const boardRect = gameBoard.getBoundingClientRect();
        
        // Add floating space creatures between squares
        const spaceCreatures = ['👽', '🛸', '🌟', '💫', '🌠', '⚡', '👾', '🛰️'];
        
        for (let i = 0; i < 15; i++) {
            const creature = document.createElement('div');
            creature.className = 'space-creature';
            creature.textContent = spaceCreatures[Math.floor(Math.random() * spaceCreatures.length)];
            
            // Random position within the board area
            creature.style.left = `${Math.random() * 90}%`;
            creature.style.top = `${Math.random() * 90}%`;
            creature.style.animationDelay = `${Math.random() * 3}s`;  // Stagger animations
            
            gameBoard.appendChild(creature);
        }
    }


    placeInitialTokens() {
        const tokenOverlay = document.getElementById('tokenOverlay');
        
        // Create player tokens for all players and add to overlay
        for (let i = 1; i <= this.playerCount; i++) {
            this.players[i].element = this.createPlayerToken(i);
            tokenOverlay.appendChild(this.players[i].element);
        }
        
        // Position all tokens on square 1
        this.positionAllTokensOnSquare(1);
    }

    createPlayerToken(playerNum) {
        const player = this.players[playerNum];
        const token = document.createElement('div');
        token.className = 'player-token';
        token.id = `token-${playerNum}`;
        token.style.zIndex = '2000'; // Force high z-index
        
        this.updatePlayerTokenContent(token, player);
        return token;
    }

    updatePlayerTokenContent(token, player) {
        const displayIcon = player.isAlive ? player.icon : '💀';
        // Keep the player's original color even when dead
        
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

    async animatePlayerSelection(availablePlayers, message) {
        this.updateGameMessage(message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle edge case: only one target available
        if (availablePlayers.length === 1) {
            const selectedPlayer = availablePlayers[0];
            const selectedCard = document.getElementById(`player${selectedPlayer}Card`);
            
            if (selectedCard) {
                // Simple pulse for single target
                selectedCard.classList.add('selection-pulse');
                setTimeout(() => selectedCard.classList.remove('selection-pulse'), 400);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                selectedCard.classList.add('final-target');
                setTimeout(() => selectedCard.classList.remove('final-target'), 2000);
            }
            
            this.updateGameMessage(`🎯 ${this.players[selectedPlayer].name} has been selected!`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return selectedPlayer;
        }
        
        // Create shuffled list for selection animation
        const shuffledPlayers = [...availablePlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }
        
        // Pulse through players multiple times for dramatic effect
        const pulseRounds = 3;
        let currentPulseSpeed = 300; // ms between pulses
        
        for (let round = 0; round < pulseRounds; round++) {
            for (let i = 0; i < shuffledPlayers.length; i++) {
                const playerNum = shuffledPlayers[i];
                const card = document.getElementById(`player${playerNum}Card`);
                
                if (card) {
                    // Add pulse animation
                    card.classList.add('selection-pulse');
                    
                    // Remove pulse after animation completes
                    setTimeout(() => {
                        card.classList.remove('selection-pulse');
                    }, 400);
                }
                
                // Wait before pulsing next player
                await new Promise(resolve => setTimeout(resolve, currentPulseSpeed));
            }
            
            // Slightly increase speed each round for building tension
            currentPulseSpeed *= 0.8;
        }
        
        // Final dramatic selection
        const selectedPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        const selectedCard = document.getElementById(`player${selectedPlayer}Card`);
        
        if (selectedCard) {
            selectedCard.classList.add('final-target');
            
            // Remove final target animation after a delay
            setTimeout(() => {
                selectedCard.classList.remove('final-target');
            }, 2000);
        }
        
        this.updateGameMessage(`🎯 ${this.players[selectedPlayer].name} has been selected!`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return selectedPlayer;
    }

    positionAllTokensOnSquare(squareNumber) {
        const square = document.getElementById(`square-${squareNumber}`);
        const tokenOverlay = document.getElementById('tokenOverlay');
        
        if (!square || !tokenOverlay) return;
        
        // Get positions relative to the token overlay (which matches the board section)
        const overlayRect = tokenOverlay.getBoundingClientRect();
        const squareRect = square.getBoundingClientRect();
        
        // Calculate relative position within the overlay
        const baseX = squareRect.left - overlayRect.left + squareRect.width / 2;
        const baseY = squareRect.top - overlayRect.top + squareRect.height / 2;
        
        // Get all players on this square (both alive and dead)
        const playersOnSquare = [];
        for (let i = 1; i <= this.playerCount; i++) {
            if (this.players[i].position === squareNumber) {
                playersOnSquare.push(i);
            }
        }
        
        // Show all player tokens (alive and dead skulls)
        for (let i = 1; i <= this.playerCount; i++) {
            const token = this.players[i].element;
            // Always show tokens - dead players will display as skulls
            token.style.display = 'block';
        }
        
        // Position all tokens on this square
        playersOnSquare.forEach((playerNum, index) => {
            const token = this.players[playerNum].element;
            const offset = this.calculateTokenOffset(index, playersOnSquare.length);
            
            token.style.left = `${baseX + offset.x - 30}px`; // Center token (30px = half width)
            token.style.top = `${baseY + offset.y - 37.5}px`; // Center token (37.5px = half height)
        });
    }

    calculateTokenOffset(index, totalTokens) {
        switch (totalTokens) {
            case 1:
                return { x: 0, y: 0 };
            case 2:
                return { x: index === 0 ? -15 : 15, y: 0 };
            case 3:
                if (index === 0) return { x: 0, y: -10 };
                return { x: index === 1 ? -15 : 15, y: 10 };
            case 4:
                return { 
                    x: index % 2 === 0 ? -15 : 15, 
                    y: index < 2 ? -10 : 10 
                };
            case 5:
                if (index === 0) return { x: 0, y: -15 };
                const positions = [
                    { x: -20, y: 0 }, { x: 20, y: 0 },
                    { x: -20, y: 15 }, { x: 20, y: 15 }
                ];
                return positions[index - 1];
            case 6:
                const row = Math.floor(index / 2);
                const col = index % 2;
                return { 
                    x: col === 0 ? -20 : 20, 
                    y: -15 + row * 15 
                };
            default:
                return { x: 0, y: 0 };
        }
    }

    positionTokensOnSquare(square) {
        const tokens = square.querySelectorAll('.player-token');
        const tokenCount = tokens.length;
        
        tokens.forEach((token, index) => {
            switch (tokenCount) {
                case 1:
                    token.style.left = '5px';
                    token.style.top = '-5px';
                    break;
                case 2:
                    token.style.left = index === 0 ? '-10px' : '20px';
                    token.style.top = '-5px';
                    break;
                case 3:
                    if (index === 0) {
                        token.style.left = '5px';
                        token.style.top = '-15px';
                    } else {
                        token.style.left = index === 1 ? '-10px' : '20px';
                        token.style.top = '5px';
                    }
                    break;
                case 4:
                    token.style.left = index % 2 === 0 ? '-10px' : '20px';
                    token.style.top = index < 2 ? '-15px' : '5px';
                    break;
                case 5:
                    if (index === 0) {
                        token.style.left = '5px';
                        token.style.top = '-20px';
                    } else {
                        const positions = [
                            { left: '-15px', top: '-5px' },
                            { left: '25px', top: '-5px' },
                            { left: '-15px', top: '10px' },
                            { left: '25px', top: '10px' }
                        ];
                        token.style.left = positions[index - 1].left;
                        token.style.top = positions[index - 1].top;
                    }
                    break;
                case 6:
                    const row = Math.floor(index / 2);
                    const col = index % 2;
                    token.style.left = col === 0 ? '-15px' : '25px';
                    token.style.top = `${-20 + row * 15}px`;
                    break;
            }
        });
    }

    async rollDice() {
        if (this.isRolling || this.gameWon) return;

        // CRITICAL: Don't allow dead players to roll dice
        if (!this.players[this.currentPlayer].isAlive) {
            console.log(`Dead player ${this.players[this.currentPlayer].name} tried to roll - switching to next player`);
            this.switchPlayer();
            return;
        }

        this.isRolling = true;
        const dice1 = document.getElementById('dice1');
        const dice2 = document.getElementById('dice2');
        const diceCube1 = document.getElementById('diceCube1');
        const diceCube2 = document.getElementById('diceCube2');
        const currentPlayer = this.players[this.currentPlayer];
        
        // Check if player has extra dice remaining
        const hasExtraDice = currentPlayer.extraDiceRemaining > 0;
        
        dice1.style.cursor = 'not-allowed';
        this.playDiceSound();
        
        let finalValue, roll1, roll2;
        
        if (hasExtraDice) {
            // Show both dice and position them properly
            dice2.style.display = 'block';
            const bonusValue = document.getElementById('bonusValue');
            
            // Roll values
            roll1 = Math.floor(Math.random() * 6) + 1;
            roll2 = Math.floor(Math.random() * 6) + 1;
            finalValue = roll1 + roll2; // ADD both dice together for extra movement!
            
            this.updateGameMessage(`🎲💰 ${currentPlayer.name} rolls twice: ${roll1} + ${roll2} = ${finalValue} spaces!`);
            
            // Animate first dice
            dice1.classList.add('rolling');
            setTimeout(() => {
                dice1.classList.remove('rolling');
                diceCube1.className = 'dice-cube show-' + roll1;
                
                // Then animate bonus coin after delay
                setTimeout(() => {
                    dice2.classList.add('rolling');
                    setTimeout(() => {
                        dice2.classList.remove('rolling');
                        dice2.classList.add('result');
                        bonusValue.textContent = roll2;
                        
                        // Decrease extra dice and move player after both dice shown
                        currentPlayer.extraDiceRemaining--;
                        this.updatePlayerStatusCards();
                        
                        // Small delay before moving
                        setTimeout(() => {
                            this.movePlayer(finalValue);
                        }, 300);
                    }, 1000);
                }, 200);
            }, 1000);
            
        } else {
            // Single dice roll - hide second dice and center first one
            dice2.style.display = 'none';
            dice2.classList.remove('rolling', 'result');
            const bonusValue = document.getElementById('bonusValue');
            if (bonusValue) bonusValue.textContent = '?';
            
            roll1 = Math.floor(Math.random() * 6) + 1;
            finalValue = roll1;
            
            dice1.classList.add('rolling');
            setTimeout(() => {
                dice1.classList.remove('rolling');
                diceCube1.className = 'dice-cube show-' + roll1;
                
                // Small delay before moving
                setTimeout(() => {
                    this.movePlayer(finalValue);
                }, 300);
            }, 1200);
        }
        
        this.lastRoll = finalValue;
        this.mainDiceRoll = roll1; // Track main dice separately for 6-rule
    }

    async movePlayer(diceValue) {
        const player = this.players[this.currentPlayer];
        const newPosition = Math.min(player.position + diceValue, 100);
        
        this.updateGameMessage(`${player.name} rolled ${diceValue}! Moving to square ${newPosition}...`);

        // Animate movement
        await this.animateMovement(player, newPosition);
        
        // Check if landed on another player (and knock them back)
        // Note: handlePlayerCollisions now has built-in safety for square 1
        await this.handlePlayerCollisions(newPosition);
        
        // Check for special square
        if (this.specialSquares[newPosition]) {
            const special = this.specialSquares[newPosition];
            console.log(`Landing on special square ${newPosition}, type: ${special.type}`);
            // Use classic handler for squares with fixed destinations, new handler for random movement
            if (special.destination !== undefined) {
                await this.handleSpecialSquare(newPosition);
            } else {
                await this.handleNewSpecialSquare(newPosition);
            }
        } else if (newPosition === 100) {
            this.handleWin();
        } else {
            // Check if main dice rolled a 6 (gets another turn)
            if (this.mainDiceRoll === 6) {
                this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
                this.enableNextTurn();
            } else {
                this.updateGameMessage(`${player.name} landed on square ${newPosition}`);
                this.switchPlayer();
            }
        }
        
        // IMPORTANT: Only reset isRolling after ALL movement and processing is complete
        // This prevents multiple players from moving simultaneously
    }

    async animateMovement(player, targetPosition) {
        const startPosition = player.position;
        const steps = Math.abs(targetPosition - startPosition);
        
        // If moving more than 1 square, animate step by step
        if (steps > 1) {
            const direction = targetPosition > startPosition ? 1 : -1;
            
            for (let step = 1; step <= steps; step++) {
                const currentPos = startPosition + (step * direction);
                await this.animateToSingleSquare(player, currentPos, step === steps);
                
                // Small delay between steps for smooth movement
                if (step < steps) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        } else {
            // Single square movement
            await this.animateToSingleSquare(player, targetPosition, true);
        }
    }

    async animateToSingleSquare(player, targetPosition, isFinalPosition) {
        const tokenOverlay = document.getElementById('tokenOverlay');
        const targetSquare = document.getElementById(`square-${targetPosition}`);
        
        if (!targetSquare || !tokenOverlay) return;
        
        // Get positions for smooth animation
        const overlayRect = tokenOverlay.getBoundingClientRect();
        const targetRect = targetSquare.getBoundingClientRect();
        
        // Calculate positions relative to overlay
        const targetX = targetRect.left - overlayRect.left + targetRect.width / 2 - 30; // Center token
        const targetY = targetRect.top - overlayRect.top + targetRect.height / 2 - 37.5; // Center token
        
        // Add special movement effect
        const tokenCircle = player.element.querySelector('.token-circle');
        if (tokenCircle) {
            tokenCircle.style.transform = 'scale(1.2)';
            tokenCircle.style.boxShadow = `0 0 25px ${player.color}, 0 0 40px ${player.color}`;
            tokenCircle.style.animation = 'none'; // Stop bobbing during movement
        }
        
        // Update position data
        player.position = targetPosition;
        
        // Animate to target position with bounce
        player.element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        player.element.style.left = `${targetX}px`;
        player.element.style.top = `${targetY}px`;
        player.element.style.transform = 'scale(1.1)';
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Reset styles
        if (tokenCircle) {
            tokenCircle.style.transform = '';
            tokenCircle.style.boxShadow = '';
            tokenCircle.style.animation = 'tokenBob 2s ease-in-out infinite alternate';
        }
        player.element.style.transition = '';
        player.element.style.transform = '';
        
        // Position all tokens properly on the final square
        if (isFinalPosition) {
            this.positionAllTokensOnSquare(targetPosition);
        }
    }

    async handlePlayerCollisions(position) {
        // CRITICAL FIX: Never allow collision logic on square 1 (starting square)
        // This prevents game-breaking bugs when players are moved back to start
        if (position === 1) {
            console.log('Collision logic skipped for starting square (square 1)');
            return;
        }
        
        const currentPlayerNum = this.currentPlayer;
        const alivePlayersOnSquare = [];
        const deadPlayersOnSquare = [];
        
        // Find all players on this square (excluding current player)
        for (let i = 1; i <= this.playerCount; i++) {
            if (i !== currentPlayerNum && this.players[i].position === position) {
                if (this.players[i].isAlive) {
                    alivePlayersOnSquare.push(i);
                } else {
                    deadPlayersOnSquare.push(i);
                }
            }
        }
        
        // Check for revival opportunities (dead players on square)
        if (deadPlayersOnSquare.length > 0) {
            // Only allow revival if there are 2+ living players (don't revive in final 1v1)
            const totalAlivePlayers = Object.values(this.players).filter(p => p.isAlive).length;
            if (totalAlivePlayers > 1) {
                // Handle revival for each dead player on this square
                for (const deadPlayerNum of deadPlayersOnSquare) {
                    await this.handlePlayerRevival(deadPlayerNum, currentPlayerNum);
                    break; // Only revive one player per landing
                }
            }
        }
        
        // Handle normal knockback for alive players
        if (alivePlayersOnSquare.length > 0) {
            for (const playerNum of alivePlayersOnSquare) {
                await this.knockPlayerBack(playerNum, position);
            }
        }
    }

    async knockPlayerBack(playerNum, fromPosition) {
        const player = this.players[playerNum];
        
        // SAFETY CHECK: Don't knock back dead players
        if (!player.isAlive) {
            return;
        }
        
        // CRITICAL: Store original turn state to preserve it during processing
        const originalCurrentPlayer = this.currentPlayer;
        // NOTE: We do NOT preserve isRolling - it should be managed by turn completion logic
        
        // Generate random movement between 1-12 spaces
        const randomMovement = 1 + Math.floor(Math.random() * 12);
        
        // 50/50 chance of going forward or backward
        const goForward = Math.random() < 0.5;
        let newPosition = goForward ? 
            Math.min(player.position + randomMovement, 100) : 
            Math.max(player.position - randomMovement, 1);
        
        // Note: Players can be knocked back to square 1 - collision logic is disabled there
        
        // Show exciting message about the random knockback
        const direction = goForward ? 'forward' : 'backward';
        const directionEmoji = goForward ? '⬆️' : '⬇️';
        const color = goForward ? 'green' : 'red';
        
        this.updateGameMessage(`💥 ${this.players[this.currentPlayer].name} landed on ${player.name}! ${directionEmoji} Random knockback: ${randomMovement} spaces ${direction}!`);
        
        // Play appropriate sound for the knockback direction
        if (goForward) {
            this.playGoodSound();
        } else {
            this.playBadSound();
        }
        
        // Create knockback effect
        this.createKnockbackEffect(fromPosition);
        
        // Wait for effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Light up the knockback path
        await this.lightUpPath(player.position, newPosition, goForward);
        
        // Wait for path lighting effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Move the knocked player
        await this.animateMovement(player, newPosition);
        
        // Clear the lit path
        this.clearLitPath();
        
        // Now handle the END position of the knocked player (just like special squares)
        
        // 1. Check if knocked player landed on ANOTHER player
        const chainPlayers = [];
        for (let i = 1; i <= this.playerCount; i++) {
            if (i !== playerNum && this.players[i].position === newPosition) {
                chainPlayers.push(i);
            }
        }
        
        // Handle chain reactions
        if (chainPlayers.length > 0) {
            this.updateGameMessage(`⚡ Chain reaction! ${player.name} landed on more players!`);
            for (const chainPlayerNum of chainPlayers) {
                await this.knockPlayerBack(chainPlayerNum, newPosition);
            }
        }
        
        // 2. Check if knocked player landed on a special square
        if (this.specialSquares[newPosition]) {
            this.updateGameMessage(`🎲 ${player.name} was knocked onto a special square!`);
            // Switch current player to handle their special square
            this.currentPlayer = playerNum;
            
            const knockedSpecial = this.specialSquares[newPosition];
            // Use classic handler for squares with fixed destinations, new handler for random movement
            // Pass true to indicate this is from knockback - don't complete turns
            if (knockedSpecial.destination !== undefined) {
                await this.handleSpecialSquare(newPosition, true);
            } else {
                await this.handleNewSpecialSquare(newPosition, true);
            }
        }
        
        // 3. Check if knocked player won by reaching 100
        if (player.position === 100) {
            this.updateGameMessage(`🏆 Incredible! ${player.name} won by being knocked forward to square 100!`);
            this.gameWon = true;
            this.handleWin();
        }
        
        // CRITICAL: Restore the original turn state after processing
        this.currentPlayer = originalCurrentPlayer;
        // NOTE: We do NOT restore isRolling - let turn completion logic handle it
    }

    async handlePlayerRevival(deadPlayerNum, reviverPlayerNum) {
        const deadPlayer = this.players[deadPlayerNum];
        const reviverPlayer = this.players[reviverPlayerNum];
        
        // Check if reviver has enough lives to sacrifice
        if (reviverPlayer.lives <= 1) {
            this.updateGameMessage(`💔 ${reviverPlayer.name} doesn't have enough lives to revive ${deadPlayer.name}!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }
        
        this.updateGameMessage(`✨ ${reviverPlayer.name} sacrifices a life to revive ${deadPlayer.name}! 💖`);
        this.playGoodSound();
        
        // Show revival animation
        const deadCard = document.getElementById(`player${deadPlayerNum}Card`);
        const reviverCard = document.getElementById(`player${reviverPlayerNum}Card`);
        
        if (deadCard) {
            deadCard.classList.add('revival-glow');
            setTimeout(() => deadCard.classList.remove('revival-glow'), 3000);
        }
        
        if (reviverCard) {
            reviverCard.classList.add('life-sacrifice');
            setTimeout(() => reviverCard.classList.remove('life-sacrifice'), 2000);
        }
        
        // Transfer life and revive - CRITICAL ORDER
        console.log(`Revival: Before - Dead player ${deadPlayer.name} isAlive: ${deadPlayer.isAlive}, lives: ${deadPlayer.lives}`);
        console.log(`Revival: Before - Reviver ${reviverPlayer.name} lives: ${reviverPlayer.lives}`);
        
        reviverPlayer.lives--;
        deadPlayer.lives = 1;
        deadPlayer.isAlive = true;
        
        console.log(`Revival: After - Dead player ${deadPlayer.name} isAlive: ${deadPlayer.isAlive}, lives: ${deadPlayer.lives}`);
        console.log(`Revival: After - Reviver ${reviverPlayer.name} lives: ${reviverPlayer.lives}`);
        
        // IMMEDIATELY update all visual elements
        this.updateAllPlayerTokens();
        this.updatePlayerStatusCards();
        
        // Force position update for all tokens to ensure proper display
        this.positionAllTokensOnSquare(deadPlayer.position);
        
        // Force a brief pause to let UI update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.updateGameMessage(`🎉 ${deadPlayer.name} is back in the game! Applying knockback...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Apply normal knockback to the revived player
        await this.knockPlayerBack(deadPlayerNum, deadPlayer.position);
    }

    createKnockbackEffect(position) {
        const square = document.getElementById(`square-${position}`);
        const rect = square.getBoundingClientRect();
        
        const effect = document.createElement('div');
        effect.className = 'knockback-effect';
        effect.textContent = '💥';
        effect.style.position = 'absolute';
        effect.style.left = `${rect.left + rect.width / 2 - 20}px`;
        effect.style.top = `${rect.top + rect.height / 2 - 20}px`;
        effect.style.fontSize = '2.5em';
        effect.style.zIndex = '1000';
        effect.style.animation = 'knockbackExplosion 1s ease-out forwards';
        effect.style.pointerEvents = 'none';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 1000);
    }

    enableNextTurn() {
        // Reset isRolling now that all movement processing is complete
        this.isRolling = false;
        
        if (this.players[this.currentPlayer].isBot) {
            // Bot will roll again after thinking
            this.dice.style.cursor = 'not-allowed';
            this.dice.style.opacity = '0.7';
            const instruction = document.querySelector('.dice-instruction');
            if (instruction) {
                instruction.textContent = 'Click dice to roll!';
            }
            setTimeout(() => this.handleBotTurn(), 1500);
        } else {
            // Human players - minimal styling, no hover effects
            this.dice.style.cursor = 'not-allowed';  
            this.dice.style.opacity = '0.7';
            const instruction = document.querySelector('.dice-instruction');
            if (instruction) {
                instruction.textContent = 'Click dice to roll!';
            }
        }
    }

    async handleSpecialSquare(position, fromKnockback = false) {
        const special = this.specialSquares[position];
        const player = this.players[this.currentPlayer];
        
        // Show special effect
        this.createSpecialEffect(special.effect, position);
        
        this.updateGameMessage(special.message);
        
        // Wait for effect to show
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Move to destination
        if (special.destination !== position) {
            this.updateGameMessage(`Transported to square ${special.destination}!`);
            await this.animateMovement(player, special.destination);
        }
        
        // Check if landed on finish after transport
        if (player.position === 100) {
            this.handleWin();
        } else {
            // Skip turn completion if this was triggered by knockback
            if (fromKnockback) {
                console.log('Skipping turn completion - classic special square triggered by knockback');
                return;
            }
            
            // Check if the original roll that triggered this special square was a 6
            if (this.mainDiceRoll === 6) {
                this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
                this.enableNextTurn();
            } else {
                this.switchPlayer();
            }
        }
    }

    async handleNewSpecialSquare(position, fromKnockback = false) {
        const special = this.specialSquares[position];
        const player = this.players[this.currentPlayer];
        
        // Handle board switcher squares
        if (special.type === 'switcher') {
            await this.handleBoardSwitcher(position);
            return;
        }
        
        // Handle mystery boxes
        if (special.type === 'mystery') {
            await this.handleMysteryBox(position);
            return;
        }
        
        // Handle dangerous squares
        if (special.type === 'death') {
            await this.handleDeathSquare(position, fromKnockback);
            return;
        }
        
        if (special.type === 'laser') {
            await this.handleLaserSquare(position, fromKnockback);
            return;
        }
        
        if (special.type === 'bomb') {
            await this.handleBombSquare(position, fromKnockback);
            return;
        }
        
        // Handle comet squares
        if (special.type === 'comet') {
            await this.handleCometSquare(position, fromKnockback);
            return;
        }
        
        // Handle teleport squares
        if (special.type === 'teleport') {
            await this.handleTeleportSquare(position, fromKnockback);
            return;
        }
        
        // Handle collectible squares
        if (special.type === 'life_collectible') {
            await this.handleLifeCollectible(position);
            return;
        }
        
        if (special.type === 'shield_collectible') {
            await this.handleShieldCollectible(position);
            return;
        }
        
        if (special.type === 'dice_collectible') {
            await this.handleDiceCollectible(position);
            return;
        }
        
        const isGood = special.type === 'good';
        
        // Generate random movement between 1-12
        const randomMovement = 1 + Math.floor(Math.random() * 12);
        const newPosition = isGood ? 
            Math.min(player.position + randomMovement, 100) : 
            Math.max(player.position - randomMovement, 1);
        
        // Show message about what's happening
        const message = isGood ? 
            `🟢 Green square! Moving forward ${randomMovement} spaces!` : 
            `🔴 Red square! Moving backward ${randomMovement} spaces!`;
        this.updateGameMessage(message);
        
        // Play appropriate sound effect
        if (isGood) {
            this.playGoodSound();
        } else {
            this.playBadSound();
        }
        
        // Light up the path
        await this.lightUpPath(player.position, newPosition, isGood);
        
        // Wait for path lighting effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Move the player
        await this.animateMovement(player, newPosition);
        
        // Clear the lit path
        this.clearLitPath();
        
        // Now handle the END position just like a normal move:
        
        // 1. Check if landed on another player (and knock them back)
        // Note: handlePlayerCollisions now has built-in safety for square 1
        await this.handlePlayerCollisions(newPosition);
        
        // 2. Check if landed on ANOTHER special square
        if (this.specialSquares[newPosition]) {
            const endSpecial = this.specialSquares[newPosition];
            // Use classic handler for squares with fixed destinations, new handler for random movement
            if (endSpecial.destination !== undefined) {
                await this.handleSpecialSquare(newPosition, fromKnockback);
            } else {
                await this.handleNewSpecialSquare(newPosition, fromKnockback);
            }
            return; // Exit here, let the recursive call handle the rest
        }
        
        // 3. Check if landed on finish
        if (player.position === 100) {
            this.handleWin();
            return;
        }
        
        // 4. Check if landed on a robot square and play robot sound
        this.checkForRobotSound(newPosition);
        
        // 5. Skip turn completion if this was triggered by knockback
        if (fromKnockback) {
            console.log('Skipping turn completion - good/bad square triggered by knockback');
            return;
        }
        
        // 6. Normal turn completion logic
        if (this.lastRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.updateGameMessage(`${player.name} landed on square ${newPosition}`);
            this.switchPlayer();
        }
    }

    async lightUpPath(startPosition, endPosition, isGood) {
        const color = isGood ? '#00ff00' : '#ff0000'; // Green or red
        const direction = endPosition > startPosition ? 1 : -1;
        const steps = Math.abs(endPosition - startPosition);
        
        // Light up each square in the path
        for (let step = 1; step <= steps; step++) {
            const squarePosition = startPosition + (step * direction);
            const square = document.getElementById(`square-${squarePosition}`);
            
            if (square) {
                square.style.boxShadow = `0 0 20px ${color}, inset 0 0 15px ${color}`;
                square.style.border = `3px solid ${color}`;
                square.style.transform = 'scale(1.05)';
                square.classList.add('lit-path');
            }
            
            // Small delay between lighting squares for effect
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    clearLitPath() {
        const litSquares = document.querySelectorAll('.lit-path');
        litSquares.forEach(square => {
            square.style.boxShadow = '';
            square.style.border = '';
            square.style.transform = '';
            square.classList.remove('lit-path');
        });
    }

    async lightUpTeleportPath(startPosition, endPosition, direction) {
        // Use white color for teleport, same format as red/green squares
        const teleportColor = '#ffffff';
        
        // Light up the direct path exactly like red/green squares but with white
        if (direction === 'left' || direction === 'right') {
            // Horizontal: light up all squares in the row between start and end
            const row = Math.floor((startPosition - 1) / 10);
            const startCol = (startPosition - 1) % 10;
            const endCol = (endPosition - 1) % 10;
            const minCol = Math.min(startCol, endCol);
            const maxCol = Math.max(startCol, endCol);
            
            for (let col = minCol; col <= maxCol; col++) {
                const squareNum = (row * 10) + col + 1;
                const square = document.getElementById(`square-${squareNum}`);
                if (square) {
                    square.style.boxShadow = `0 0 15px ${teleportColor}, 0 0 25px ${teleportColor}`;
                    square.style.border = `2px solid ${teleportColor}`;
                    square.style.transform = 'scale(1.05)';
                    square.classList.add('teleport-path');
                }
            }
        } else if (direction === 'up' || direction === 'down') {
            // Vertical: light up all squares in the column between start and end
            const col = (startPosition - 1) % 10;
            const startRow = Math.floor((startPosition - 1) / 10);
            const endRow = Math.floor((endPosition - 1) / 10);
            const minRow = Math.min(startRow, endRow);
            const maxRow = Math.max(startRow, endRow);
            
            for (let row = minRow; row <= maxRow; row++) {
                const squareNum = (row * 10) + col + 1;
                const square = document.getElementById(`square-${squareNum}`);
                if (square) {
                    square.style.boxShadow = `0 0 15px ${teleportColor}, 0 0 25px ${teleportColor}`;
                    square.style.border = `2px solid ${teleportColor}`;
                    square.style.transform = 'scale(1.05)';
                    square.classList.add('teleport-path');
                }
            }
        }
        
        // Keep path lit for same duration as red/green squares
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    clearTeleportPath() {
        const teleportSquares = document.querySelectorAll('.teleport-path');
        teleportSquares.forEach(square => {
            square.style.boxShadow = '';
            square.style.border = '';
            square.style.transform = '';
            square.classList.remove('teleport-path');
        });
    }

    async animateTeleportMovement(player, targetPosition) {
        const tokenOverlay = document.getElementById('tokenOverlay');
        const targetSquare = document.getElementById(`square-${targetPosition}`);
        
        if (!targetSquare || !tokenOverlay) return;
        
        const tokenCircle = player.element.querySelector('.token-circle');
        
        // Phase 1: Spin out and disappear at current position
        if (tokenCircle) {
            tokenCircle.style.transition = 'transform 0.5s ease-in, opacity 0.3s ease-in 0.2s';
            tokenCircle.style.transform = 'scale(0.1) rotate(720deg)'; // Spin and shrink
            tokenCircle.style.opacity = '0';
            tokenCircle.style.animation = 'none'; // Stop bobbing during teleport
        }
        
        // Wait for spin out to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Phase 2: Move invisibly to target position
        const overlayRect = tokenOverlay.getBoundingClientRect();
        const targetRect = targetSquare.getBoundingClientRect();
        const targetX = targetRect.left - overlayRect.left + targetRect.width / 2 - 30;
        const targetY = targetRect.top - overlayRect.top + targetRect.height / 2 - 37.5;
        
        // Update position data and move token
        player.position = targetPosition;
        player.element.style.left = `${targetX}px`;
        player.element.style.top = `${targetY}px`;
        
        // Phase 3: Spin in and appear at new position
        if (tokenCircle) {
            tokenCircle.style.transition = 'transform 0.6s ease-out, opacity 0.3s ease-out';
            tokenCircle.style.transform = 'scale(1.1) rotate(0deg)'; // Spin in and grow
            tokenCircle.style.opacity = '1';
            tokenCircle.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)'; // Brief white glow
        }
        
        // Wait for spin in to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Phase 4: Settle into final position
        if (tokenCircle) {
            tokenCircle.style.transition = 'all 0.3s ease-out';
            tokenCircle.style.transform = 'scale(1)';
            tokenCircle.style.boxShadow = '';
            
            // Restore bobbing animation after settling
            setTimeout(() => {
                tokenCircle.style.transition = '';
                tokenCircle.style.animation = 'tokenBob 2s ease-in-out infinite alternate';
            }, 300);
        }
        
        // Position all tokens properly on the final square
        this.positionAllTokensOnSquare(targetPosition);
    }

    createSpecialEffect(effectType, position) {
        const square = document.getElementById(`square-${position}`);
        const rect = square.getBoundingClientRect();
        
        let effect;
        
        switch (effectType) {
            case 'teleport':
                effect = this.createTeleportEffect(rect);
                break;
            case 'wormhole':
                effect = this.createBeamEffect(rect);
                break;
            case 'boost':
                effect = this.createUFOEffect(rect);
                break;
            case 'blackhole':
                effect = this.createExplosionEffect(rect);
                break;
            case 'meteor':
                effect = this.createExplosionEffect(rect);
                break;
            case 'hostile':
                effect = this.createUFOEffect(rect);
                break;
        }
        
        if (effect) {
            this.specialEffects.appendChild(effect);
            setTimeout(() => {
                if (this.specialEffects.contains(effect)) {
                    this.specialEffects.removeChild(effect);
                }
            }, 3000);
        }
    }

    createTeleportEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'teleport-effect';
        effect.style.left = `${rect.left + rect.width / 2 - 40}px`;
        effect.style.top = `${rect.top + rect.height / 2 - 40}px`;
        return effect;
    }

    createBeamEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'beam-effect';
        effect.style.left = `${rect.left + rect.width / 2 - 2}px`;
        effect.style.top = '0px';
        return effect;
    }

    createExplosionEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'explosion-effect';
        effect.style.left = `${rect.left + rect.width / 2 - 50}px`;
        effect.style.top = `${rect.top + rect.height / 2 - 50}px`;
        return effect;
    }

    createUFOEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'ufo-effect';
        effect.textContent = '🛸';
        effect.style.left = `${rect.left - 100}px`;
        effect.style.top = `${rect.top - 30}px`;
        return effect;
    }

    handleWin() {
        this.gameWon = true;
        const winner = this.players[this.currentPlayer];
        this.updateGameMessage(`🎉 ${winner.name} wins! Congratulations, Space Explorer! 🚀`);
        
        // Update the top display to show the winner
        this.updateWinnerDisplay(winner);
        
        // Disable dice
        this.dice.style.cursor = 'not-allowed';
        this.dice.style.opacity = '0.5';
        this.dice2.style.display = 'none'; // Hide second dice on game end
        const instruction = document.querySelector('.dice-instruction');
        if (instruction) {
            instruction.textContent = 'GAME OVER';
        }
        
        // Hide dice and show new game button in its place
        const diceSection = document.querySelector('.dice-section');
        const newGameBtn = document.getElementById('newGameBtn');
        if (diceSection && newGameBtn) {
            diceSection.style.display = 'none';
            newGameBtn.style.display = 'block';
            
            // Move new game button to dice section
            const controlPanel = document.querySelector('.control-panel');
            const currentPlayerDisplay = document.querySelector('.current-player-display');
            if (currentPlayerDisplay && controlPanel) {
                controlPanel.insertBefore(newGameBtn, currentPlayerDisplay.nextSibling);
            }
        }
        
        // Play winner sound
        this.playWinnerSound();
        
        // Celebration effect
        this.createCelebrationEffects();
    }

    updateWinnerDisplay(winner) {
        const currentPlayerDisplay = document.querySelector('.current-player-display');
        const avatarElement = document.getElementById('activePlayerAvatar');
        const nameElement = avatarElement?.querySelector('.player-name');
        const tokenElement = avatarElement?.querySelector('.avatar-token');
        
        if (currentPlayerDisplay && avatarElement && nameElement && tokenElement) {
            // Update to show winner with special styling
            currentPlayerDisplay.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e)';
            currentPlayerDisplay.style.border = '3px solid #ffd700';
            currentPlayerDisplay.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
            
            nameElement.textContent = `🏆 ${winner.name} WINS! 🏆`;
            nameElement.style.color = '#000';
            nameElement.style.fontWeight = 'bold';
            nameElement.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8)';
            
            tokenElement.textContent = winner.icon;
            tokenElement.style.background = winner.color;
            tokenElement.style.transform = 'scale(1.2)';
            tokenElement.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
        }
    }

    createCelebrationEffects() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'explosion-effect';
                effect.style.left = `${Math.random() * window.innerWidth}px`;
                effect.style.top = `${Math.random() * window.innerHeight}px`;
                effect.style.background = 'radial-gradient(circle, #ffd700, #ffed4e, transparent)';
                this.specialEffects.appendChild(effect);
                
                setTimeout(() => {
                    if (this.specialEffects.contains(effect)) {
                        this.specialEffects.removeChild(effect);
                    }
                }, 1000);
            }, i * 200);
        }
    }

    switchPlayer() {
        // Switch to next alive player
        let nextPlayer = (this.currentPlayer % this.playerCount) + 1;
        let attempts = 0;
        
        // Skip dead players
        while (!this.players[nextPlayer].isAlive && attempts < this.playerCount) {
            nextPlayer = (nextPlayer % this.playerCount) + 1;
            attempts++;
        }
        
        this.currentPlayer = nextPlayer;
        
        // Update control panel
        this.updateControlPanel();
        
        // Reset rolling state now that all movement processing is complete
        this.isRolling = false;
        
        const currentPlayer = this.players[this.currentPlayer];
        
        if (currentPlayer.isBot) {
            this.updateGameMessage(`${currentPlayer.name}'s turn! Bot is thinking...`);
            this.dice.style.cursor = 'not-allowed';
            this.dice.style.opacity = '0.7';
            const instruction = document.querySelector('.dice-instruction');
            if (instruction) {
                instruction.textContent = 'Click dice to roll!';
            }
            // Add small delay to ensure UI updates before bot acts
            setTimeout(() => this.handleBotTurn(), 500);
        } else {
            this.updateGameMessage(`${currentPlayer.name}'s turn! Click the dice to continue your space adventure!`);
            this.dice.style.cursor = 'not-allowed';
            this.dice.style.opacity = '0.7';
            const instruction = document.querySelector('.dice-instruction');
            if (instruction) {
                instruction.textContent = 'Click dice to roll!';
            }
        }
    }

    async handleBoardSwitcher(position) {
        const player = this.players[this.currentPlayer];
        
        this.updateGameMessage(`🔀 Board Switcher activated! Randomizing all special squares...`);
        
        // Play board switcher sound
        this.playBoardSwitcherSound();
        
        // Start glitch effect on the entire board
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.classList.add('board-glitch');
        
        // Add glitch effect to all squares
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            if (square.classList.contains('good') || square.classList.contains('bad') || square.classList.contains('switcher')) {
                square.classList.add('square-glitch');
            }
        });
        
        // Wait for glitch effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Regenerate all special squares
        this.generateRandomSpecialSquares();
        
        // Recreate the board visual
        this.recreateBoardSquares();
        
        // Remove glitch effects
        gameBoard.classList.remove('board-glitch');
        squares.forEach(square => {
            square.classList.remove('square-glitch');
        });
        
        this.updateGameMessage('🎲 Board randomized! Checking all player positions...');
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check all players on special squares and move them
        await this.processAllPlayersAfterBoardSwitch();
        
        // Normal turn completion logic
        if (this.lastRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.updateGameMessage(`Board switcher complete! ${player.name}'s turn ended.`);
            this.switchPlayer();
        }
    }

    recreateBoardSquares() {
        // Update existing squares with new special square types
        for (let i = 1; i <= 100; i++) {
            const square = document.getElementById(`square-${i}`);
            if (!square) continue;
            
            // Reset classes
            square.className = 'square';
            
            // Apply new classes and icons
            if (i === 1) {
                square.classList.add('start');
                square.innerHTML = '🚀';
            } else if (i === 100) {
                square.classList.add('finish');
                square.innerHTML = '🏆';
            } else if (this.specialSquares[i]) {
                const special = this.specialSquares[i];
                square.classList.add(special.type);
                if (special.type === 'good') {
                    square.innerHTML = '🟢';
                } else if (special.type === 'bad') {
                    square.innerHTML = '🔴';
                } else if (special.type === 'switcher') {
                    square.innerHTML = '🔀';
                } else if (special.type === 'death') {
                    square.innerHTML = '💀';
                } else if (special.type === 'laser') {
                    square.innerHTML = '🔫';
                } else if (special.type === 'bomb') {
                    square.innerHTML = '💣';
                } else if (special.type === 'mystery') {
                    square.innerHTML = '❓';
                } else if (special.type === 'teleport') {
                    square.innerHTML = '🛸';
                } else if (special.type === 'comet') {
                    square.innerHTML = '☄️';
                } else if (special.type === 'life_collectible') {
                    square.innerHTML = '❤️';
                } else if (special.type === 'shield_collectible') {
                    square.innerHTML = '🛡️';
                } else if (special.type === 'dice_collectible') {
                    square.innerHTML = '🎲';
                }
            } else {
                square.classList.add('normal');
                const spaceIcons = [
                    // Stars and celestial bodies
                    '⭐', '🌟', '✨', '💫', '🌠', '🌌', '⚡', 
                    // Planets and moons
                    '🌍', '🌎', '🌏', '🌙', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🪐',
                    // Space objects and technology
                    '🛰️', '🚀', '🛸', '🌌', '☄️', '🌞', '🔭',
                    // Aliens and space creatures
                    '👽', '👾', '🛸', '🤖', '🧠', 
                    // Space elements
                    '🌌', '⭐', '🔮', '⚛️', '🌀'
                ];
                const robotIcons = ['🤖', '🤖'];  // Reduced frequency since robots are now in spaceIcons
                const allIcons = [...spaceIcons, ...robotIcons];
                const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
                square.innerHTML = randomIcon;
            }
        }
        
        // Recreate board connections
        this.createBoardConnections();
    }

    async processAllPlayersAfterBoardSwitch() {
        // CRITICAL: Store the original turn state to preserve it during processing
        const originalCurrentPlayer = this.currentPlayer;
        // NOTE: We do NOT preserve isRolling - it should be managed by turn completion logic
        
        // Find all players on special squares and their square types
        const playersOnSpecialSquares = [];
        
        for (let playerNum = 1; playerNum <= this.playerCount; playerNum++) {
            const player = this.players[playerNum];
            const currentPosition = player.position;
            
            if (this.specialSquares[currentPosition]) {
                const special = this.specialSquares[currentPosition];
                // Include ALL square types including switcher - randomizer can chain!
                playersOnSpecialSquares.push({
                    playerNum,
                    position: currentPosition,
                    squareType: special.type,
                    player: player
                });
            }
        }
        
        if (playersOnSpecialSquares.length === 0) {
            return;
        }
        
        // RANDOM EXECUTION ORDER - shuffle the array to randomize who goes first
        for (let i = playersOnSpecialSquares.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playersOnSpecialSquares[i], playersOnSpecialSquares[j]] = [playersOnSpecialSquares[j], playersOnSpecialSquares[i]];
        }
        
        this.updateGameMessage(`⚡ Processing ${playersOnSpecialSquares.length} players on special squares in random order!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process each player in random order
        for (const playerData of playersOnSpecialSquares) {
            const { playerNum, position, squareType, player } = playerData;
            
            if (!player.isAlive) {
                continue; // Skip dead players
            }
            
            if (squareType === 'good' || squareType === 'bad') {
                this.updateGameMessage(`${player.name} is on a ${squareType} square! Moving...`);
                
                const isGood = squareType === 'good';
                const randomMovement = 1 + Math.floor(Math.random() * 12);
                const newPosition = isGood ? 
                    Math.min(position + randomMovement, 100) : 
                    Math.max(position - randomMovement, 1);
                
                // Play appropriate sound
                if (isGood) {
                    this.playGoodSound();
                } else {
                    this.playBadSound();
                }
                
                // Light up path and move
                await this.lightUpPath(position, newPosition, isGood);
                await new Promise(resolve => setTimeout(resolve, 800));
                await this.animateMovement(player, newPosition);
                this.clearLitPath();
                
                // Check for win condition
                if (player.position === 100) {
                    this.updateGameMessage(`🏆 Incredible! ${player.name} won due to the board switcher!`);
                    this.gameWon = true;
                    this.handleWin();
                    return;
                }
                
                // Wait between player movements
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } else if (squareType === 'death' || squareType === 'laser' || squareType === 'bomb') {
                // Handle dangerous squares after board switch
                this.updateGameMessage(`${player.name} is on a ${squareType} square after board switch!`);
                
                // Switch current player to handle their dangerous square
                this.currentPlayer = playerNum;
                
                if (squareType === 'death') {
                    await this.handleDeathSquare(position);
                } else if (squareType === 'laser') {
                    await this.handleLaserSquare(position);  
                } else if (squareType === 'bomb') {
                    await this.handleBombSquare(position);
                }
                
                // If someone was eliminated, check for game end
                const alivePlayersAfter = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayersAfter.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
                
            } else if (squareType === 'mystery') {
                // Handle mystery boxes after board switch
                this.updateGameMessage(`❓ ${player.name} found a mystery box after board switch!`);
                
                // Switch current player to handle their mystery box
                this.currentPlayer = playerNum;
                
                await this.handleMysteryBox(position);
                
                // Wait between player movements
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } else if (squareType === 'switcher') {
                // RANDOMIZER CAN CHAIN! This is the key fix
                this.updateGameMessage(`🔀 ${player.name} triggered another board randomizer! Chaos ensues!`);
                
                // Switch current player to handle their randomizer
                this.currentPlayer = playerNum;
                
                await this.handleBoardSwitcher(position);
                
                // IMPORTANT: After a board switcher, we need to STOP processing the rest
                // of the players because the board has changed and we need to re-evaluate
                this.updateGameMessage(`🌪️ Board randomized again! Re-evaluating all player positions...`);
                
                // Recursive call to handle the new board state
                await this.processAllPlayersAfterBoardSwitch();
                return; // Exit this iteration since we're recursing
            }
        }
        
        // Reposition all tokens after movements
        for (let i = 1; i <= 100; i++) {
            const playersOnSquare = [];
            for (let j = 1; j <= this.playerCount; j++) {
                if (this.players[j].position === i) {
                    playersOnSquare.push(j);
                }
            }
            if (playersOnSquare.length > 0) {
                this.positionAllTokensOnSquare(i);
            }
        }
        
        // CRITICAL: Restore the original turn state after processing
        this.currentPlayer = originalCurrentPlayer;
        // NOTE: We do NOT restore isRolling - let turn completion logic handle it
    }

    async handleDeathSquare(position, fromKnockback = false) {
        const player = this.players[this.currentPlayer];
        
        this.updateGameMessage(`💀 Death trap triggers! ${player.name} loses a life!`);
        this.playExplosionSound();
        
        // Show death hit animation on current player's card
        const playerCard = document.getElementById(`player${this.currentPlayer}Card`);
        if (playerCard) {
            playerCard.classList.add('death-hit');
        }
        
        // Wait for death effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reduce life with heart loss animation
        await this.animateHeartLoss(this.currentPlayer);
        player.lives--;
        this.updatePlayerStatusCards();
        
        // Remove death hit animation
        if (playerCard) {
            playerCard.classList.remove('death-hit');
        }
        
        if (player.lives <= 0) {
            player.isAlive = false;
            this.updateAllPlayerTokens(); // Update board tokens to show skull
            this.updateGameMessage(`💀 ${player.name} has been eliminated!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if game should end
            const alivePlayers = Object.values(this.players).filter(p => p.isAlive);
            if (alivePlayers.length <= 1) {
                this.handleLastPlayerWin();
                return;
            }
        } else {
            this.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Normal turn completion logic
        if (this.lastRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    async handleLaserSquare(position, fromKnockback = false) {
        const player = this.players[this.currentPlayer];
        
        // Find alive players to target (excluding current player)
        const possibleTargets = [];
        for (let i = 1; i <= this.playerCount; i++) {
            if (i !== this.currentPlayer && this.players[i].isAlive) {
                possibleTargets.push(i);
            }
        }
        
        if (possibleTargets.length === 0) {
            this.updateGameMessage(`🔫 Laser activated but no targets available!`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.continueAfterDangerousSquare(fromKnockback);
            return;
        }
        
        this.playGoodSound(); // Laser is good for the shooter
        
        // Use new dramatic player selection animation
        const targetPlayerNum = await this.animatePlayerSelection(possibleTargets, `🔫 ${player.name} activating laser targeting system...`);
        const target = this.players[targetPlayerNum];
        
        
        // Show final target with laser hit animation
        const targetCard = document.getElementById(`player${targetPlayerNum}Card`);
        if (targetCard) {
            targetCard.classList.add('laser-hit');
        }
        
        this.updateGameMessage(`🔫 ${player.name} fires laser at ${target.name}!`);
        
        // Wait for laser effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check for reverse card
        if (target.reverseCard) {
            // Reverse the attack!
            target.reverseCard = false; // Consume the reverse card
            this.updatePlayerStatusCards();
            
            this.updateGameMessage(`🛡️💥 ${target.name} deflects the laser back at ${player.name}!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Remove laser hit animation from target
            if (targetCard) {
                targetCard.classList.remove('laser-hit');
            }
            
            // Apply laser hit to original attacker
            const attackerCard = document.getElementById(`player${this.currentPlayer}Card`);
            if (attackerCard) {
                attackerCard.classList.add('laser-hit');
            }
            
            // Damage the original attacker
            await this.animateHeartLoss(this.currentPlayer);
            player.lives--;
            this.updatePlayerStatusCards();
            
            // Remove laser hit animation from attacker
            if (attackerCard) {
                attackerCard.classList.remove('laser-hit');
            }
            
            if (player.lives <= 0) {
                player.isAlive = false;
                this.updateAllPlayerTokens(); // Update board tokens to show skull
                this.updateGameMessage(`💀 ${player.name} has been eliminated by their own reversed laser!`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if game should end
                const alivePlayers = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayers.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
            } else {
                this.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } else {
            // Normal laser attack
            await this.animateHeartLoss(targetPlayerNum);
            target.lives--;
            this.updatePlayerStatusCards();
            
            // Remove laser hit animation
            if (targetCard) {
                targetCard.classList.remove('laser-hit');
            }
            
            if (target.lives <= 0) {
                target.isAlive = false;
                this.updateAllPlayerTokens(); // Update board tokens to show skull
                this.updateGameMessage(`💀 ${target.name} has been eliminated by laser!`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if game should end
                const alivePlayers = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayers.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
            } else {
                this.updateGameMessage(`${target.name} has ${target.lives} lives remaining.`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
        
        this.continueAfterDangerousSquare(fromKnockback);
    }

    async handleBombSquare(position, fromKnockback = false) {
        const player = this.players[this.currentPlayer];
        
        this.playExplosionSound();
        
        // Find all alive players (including current player - bomb can hurt anyone!)
        const alivePlayers = [];
        for (let i = 1; i <= this.playerCount; i++) {
            if (this.players[i].isAlive) {
                alivePlayers.push(i);
            }
        }
        
        // Use new dramatic player selection animation
        const victimPlayerNum = await this.animatePlayerSelection(alivePlayers, `💣 ${player.name} triggered a bomb! Calculating blast radius...`);
        const victim = this.players[victimPlayerNum];
        
        
        // Show final victim with bomb hit animation
        const victimCard = document.getElementById(`player${victimPlayerNum}Card`);
        if (victimCard) {
            victimCard.classList.add('bomb-hit');
        }
        
        this.updateGameMessage(`💥 The bomb hits ${victim.name}!`);
        
        // Wait for bomb effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check for reverse card (only if victim is not the bomber themselves)
        if (victim.reverseCard && victimPlayerNum !== this.currentPlayer) {
            // Reverse the bomb damage!
            victim.reverseCard = false; // Consume the reverse card
            this.updatePlayerStatusCards();
            
            this.updateGameMessage(`🛡️💥 ${victim.name} deflects the bomb blast back at ${player.name}!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Remove bomb hit animation from victim
            if (victimCard) {
                victimCard.classList.remove('bomb-hit');
            }
            
            // Apply bomb hit to original bomber
            const bomberCard = document.getElementById(`player${this.currentPlayer}Card`);
            if (bomberCard) {
                bomberCard.classList.add('bomb-hit');
            }
            
            // Damage the original bomber
            await this.animateHeartLoss(this.currentPlayer);
            player.lives--;
            this.updatePlayerStatusCards();
            
            // Remove bomb hit animation from bomber
            if (bomberCard) {
                bomberCard.classList.remove('bomb-hit');
            }
            
            if (player.lives <= 0) {
                player.isAlive = false;
                this.updateAllPlayerTokens(); // Update board tokens to show skull
                this.updateGameMessage(`💀 ${player.name} has been eliminated by their own reversed bomb!`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if game should end
                const alivePlayersAfter = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayersAfter.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
            } else {
                this.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } else {
            // Normal bomb attack
            await this.animateHeartLoss(victimPlayerNum);
            victim.lives--;
            this.updatePlayerStatusCards();
            
            // Remove bomb hit animation
            if (victimCard) {
                victimCard.classList.remove('bomb-hit');
            }
            
            if (victim.lives <= 0) {
                victim.isAlive = false;
                this.updateAllPlayerTokens(); // Update board tokens to show skull
                this.updateGameMessage(`💀 ${victim.name} has been eliminated by the bomb!`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if game should end
                const alivePlayersAfter = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayersAfter.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
            } else {
                this.updateGameMessage(`${victim.name} has ${victim.lives} lives remaining.`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
        
        this.continueAfterDangerousSquare(fromKnockback);
    }

    async handleCometSquare(position, fromKnockback = false) {
        const player = this.players[this.currentPlayer];
        
        this.playExplosionSound();
        
        this.updateGameMessage(`☄️ ${player.name} disturbed a comet field! Incoming meteor shower!`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate 3-6 random comets
        const numComets = 3 + Math.floor(Math.random() * 4);
        this.updateGameMessage(`☄️ ${numComets} comets incoming! Take cover!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create and launch comets simultaneously
        const cometAnimations = [];
        for (let i = 0; i < numComets; i++) {
            cometAnimations.push(this.launchComet(i));
        }
        
        // Wait for all comets to complete their paths
        await Promise.all(cometAnimations);
        
        this.updateGameMessage(`☄️ Meteor shower complete!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.continueAfterDangerousSquare(fromKnockback);
    }

    async launchComet(cometId) {
        // Create comet element
        const comet = document.createElement('div');
        comet.className = 'comet';
        comet.id = `comet-${cometId}`;
        comet.innerHTML = '☄️';
        
        // Generate random start and end positions around the screen edges
        const gameBoard = document.getElementById('gameBoard');
        const boardRect = gameBoard.getBoundingClientRect();
        
        // Random edge starting position (top, right, bottom, left)
        const startEdge = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;
        
        switch (startEdge) {
            case 0: // Top edge
                startX = Math.random() * boardRect.width;
                startY = -50;
                endX = Math.random() * boardRect.width;
                endY = boardRect.height + 50;
                break;
            case 1: // Right edge
                startX = boardRect.width + 50;
                startY = Math.random() * boardRect.height;
                endX = -50;
                endY = Math.random() * boardRect.height;
                break;
            case 2: // Bottom edge
                startX = Math.random() * boardRect.width;
                startY = boardRect.height + 50;
                endX = Math.random() * boardRect.width;
                endY = -50;
                break;
            case 3: // Left edge
                startX = -50;
                startY = Math.random() * boardRect.height;
                endX = boardRect.width + 50;
                endY = Math.random() * boardRect.height;
                break;
        }
        
        // Calculate angle for comet rotation (face direction of movement)
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Set initial position and rotation
        comet.style.position = 'absolute';
        comet.style.left = `${startX}px`;
        comet.style.top = `${startY}px`;
        comet.style.transform = `rotate(${angle}deg)`;
        comet.style.fontSize = '2em';
        comet.style.zIndex = '2000';
        comet.style.transition = 'all 3s linear';
        comet.style.filter = 'drop-shadow(0 0 10px orange)';
        
        // Add comet to game board
        gameBoard.appendChild(comet);
        
        // Start collision detection
        const collisionChecker = this.startCometCollisionDetection(comet, cometId);
        
        // Small delay then animate to end position
        await new Promise(resolve => setTimeout(resolve, 100));
        comet.style.left = `${endX}px`;
        comet.style.top = `${endY}px`;
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Stop collision detection and remove comet
        clearInterval(collisionChecker);
        if (comet.parentNode) {
            comet.parentNode.removeChild(comet);
        }
    }

    startCometCollisionDetection(comet, cometId) {
        return setInterval(() => {
            if (!comet.parentNode) return; // Comet already removed
            
            const cometRect = comet.getBoundingClientRect();
            const cometCenterX = cometRect.left + cometRect.width / 2;
            const cometCenterY = cometRect.top + cometRect.height / 2;
            
            // Check collision with all alive players
            for (let playerNum = 1; playerNum <= this.playerCount; playerNum++) {
                const player = this.players[playerNum];
                if (!player.isAlive) continue;
                
                const tokenElement = player.element;
                if (!tokenElement) continue;
                
                const tokenRect = tokenElement.getBoundingClientRect();
                const tokenCenterX = tokenRect.left + tokenRect.width / 2;
                const tokenCenterY = tokenRect.top + tokenRect.height / 2;
                
                // Check if comet is close enough to player token (collision)
                const distance = Math.sqrt(
                    Math.pow(cometCenterX - tokenCenterX, 2) + 
                    Math.pow(cometCenterY - tokenCenterY, 2)
                );
                
                if (distance < 40) { // Collision threshold
                    this.handleCometHit(player, playerNum, comet, cometId);
                    return; // Stop checking after first hit
                }
            }
        }, 50); // Check every 50ms
    }

    async handleCometHit(player, playerNum, comet, cometId) {
        // Remove the comet immediately
        if (comet.parentNode) {
            comet.parentNode.removeChild(comet);
        }
        
        // Create explosion effect at hit location
        const cometRect = comet.getBoundingClientRect();
        this.createExplosionAt(cometRect.left + cometRect.width / 2, cometRect.top + cometRect.height / 2);
        
        this.playExplosionSound();
        
        // Coin flip animation to determine fate
        const loseLife = await this.animateCometCoinFlip(player, playerNum);
        
        if (loseLife) {
            this.updateGameMessage(`☄️💥 Comet hit ${player.name}! Life lost!`);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Animate heart loss
            await this.animateHeartLoss(playerNum);
            player.lives--;
            this.updatePlayerStatusCards();
            
            if (player.lives <= 0) {
                player.isAlive = false;
                this.updateAllPlayerTokens();
                this.updateGameMessage(`💀 ${player.name} has been eliminated by the comet!`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if game should end
                const alivePlayersAfter = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayersAfter.length <= 1) {
                    this.handleLastPlayerWin();
                    return;
                }
            } else {
                this.updateGameMessage(`${player.name} has ${player.lives} lives remaining.`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } else {
            // Knockback 1-12 spaces
            const knockbackSpaces = 1 + Math.floor(Math.random() * 12);
            const newPosition = Math.max(player.position - knockbackSpaces, 1);
            
            this.updateGameMessage(`☄️💥 Comet hit ${player.name}! Knocked back ${knockbackSpaces} spaces!`);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Animate spinning knockback movement
            await this.animateSpinningMovement(player, newPosition);
            
            // Check for collisions at new position
            await this.handlePlayerCollisions(newPosition);
        }
    }

    async animateCometCoinFlip(player, playerNum) {
        const tokenElement = player.element;
        const tokenCircle = tokenElement.querySelector('.token-circle');
        
        if (!tokenCircle) return Math.random() < 0.5; // Fallback
        
        // Create explosion effect at token location during flip
        const tokenRect = tokenElement.getBoundingClientRect();
        setTimeout(() => {
            this.createExplosionAt(
                tokenRect.left + tokenRect.width / 2, 
                tokenRect.top + tokenRect.height / 2
            );
        }, 400);
        
        // Coin flip animation - flip in Y axis and scale up
        tokenCircle.style.transition = 'transform 1.2s ease-in-out';
        tokenCircle.style.transform = 'rotateY(1800deg) scale(1.5)'; // 5 full flips + scale up
        tokenCircle.style.animation = 'none'; // Stop bobbing during flip
        
        // Wait for flip animation
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Determine result (50/50 chance)
        const loseLife = Math.random() < 0.5;
        
        // Land showing the result with a brief pause
        if (loseLife) {
            // Land showing "hurt" state (slightly smaller, red tint)
            tokenCircle.style.transition = 'transform 0.4s ease-out, filter 0.4s ease-out';
            tokenCircle.style.transform = 'rotateY(0deg) scale(0.9)';
            tokenCircle.style.filter = 'hue-rotate(0deg) brightness(0.8) saturate(0.7)';
        } else {
            // Land showing "dizzy" state (normal size, spin effect)
            tokenCircle.style.transition = 'transform 0.4s ease-out';
            tokenCircle.style.transform = 'rotateY(0deg) scale(1) rotate(15deg)';
        }
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Reset to normal state
        tokenCircle.style.transition = 'all 0.3s ease-out';
        tokenCircle.style.transform = 'rotateY(0deg) scale(1) rotate(0deg)';
        tokenCircle.style.filter = '';
        
        // Restore bobbing animation
        setTimeout(() => {
            tokenCircle.style.transition = '';
            tokenCircle.style.animation = 'tokenBob 2s ease-in-out infinite alternate';
        }, 300);
        
        return loseLife;
    }

    async animateSpinningMovement(player, targetPosition) {
        const startPosition = player.position;
        const steps = Math.abs(targetPosition - startPosition);
        
        // If moving more than 1 square, animate step by step with spinning
        if (steps > 1) {
            const direction = targetPosition > startPosition ? 1 : -1;
            
            for (let step = 1; step <= steps; step++) {
                const currentPos = startPosition + (step * direction);
                await this.animateSpinningToSingleSquare(player, currentPos, step === steps);
                
                // Small delay between steps for smooth movement
                if (step < steps) {
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
            }
        } else {
            // Single square movement with spin
            await this.animateSpinningToSingleSquare(player, targetPosition, true);
        }
    }

    async animateSpinningToSingleSquare(player, targetPosition, isFinalPosition) {
        const tokenOverlay = document.getElementById('tokenOverlay');
        const targetSquare = document.getElementById(`square-${targetPosition}`);
        
        if (!targetSquare || !tokenOverlay) return;
        
        // Get positions for smooth animation
        const overlayRect = tokenOverlay.getBoundingClientRect();
        const targetRect = targetSquare.getBoundingClientRect();
        
        // Calculate positions relative to overlay
        const targetX = targetRect.left - overlayRect.left + targetRect.width / 2 - 30;
        const targetY = targetRect.top - overlayRect.top + targetRect.height / 2 - 37.5;
        
        // Add spinning effect to token
        const tokenCircle = player.element.querySelector('.token-circle');
        if (tokenCircle) {
            tokenCircle.style.transform = 'scale(1.1) rotate(360deg)'; // Spin while moving
            tokenCircle.style.boxShadow = `0 0 20px ${player.color}`;
            tokenCircle.style.animation = 'none'; // Stop bobbing during movement
        }
        
        // Update position data
        player.position = targetPosition;
        
        // Animate to target position with spinning bounce
        player.element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        player.element.style.left = `${targetX}px`;
        player.element.style.top = `${targetY}px`;
        player.element.style.transform = 'scale(1.05) rotate(180deg)';
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reset styles
        if (tokenCircle) {
            tokenCircle.style.transition = 'all 0.3s ease-out';
            tokenCircle.style.transform = 'scale(1) rotate(0deg)';
            tokenCircle.style.boxShadow = '';
            
            setTimeout(() => {
                tokenCircle.style.animation = 'tokenBob 2s ease-in-out infinite alternate';
                tokenCircle.style.transition = '';
            }, 300);
        }
        
        player.element.style.transition = '';
        player.element.style.transform = '';
        
        // Position all tokens properly on the final square
        if (isFinalPosition) {
            this.positionAllTokensOnSquare(targetPosition);
        }
    }

    createExplosionAt(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'comet-explosion';
        explosion.innerHTML = '💥';
        explosion.style.position = 'fixed';
        explosion.style.left = `${x - 25}px`;
        explosion.style.top = `${y - 25}px`;
        explosion.style.fontSize = '3em';
        explosion.style.zIndex = '2500';
        explosion.style.pointerEvents = 'none';
        explosion.style.animation = 'cometExplosion 1s ease-out forwards';
        
        document.body.appendChild(explosion);
        
        // Remove after animation
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 1000);
    }

    async handleLifeCollectible(position) {
        const player = this.players[this.currentPlayer];
        
        // Check if player already has maximum lives
        if (player.lives >= 3) {
            this.updateGameMessage(`❤️ ${player.name} found a life heart but already has maximum lives! Square remains available.`);
            this.playRobotSound();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Continue turn normally (square remains for next player)
            if (this.mainDiceRoll === 6) {
                this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
                this.enableNextTurn();
            } else {
                this.switchPlayer();
            }
            return;
        }
        
        // Collect the life
        this.updateGameMessage(`❤️ ${player.name} found a life heart! +1 life gained!`);
        this.playGoodSound();
        
        player.lives++;
        this.updatePlayerStatusCards();
        
        // Remove the collectible square
        delete this.specialSquares[position];
        const square = document.getElementById(`square-${position}`);
        square.classList.remove('life_collectible');
        square.innerHTML = '✨'; // Replace with sparkle
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Continue turn normally
        if (this.mainDiceRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    async handleShieldCollectible(position) {
        const player = this.players[this.currentPlayer];
        
        // Check if player already has a reverse card
        if (player.reverseCard) {
            this.updateGameMessage(`🛡️ ${player.name} found a shield but already has one! Square remains available.`);
            this.playRobotSound();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Continue turn normally (square remains for next player)
            if (this.mainDiceRoll === 6) {
                this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
                this.enableNextTurn();
            } else {
                this.switchPlayer();
            }
            return;
        }
        
        // Collect the shield
        this.updateGameMessage(`🛡️ ${player.name} found a protective shield! Next attack will be deflected!`);
        this.playGoodSound();
        
        player.reverseCard = true;
        this.updatePlayerStatusCards();
        
        // Remove the collectible square
        delete this.specialSquares[position];
        const square = document.getElementById(`square-${position}`);
        square.classList.remove('shield_collectible');
        square.innerHTML = '✨'; // Replace with sparkle
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Continue turn normally
        if (this.mainDiceRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    async handleDiceCollectible(position) {
        const player = this.players[this.currentPlayer];
        
        // Always restore dice moves to 3 (doesn't get "full" - always beneficial)
        const previousDice = player.extraDiceRemaining;
        player.extraDiceRemaining = 3;
        
        if (previousDice === 0) {
            this.updateGameMessage(`🎲 ${player.name} found extra dice! Awarded 3 bonus moves!`);
        } else if (previousDice < 3) {
            this.updateGameMessage(`🎲 ${player.name} found extra dice! Restored to 3 bonus moves! (was ${previousDice})`);
        } else {
            this.updateGameMessage(`🎲 ${player.name} found extra dice! Refreshed to 3 bonus moves!`);
        }
        
        this.playGoodSound();
        this.updatePlayerStatusCards();
        
        // Remove the collectible square
        delete this.specialSquares[position];
        const square = document.getElementById(`square-${position}`);
        square.classList.remove('dice_collectible');
        square.innerHTML = '✨'; // Replace with sparkle
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Continue turn normally
        if (this.mainDiceRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    async handleTeleportSquare(position, fromKnockback = false) {
        const player = this.players[this.currentPlayer];
        
        this.updateGameMessage(`🛸 ${player.name} activated an alien teleporter! Calculating destination...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculate player's current row and column (board is 10x10, square 1 is bottom-left)
        const currentRow = Math.floor((position - 1) / 10);
        const currentCol = (position - 1) % 10;
        
        // Generate teleport options with proper boundary checking
        const teleportOptions = [];
        
        // Horizontal movement (any distance left or right within same row)
        // Left movement: only if not already on leftmost column (col 0)
        if (currentCol > 0) {
            for (let col = 0; col < currentCol; col++) {
                const targetSquare = (currentRow * 10) + col + 1;
                teleportOptions.push({
                    direction: 'left',
                    distance: currentCol - col,
                    targetSquare: targetSquare
                });
            }
        }
        
        // Right movement: only if not already on rightmost column (col 9)
        if (currentCol < 9) {
            for (let col = currentCol + 1; col < 10; col++) {
                const targetSquare = (currentRow * 10) + col + 1;
                teleportOptions.push({
                    direction: 'right',
                    distance: col - currentCol,
                    targetSquare: targetSquare
                });
            }
        }
        
        // Vertical movement (max 3 spaces up or down)
        // Down movement: only if not already on bottom row (row 0)
        if (currentRow > 0) {
            for (let rowOffset = 1; rowOffset <= 3 && (currentRow - rowOffset) >= 0; rowOffset++) {
                const targetRow = currentRow - rowOffset;
                const targetSquare = (targetRow * 10) + currentCol + 1;
                teleportOptions.push({
                    direction: 'down',
                    distance: rowOffset,
                    targetSquare: targetSquare
                });
            }
        }
        
        // Up movement: only if not already on top row (row 9)  
        if (currentRow < 9) {
            for (let rowOffset = 1; rowOffset <= 3 && (currentRow + rowOffset) < 10; rowOffset++) {
                const targetRow = currentRow + rowOffset;
                const targetSquare = (targetRow * 10) + currentCol + 1;
                teleportOptions.push({
                    direction: 'up',
                    distance: rowOffset,
                    targetSquare: targetSquare
                });
            }
        }
        
        // If no options available (shouldn't happen), generate a random nearby square
        if (teleportOptions.length === 0) {
            console.warn('No teleport options available, using fallback');
            const randomMovement = 1 + Math.floor(Math.random() * 12);
            const newPosition = Math.min(player.position + randomMovement, 100);
            teleportOptions.push({
                direction: 'forward',
                distance: randomMovement,
                targetSquare: newPosition
            });
        }
        
        // Select a random teleport option
        const selectedOption = teleportOptions[Math.floor(Math.random() * teleportOptions.length)];
        
        this.updateGameMessage(`🎆 Alien technology teleports ${player.name} ${selectedOption.direction} ${selectedOption.distance} space${selectedOption.distance > 1 ? 's' : ''}!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use teleport-specific white animation
        await this.lightUpTeleportPath(position, selectedOption.targetSquare, selectedOption.direction);
        await this.animateTeleportMovement(player, selectedOption.targetSquare);
        this.clearTeleportPath();
        
        // Check for collisions at destination
        await this.handlePlayerCollisions(selectedOption.targetSquare);
        
        // Check if landed on another special square
        if (this.specialSquares[selectedOption.targetSquare]) {
            const endSpecial = this.specialSquares[selectedOption.targetSquare];
            this.updateGameMessage(`🎲 ${player.name} teleported onto another special square!`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (endSpecial.destination !== undefined) {
                await this.handleSpecialSquare(selectedOption.targetSquare);
            } else {
                await this.handleNewSpecialSquare(selectedOption.targetSquare);
            }
            return;
        }
        
        // Check for win condition
        if (selectedOption.targetSquare === 100) {
            this.handleWin();
            return;
        }
        
        // Skip turn completion if this was triggered by knockback
        if (fromKnockback) {
            console.log('Skipping turn completion - teleporter triggered by knockback');
            return;
        }
        
        // Normal turn completion - follow the same pattern as other squares
        if (this.mainDiceRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.updateGameMessage(`${player.name} teleported to square ${selectedOption.targetSquare}`);
            this.switchPlayer();
        }
    }

    async handleMysteryBox(position) {
        const player = this.players[this.currentPlayer];
        
        // Show mystery box opening animation
        const square = document.getElementById(`square-${position}`);
        square.classList.add('mystery-box-opening');
        
        this.updateGameMessage(`❓ ${player.name} found a mystery box! Opening...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate random reward with weighted selection
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
        
        // Show slot machine animation
        const selectedReward = await this.showSlotMachine(rewards);
        
        // Apply the reward
        await this.applyMysteryReward(selectedReward.type, player, position);
        
        // Remove opening animation
        square.classList.remove('mystery-box-opening');
        
        // Remove the mystery box square since it's been used
        delete this.specialSquares[position];
        square.classList.remove('mystery');
        square.innerHTML = '⭐'; // Replace with a star
        
        // Normal turn completion logic
        if (this.lastRoll === 6) {
            this.updateGameMessage(`🎉 ${player.name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    async showSlotMachine(rewards) {
        return new Promise((resolve) => {
            // Create slot machine element
            const slotMachine = document.createElement('div');
            slotMachine.className = 'mystery-slot-machine';
            slotMachine.innerHTML = `
                <div class="slot-machine-title">🎰 MYSTERY REWARD 🎰</div>
                <div class="slot-machine-reel">
                    <div class="slot-reel-content" id="slotReelContent">🎲</div>
                </div>
                <div class="slot-machine-result" id="slotResult">Spinning...</div>
            `;
            
            document.body.appendChild(slotMachine);
            
            // Get reel content element
            const reelContent = document.getElementById('slotReelContent');
            const resultDiv = document.getElementById('slotResult');
            
            // Start spinning animation
            slotMachine.classList.add('slot-machine-spinning');
            
            let spinIndex = 0;
            const spinDuration = 3000; // 3 seconds
            const spinInterval = 100; // Change every 100ms
            
            // Weighted random selection for final result
            const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);
            let random = Math.random() * totalWeight;
            let selectedReward = null;
            
            for (const reward of rewards) {
                random -= reward.weight;
                if (random <= 0) {
                    selectedReward = reward;
                    break;
                }
            }
            
            // Spinning animation
            const spinTimer = setInterval(() => {
                const currentReward = rewards[spinIndex % rewards.length];
                reelContent.textContent = currentReward.icon;
                resultDiv.textContent = currentReward.name;
                spinIndex++;
            }, spinInterval);
            
            // Stop spinning and show result
            setTimeout(() => {
                clearInterval(spinTimer);
                slotMachine.classList.remove('slot-machine-spinning');
                
                // Show final result
                reelContent.textContent = selectedReward.icon;
                resultDiv.textContent = `You got: ${selectedReward.name}!`;
                
                // Wait a moment to show result, then remove slot machine
                setTimeout(() => {
                    document.body.removeChild(slotMachine);
                    resolve(selectedReward);
                }, 2000);
            }, spinDuration);
        });
    }

    async applyMysteryReward(rewardType, player, position) {
        switch (rewardType) {
            case 'extra_dice':
                player.extraDiceRemaining = 3;
                this.updateGameMessage(`🎲 ${player.name} earned an Extra Dice! Roll twice for the next 3 turns!`);
                this.playGoodSound();
                break;
                
            case 'life_bonus':
                if (player.lives < player.maxLives) {
                    player.lives++;
                    this.updateGameMessage(`❤️ ${player.name} gained a life! Lives: ${player.lives}/${player.maxLives}`);
                    this.playGoodSound();
                    this.updatePlayerStatusCards();
                } else {
                    this.updateGameMessage(`💔 ${player.name} is already at maximum lives! No effect.`);
                }
                break;
                
            case 'reverse_card':
                player.reverseCard = true;
                this.updateGameMessage(`🛡️ ${player.name} earned a Reverse Card! Next attack will be deflected!`);
                this.playGoodSound();
                break;
                
            case 'forward_move':
                const forwardSpaces = 1 + Math.floor(Math.random() * 12);
                const newForwardPos = Math.min(player.position + forwardSpaces, 100);
                this.updateGameMessage(`🚀 ${player.name} moves forward ${forwardSpaces} spaces!`);
                await this.lightUpPath(player.position, newForwardPos, true);
                await new Promise(resolve => setTimeout(resolve, 800));
                await this.animateMovement(player, newForwardPos);
                this.clearLitPath();
                this.playGoodSound();
                
                // Handle the end position just like normal movement
                await this.handlePlayerCollisions(newForwardPos);
                
                // Check for special squares at new position
                if (this.specialSquares[newForwardPos]) {
                    const special = this.specialSquares[newForwardPos];
                    if (special.destination !== undefined) {
                        await this.handleSpecialSquare(newForwardPos);
                    } else {
                        await this.handleNewSpecialSquare(newForwardPos);
                    }
                } else if (newForwardPos === 100) {
                    this.handleWin();
                }
                break;
                
            case 'backward_move':
                const backwardSpaces = 1 + Math.floor(Math.random() * 12);
                const newBackwardPos = Math.max(player.position - backwardSpaces, 1);
                this.updateGameMessage(`⬅️ ${player.name} moves backward ${backwardSpaces} spaces!`);
                await this.lightUpPath(player.position, newBackwardPos, false);
                await new Promise(resolve => setTimeout(resolve, 800));
                await this.animateMovement(player, newBackwardPos);
                this.clearLitPath();
                this.playBadSound();
                
                // Handle the end position just like normal movement
                await this.handlePlayerCollisions(newBackwardPos);
                
                // Check for special squares at new position
                if (this.specialSquares[newBackwardPos]) {
                    const special = this.specialSquares[newBackwardPos];
                    if (special.destination !== undefined) {
                        await this.handleSpecialSquare(newBackwardPos);
                    } else {
                        await this.handleNewSpecialSquare(newBackwardPos);
                    }
                }
                // Note: Backward movement can't reach square 100, so no win check needed
                break;
                
            case 'death_trap':
                this.updateGameMessage(`💀 ${player.name} triggered a death trap! Lost 1 life!`);
                await this.animateHeartLoss(this.currentPlayer);
                player.lives--;
                this.updatePlayerStatusCards();
                this.playBadSound();
                
                if (player.lives <= 0) {
                    player.isAlive = false;
                    this.updateAllPlayerTokens(); // Update board tokens to show skull
                    this.updateGameMessage(`💀 ${player.name} has been eliminated!`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const alivePlayers = Object.values(this.players).filter(p => p.isAlive);
                    if (alivePlayers.length <= 1) {
                        this.handleLastPlayerWin();
                        return;
                    }
                }
                break;
                
            case 'laser_attack':
                this.updateGameMessage(`🔫 ${player.name} activated a laser cannon!`);
                await this.handleLaserAttack();
                break;
                
            case 'bomb_blast':
                this.updateGameMessage(`💣 ${player.name} triggered a bomb!`);
                await this.handleBombAttack();
                break;
                
            case 'wild_card':
                // Randomly pick another reward type (excluding wild_card)
                const wildRewards = ['extra_dice', 'life_bonus', 'reverse_card', 'forward_move', 'backward_move'];
                const randomReward = wildRewards[Math.floor(Math.random() * wildRewards.length)];
                this.updateGameMessage(`🎭 Wild Card! ${player.name} gets a random reward...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                await this.applyMysteryReward(randomReward, player, position);
                break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    async handleLaserAttack() {
        // Reuse laser square logic but from mystery box context
        await this.handleLaserSquare(this.players[this.currentPlayer].position);
    }

    async handleBombAttack() {
        // Reuse bomb square logic but from mystery box context  
        await this.handleBombSquare(this.players[this.currentPlayer].position);
    }

    continueAfterDangerousSquare(fromKnockback = false) {
        // Skip turn completion if this was triggered by knockback
        if (fromKnockback) {
            console.log('Skipping turn completion - dangerous square triggered by knockback');
            return;
        }
        
        // Normal turn completion logic
        if (this.lastRoll === 6) {
            this.updateGameMessage(`🎉 ${this.players[this.currentPlayer].name} rolled a 6 on main dice! Roll again! 🎲`);
            this.enableNextTurn();
        } else {
            this.switchPlayer();
        }
    }

    handleLastPlayerWin() {
        const lastAlivePlayer = Object.values(this.players).find(p => p.isAlive);
        if (lastAlivePlayer) {
            this.gameWon = true;
            this.updateGameMessage(`🏆 ${lastAlivePlayer.name} is the last survivor and wins!`);
            this.handleWin();
        }
    }


    checkForRobotSound(position) {
        const square = document.getElementById(`square-${position}`);
        if (square && (square.innerHTML.includes('🛰️') || square.innerHTML.includes('🤖'))) {
            // Play robot sound for satellite and robot squares
            this.playRobotSound();
        }
    }

    async playRobotSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.robotSounds.length > 0) {
                // Use robot sounds array for robot squares
                const randomSound = this.robotSounds[Math.floor(Math.random() * this.robotSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('🤖 Played robot sound');
                    }).catch(error => {
                        console.warn('Robot sound blocked');
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing robot sound:', error);
        }
    }

    async playExplosionSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.explosionSounds.length > 0) {
                // Pick a random explosion sound
                const randomSound = this.explosionSounds[Math.floor(Math.random() * this.explosionSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('💥 Played explosion sound');
                    }).catch(error => {
                        console.warn('Explosion sound blocked:', error);
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing explosion sound:', error);
        }
    }

    async playWinnerSound() {
        if (!this.audioEnabled) return;
        
        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            if (this.winnerSounds.length > 0) {
                // Pick a random winner sound
                const randomSound = this.winnerSounds[Math.floor(Math.random() * this.winnerSounds.length)];
                randomSound.currentTime = 0;
                
                const playPromise = randomSound.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('🏆 Played winner sound');
                    }).catch(error => {
                        console.warn('Winner sound blocked:', error);
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing winner sound:', error);
        }
    }

    startSquareAnimations() {
        // Add random subtle animations to squares
        setInterval(() => {
            const squares = document.querySelectorAll('.square.normal');
            if (squares.length > 0) {
                // Animate 3-5 random squares every 5-10 seconds
                const numToAnimate = 3 + Math.floor(Math.random() * 3);
                const selectedSquares = [];
                
                for (let i = 0; i < numToAnimate; i++) {
                    const randomSquare = squares[Math.floor(Math.random() * squares.length)];
                    if (!selectedSquares.includes(randomSquare)) {
                        selectedSquares.push(randomSquare);
                        
                        // Add temporary extra animation
                        randomSquare.style.animation = 'subtleFloat 1s ease-in-out';
                        randomSquare.style.transform = 'scale(1.05) rotate(2deg)';
                        
                        setTimeout(() => {
                            randomSquare.style.animation = '';
                            randomSquare.style.transform = '';
                        }, 1000);
                    }
                }
            }
        }, 5000 + Math.random() * 5000); // Every 5-10 seconds
    }


    async animateHeartLoss(playerNum) {
        const card = document.getElementById(`player${playerNum}Card`);
        if (!card) return;
        
        // Add red glow/shake animation to the entire player card
        card.classList.add('life-lost');
        setTimeout(() => card.classList.remove('life-lost'), 1500);
        
        // Find the lives display in the leaderboard format
        const livesElement = card.querySelector('.player-lives-leaderboard');
        if (!livesElement) return;
        
        // Find the last red heart and animate it
        const hearts = livesElement.textContent;
        const redHeartIndex = hearts.lastIndexOf('❤️');
        
        if (redHeartIndex !== -1) {
            // Create a temporary span for the heart that will be lost
            const heartSpan = document.createElement('span');
            heartSpan.textContent = '❤️';
            heartSpan.className = 'heart-losing';
            
            // Replace the heart with the animated span temporarily
            const beforeHeart = hearts.substring(0, redHeartIndex);
            const afterHeart = hearts.substring(redHeartIndex + 2); // Skip the heart emoji
            
            livesElement.innerHTML = beforeHeart + heartSpan.outerHTML + afterHeart;
            
            // Wait for heart animation to complete
            await new Promise(resolve => setTimeout(resolve, 1200));
        }
    }

    updatePlayerStatusCards() {
        // Regenerate player status cards to show life updates
        this.generatePlayerStatusCards();
    }

    updateGameMessage(message) {
        // Try to update the game message element if it exists
        if (this.gameMessage) {
            this.gameMessage.textContent = message;
        } else {
            // If game message element doesn't exist yet, try to find it
            const gameMessageElement = document.getElementById('gameMessage');
            if (gameMessageElement) {
                this.gameMessage = gameMessageElement;
                this.gameMessage.textContent = message;
            } else {
                // If still not found, log the message to console for debugging
                console.log('Game Message:', message);
            }
        }
    }

    startAnimatedBackground() {
        // Create rockets periodically
        setInterval(() => {
            this.createBackgroundRocket();
        }, 8000 + Math.random() * 12000); // Every 8-20 seconds

        // Create shooting stars periodically  
        setInterval(() => {
            this.createShootingStar();
        }, 3000 + Math.random() * 6000); // Every 3-9 seconds

        // Create planets periodically
        setInterval(() => {
            this.createFloatingPlanet();
        }, 15000 + Math.random() * 20000); // Every 15-35 seconds

        // Create UFOs periodically
        setInterval(() => {
            this.createHoveringUFO();
        }, 12000 + Math.random() * 18000); // Every 12-30 seconds

        // Create space invader aliens periodically
        setInterval(() => {
            this.createBobbingAlien();
        }, 10000 + Math.random() * 15000); // Every 10-25 seconds

        // Create orbiting satellites
        this.createOrbitalSatellite();
        
        // Create another satellite after some time
        setTimeout(() => {
            this.createOrbitalSatellite();
        }, 10000);

        // Add some initial planets
        setTimeout(() => this.createFloatingPlanet(), 2000);
        setTimeout(() => this.createFloatingPlanet(), 8000);
    }

    createBackgroundRocket() {
        const rocket = document.createElement('div');
        rocket.className = 'background-rocket';
        rocket.textContent = '🚀';
        
        // Random size (0.8x to 2.5x)
        const size = 0.8 + Math.random() * 1.7;
        rocket.style.fontSize = `${size}em`;
        
        // Random movement pattern
        const patterns = ['diagonal', 'wave', 'straight', 'curve'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        // Generate random path and rotation
        const path = this.generateRocketPath(pattern);
        const duration = 8 + Math.random() * 10; // 8-18 seconds
        
        // Create unique animation name
        const animationName = `rocket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create dynamic keyframes
        this.createRocketKeyframes(animationName, path);
        
        // Apply animation
        rocket.style.animation = `${animationName} ${duration}s linear forwards`;
        
        // Set initial position and rotation
        rocket.style.left = path.startX + 'px';
        rocket.style.top = path.startY + 'px';
        rocket.style.transform = `rotate(${path.startRotation}deg)`;
        
        document.body.appendChild(rocket);
        
        // Remove after animation completes
        setTimeout(() => {
            rocket.remove();
        }, duration * 1000 + 1000);
    }

    generateRocketPath(pattern) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        switch (pattern) {
            case 'diagonal':
                // Diagonal movement across screen
                const diagonalFromTop = Math.random() < 0.5;
                return {
                    startX: -100,
                    startY: diagonalFromTop ? -100 : screenHeight + 100,
                    endX: screenWidth + 100,
                    endY: diagonalFromTop ? screenHeight + 100 : -100,
                    startRotation: diagonalFromTop ? 45 : -45
                };
                
            case 'wave':
                // Wave pattern across screen
                const waveDirection = Math.random() < 0.5 ? 1 : -1;
                return {
                    startX: -100,
                    startY: screenHeight * 0.3 + Math.random() * screenHeight * 0.4,
                    endX: screenWidth + 100,
                    endY: screenHeight * 0.3 + Math.random() * screenHeight * 0.4,
                    startRotation: 0,
                    pattern: 'wave',
                    waveDirection: waveDirection
                };
                
            case 'straight':
                // Straight horizontal or vertical
                if (Math.random() < 0.7) {
                    // Horizontal
                    return {
                        startX: -100,
                        startY: Math.random() * screenHeight,
                        endX: screenWidth + 100,
                        endY: Math.random() * screenHeight,
                        startRotation: 0
                    };
                } else {
                    // Vertical
                    const upward = Math.random() < 0.5;
                    return {
                        startX: Math.random() * screenWidth,
                        startY: upward ? screenHeight + 100 : -100,
                        endX: Math.random() * screenWidth,
                        endY: upward ? -100 : screenHeight + 100,
                        startRotation: upward ? -90 : 90
                    };
                }
                
            case 'curve':
                // Curved path
                return {
                    startX: -100,
                    startY: Math.random() * screenHeight,
                    endX: screenWidth + 100,
                    endY: Math.random() * screenHeight,
                    startRotation: 0,
                    pattern: 'curve'
                };
        }
    }

    createRocketKeyframes(animationName, path) {
        const style = document.createElement('style');
        let keyframes = `@keyframes ${animationName} {`;
        
        if (path.pattern === 'wave') {
            // Wave pattern keyframes
            keyframes += `
                0% { 
                    left: ${path.startX}px; 
                    top: ${path.startY}px; 
                    transform: rotate(0deg);
                    opacity: 0;
                }
                10% { opacity: 0.6; }
                20% { 
                    left: ${path.startX + (path.endX - path.startX) * 0.2}px; 
                    top: ${path.startY + Math.sin(0.2 * Math.PI * 3) * 100 * path.waveDirection}px; 
                    transform: rotate(${Math.sin(0.2 * Math.PI * 3) * 30}deg);
                }
                40% { 
                    left: ${path.startX + (path.endX - path.startX) * 0.4}px; 
                    top: ${path.startY + Math.sin(0.4 * Math.PI * 3) * 100 * path.waveDirection}px; 
                    transform: rotate(${Math.sin(0.4 * Math.PI * 3) * 30}deg);
                }
                60% { 
                    left: ${path.startX + (path.endX - path.startX) * 0.6}px; 
                    top: ${path.startY + Math.sin(0.6 * Math.PI * 3) * 100 * path.waveDirection}px; 
                    transform: rotate(${Math.sin(0.6 * Math.PI * 3) * 30}deg);
                }
                80% { 
                    left: ${path.startX + (path.endX - path.startX) * 0.8}px; 
                    top: ${path.startY + Math.sin(0.8 * Math.PI * 3) * 100 * path.waveDirection}px; 
                    transform: rotate(${Math.sin(0.8 * Math.PI * 3) * 30}deg);
                }
                90% { opacity: 0.6; }
                100% { 
                    left: ${path.endX}px; 
                    top: ${path.endY}px; 
                    transform: rotate(0deg);
                    opacity: 0;
                }
            `;
        } else if (path.pattern === 'curve') {
            // Curved pattern keyframes
            const midX = (path.startX + path.endX) / 2;
            const midY = Math.min(path.startY, path.endY) - 150;
            keyframes += `
                0% { 
                    left: ${path.startX}px; 
                    top: ${path.startY}px; 
                    transform: rotate(-30deg);
                    opacity: 0;
                }
                10% { opacity: 0.6; }
                50% { 
                    left: ${midX}px; 
                    top: ${midY}px; 
                    transform: rotate(-90deg);
                }
                90% { opacity: 0.6; }
                100% { 
                    left: ${path.endX}px; 
                    top: ${path.endY}px; 
                    transform: rotate(-150deg);
                    opacity: 0;
                }
            `;
        } else {
            // Simple linear movement
            keyframes += `
                0% { 
                    left: ${path.startX}px; 
                    top: ${path.startY}px; 
                    transform: rotate(${path.startRotation}deg);
                    opacity: 0;
                }
                10% { opacity: 0.6; }
                90% { opacity: 0.6; }
                100% { 
                    left: ${path.endX}px; 
                    top: ${path.endY}px; 
                    transform: rotate(${path.startRotation}deg);
                    opacity: 0;
                }
            `;
        }
        
        keyframes += '}';
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        // Clean up the style element after animation
        setTimeout(() => {
            style.remove();
        }, 20000);
    }

    createShootingStar() {
        const star = document.createElement('div');
        star.className = 'background-shooting-star';
        
        // Random starting position on top-left area
        star.style.left = Math.random() * (window.innerWidth * 0.3) + 'px';
        star.style.top = Math.random() * (window.innerHeight * 0.3) + 'px';
        
        document.body.appendChild(star);
        
        // Remove after animation completes
        setTimeout(() => {
            star.remove();
        }, 8000);
    }

    createOrbitalSatellite() {
        const satellite = document.createElement('div');
        satellite.className = 'background-satellite';
        satellite.textContent = '🛰️';
        
        document.body.appendChild(satellite);
        
        // Don't remove satellites - they orbit continuously
    }

    createFloatingPlanet() {
        const planets = ['🪐', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'];
        const planet = document.createElement('div');
        planet.className = 'background-planet';
        planet.textContent = planets[Math.floor(Math.random() * planets.length)];
        
        // Random size (1x to 3x)
        const size = 1 + Math.random() * 2;
        planet.style.fontSize = `${size}em`;
        
        // Random position
        planet.style.left = Math.random() * window.innerWidth + 'px';
        planet.style.top = Math.random() * window.innerHeight + 'px';
        
        // Random duration (25-40 seconds)
        const duration = 25 + Math.random() * 15;
        planet.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(planet);
        
        // Remove after animation cycles (keep for multiple cycles)
        setTimeout(() => {
            planet.remove();
        }, duration * 1000 * 3); // 3 full cycles
    }

    createHoveringUFO() {
        const ufos = ['🛸', '🛸', '👽🛸', '🛸✨'];
        const ufo = document.createElement('div');
        ufo.className = 'background-ufo';
        ufo.textContent = ufos[Math.floor(Math.random() * ufos.length)];
        
        // Random size (1.2x to 2.5x)
        const size = 1.2 + Math.random() * 1.3;
        ufo.style.fontSize = `${size}em`;
        
        // Random starting position
        ufo.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        ufo.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        
        // Random duration (8-15 seconds)
        const duration = 8 + Math.random() * 7;
        ufo.style.animation = `ufoHover ${duration}s ease-in-out forwards`;
        
        document.body.appendChild(ufo);
        
        // Remove after animation completes
        setTimeout(() => {
            ufo.remove();
        }, duration * 1000 + 1000);
    }

    createBobbingAlien() {
        const aliens = ['👾', '👽', '🛸👽', '👾👾', '👽👾'];
        const alien = document.createElement('div');
        alien.className = 'background-alien';
        alien.textContent = aliens[Math.floor(Math.random() * aliens.length)];
        
        // Random size (1x to 2x)
        const size = 1 + Math.random() * 1;
        alien.style.fontSize = `${size}em`;
        
        // Random starting position
        alien.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        alien.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        
        // Random duration (6-12 seconds)
        const duration = 6 + Math.random() * 6;
        alien.style.animation = `alienBob ${duration}s ease-in-out forwards`;
        
        document.body.appendChild(alien);
        
        // Remove after animation completes
        setTimeout(() => {
            alien.remove();
        }, duration * 1000 + 1000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SpaceSnakesAndLadders();
});

// Add some extra space ambiance
function createFloatingStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// Create floating stars when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createFloatingStars, 500);
});
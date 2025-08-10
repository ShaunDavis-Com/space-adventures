export class AudioManager {
    constructor(game) {
        this.game = game;
        this.audioEnabled = true;
        this.backgroundMusic = null;
        this.audioContext = null;

        // NOTE: These are placeholder paths.
        this.musicTracks = [
            'assets/music/space-ambient.mp3',
            'assets/music/cosmic-journey.mp3',
        ];
        this.diceSounds = [
            'assets/sounds/dice-roll1.wav',
            'assets/sounds/dice-roll2.wav',
        ];
        this.goodSounds = ['assets/sounds/power-up.wav'];
        this.badSounds = ['assets/sounds/power-down.wav'];
        this.robotSounds = ['assets/sounds/robot-bleep.wav'];
        this.explosionSounds = ['assets/sounds/explosion.wav'];
        this.winnerSounds = ['assets/sounds/victory.mp3'];
        this.boardSwitcherSound = ['assets/sounds/glitch.wav'];
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 Audio context initialized');
        } catch (error) {
            console.warn('Could not initialize audio context:', error);
            this.audioEnabled = false;
        }
    }

    async playSound(soundFile) {
        if (!this.audioEnabled || !this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (e) {
                console.warn("Audio context resume failed:", e);
                return; // Don't try to play if context can't be resumed
            }
        }
        const audio = new Audio(soundFile);
        audio.play().catch(e => console.warn("Audio play failed:", e));
    }

    playRandomSound(soundArray) {
        if (!soundArray || soundArray.length === 0) return;
        const soundFile = soundArray[Math.floor(Math.random() * soundArray.length)];
        this.playSound(soundFile);
    }

    playDiceSound() { this.playRandomSound(this.diceSounds); }
    playGoodSound() { this.playRandomSound(this.goodSounds); }
    playBadSound() { this.playRandomSound(this.badSounds); }
    playRobotSound() { this.playRandomSound(this.robotSounds); }
    playExplosionSound() { this.playRandomSound(this.explosionSounds); }
    playWinnerSound() { this.playRandomSound(this.winnerSounds); }
    playBoardSwitcherSound() { this.playRandomSound(this.boardSwitcherSound); }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const button = document.getElementById('toggleAudio');
        if (!button) return;

        if (this.audioEnabled) {
            button.textContent = '🔊 Audio: ON';
            button.classList.remove('audio-off');
            if (this.game.gameStarted) {
                this.playBackgroundMusic();
            }
        } else {
            button.textContent = '🔇 Audio: OFF';
            button.classList.add('audio-off');
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        }
    }

    playBackgroundMusic() {
        if (!this.audioEnabled || !this.musicTracks.length || !this.audioContext) return;
        if (this.backgroundMusic && !this.backgroundMusic.paused) return;

        if (this.backgroundMusic) {
            this.backgroundMusic.play().catch(e => console.warn("BG Music play failed:", e));
            return;
        }

        const track = this.musicTracks[Math.floor(Math.random() * this.musicTracks.length)];
        this.backgroundMusic = new Audio(track);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play().catch(e => console.warn("BG Music play failed:", e));
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
}

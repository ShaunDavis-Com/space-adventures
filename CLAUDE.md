# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Space-themed Snakes and Ladders** browser game built with vanilla HTML5, CSS3, and JavaScript. The game features advanced mechanics including randomized special squares, dynamic player knockbacks, visual path lighting, and comprehensive audio systems.

## Core Architecture

### Main Game Class
- **`SpaceSnakesAndLadders`** - Single class containing all game logic, initialized on DOM load
- Game state managed through object properties (players, positions, audio, board state)
- Event-driven architecture with async/await for animations and effects

### Key Game Systems

#### Token Positioning System
- **Critical**: Player tokens use an **overlay positioning system** to ensure proper z-index layering
- Tokens are placed in `#tokenOverlay` (not as children of squares) to appear above all board elements
- Position calculations use `getBoundingClientRect()` relative to the overlay container
- **Never** place tokens as children of squares - this breaks z-index and positioning

#### Special Squares Logic
- **Random generation** each game (12-15 squares, 50/50 good/bad split)
- **New mechanic**: Green squares move forward 1-12 random spaces, red squares move backward 1-12 spaces
- **Path lighting**: Visual feedback shows movement path before animation
- **Recursive handling**: Landing on special squares after movement triggers additional effects

#### Player Collision System
- **Random knockback**: 50/50 chance forward/backward, 1-12 random spaces
- **Chain reactions**: Knocked players can land on others, creating cascades
- **Complete end-position logic**: Handles special squares, wins, and further collisions after knockback

#### Audio System
- **Dual-path audio**: Attempts to load files from `./music/` and `./sounds/` folders
- **Backup synthesis**: Web Audio API creates fallback sounds if files missing
- **Browser compatibility**: Handles autoplay restrictions and suspended audio contexts
- Audio initialized on user interaction (game start)

### File Structure
```
index.html          # Game UI structure with overlay system
script.js           # Single-file game logic (SpaceSnakesAndLadders class)
style.css           # Complete styling with animations and responsive design
music/              # Background music files (optional)
sound effects/      # Organized by type (dice roll/, good/, bad/, robot/, random/)
```

## Game Mechanics Unique to This Implementation

### Board Layout
- **Bottom-to-top display**: Square 1 at bottom, square 100 at top (traditional snakes & ladders)
- **Snake pattern**: Alternating left-right, right-left rows
- **CSS Grid**: 10x10 grid with proper ordering via JavaScript

### Movement Animation
- **Step-by-step movement**: Multi-square moves animate through each intermediate square
- **Overlay-based positioning**: All animations occur within the token overlay
- **Visual effects**: Tokens scale, glow, and bob during movement

### Audio Integration
- **Context resumption**: Handles browser audio policy on user interactions  
- **File detection**: Automatically detects available audio files
- **Fallback sounds**: Synthesized audio using oscillators if no files found

## Development Notes

### When Modifying Token Positioning
- Always use `positionAllTokensOnSquare(squareNumber)` to position tokens
- Never directly manipulate token positions - use the centralized positioning system
- Remember tokens live in `#tokenOverlay`, not in individual squares

### When Adding Game Features
- Special square effects should follow the pattern: trigger → animate → check end position
- All movement should go through `animateMovement()` for consistency
- Use `updateGameMessage()` for user feedback

### Audio System Maintenance
- Audio files should be placed in `./music/` (background) and `./sound effects/` (effects)  
- System automatically handles missing files with synthesized alternatives
- Test audio functionality across different browsers due to autoplay policies

### Critical Dice System Rules
- **NEVER change dice opacity from 0.7**: Both human and bot players must use `this.dice.style.opacity = '0.7'`
- **Changing dice opacity to 1.0 causes severe board flickering and visual glitches**
- **Cursor behavior is handled via CSS hover states**: `.human-turn .dice:hover { cursor: pointer !important; }`
- **Visual consistency is critical**: Any deviation from opacity 0.7 breaks the rendering system
- **Tested solution**: Human/bot dice look identical, cursor changes appropriately on hover
import Game from 'game/core/Game';

const game = new Game();

window.addEventListener('load', () => {
    // Start the game once the page has loaded and DOM elements exist
    game.start();
});


import Scene from 'game/scenes/Scene';

export default class SplashScreen extends Scene {
    constructor(game) {
        super(game);
        this.splashElement = document.getElementById('splash-screen');
        this.startButton = document.getElementById('start-game-btn');
    }

    init() {
        this.splashElement.classList.remove('hidden');
        this.startButton.onclick = () => this.startGame();
    }

    startGame() {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('game');
    }

    destroy() {
        this.startButton.onclick = null;
    }
}


import Scene from 'game/scenes/Scene';

export default class SplashScreen extends Scene {
    constructor(game) {
        super(game);
        this.splashElement = document.getElementById('splash-screen');
        this.startButton = document.getElementById('start-game-btn');
        this.editorButton = document.getElementById('map-editor-btn');
    }

    init() {
        this.splashElement.classList.remove('hidden');
        this.startButton.onclick = () => this.startGame();
        this.editorButton.onclick = () => this.openEditor();
    }

    startGame() {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('game');
    }

    openEditor() {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('editor');
    }

    destroy() {
        this.startButton.onclick = null;
        this.editorButton.onclick = null;
    }
}


import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';
import GameLoop from 'game/core/GameLoop';
import InputManager from 'game/core/InputManager';
import SceneManager from 'game/scenes/SceneManager';
import SplashScreen from 'game/scenes/SplashScreen';
import GameScene from 'game/scenes/GameScene';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;

        this.sceneManager = new SceneManager();
        this.inputManager = new InputManager();
        this.gameLoop = new GameLoop(this.update.bind(this), this.draw.bind(this));
    }

    start() {
        this.sceneManager.addScene('splash', new SplashScreen(this));
        this.sceneManager.addScene('game', new GameScene(this));
        this.sceneManager.changeScene('splash');

        this.gameLoop.start();
    }

    update(deltaTime) {
        this.sceneManager.update(deltaTime);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sceneManager.draw(this.ctx);
    }
}

export default Game;


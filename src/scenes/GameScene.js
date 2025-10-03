import Scene from 'game/scenes/Scene';
import PhysicsSystem from 'game/systems/PhysicsSystem';
import Renderer from 'game/systems/Renderer';
import { createPlayer } from 'game/entities/Player';
import { createPlatform } from 'game/entities/Platform';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';

export default class GameScene extends Scene {
    init() {
        this.physicsSystem = new PhysicsSystem();
        this.renderer = new Renderer();

        const player = createPlayer(100, 100);
        this.addGameObject(player);

        const ground = createPlatform(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20);
        const platform1 = createPlatform(300, 450, 150, 20);
        const platform2 = createPlatform(500, 350, 100, 20);

        this.addGameObject(ground);
        this.addGameObject(platform1);
        this.addGameObject(platform2);
    }

    update(deltaTime) {
        super.update(deltaTime); // Updates all game objects
        this.physicsSystem.update(this.gameObjects, deltaTime);
    }

    draw(ctx) {
        ctx.fillStyle = '#1e1e2e';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.draw(this.gameObjects, ctx);
    }
}


import Scene from 'game/scenes/Scene';
import PhysicsSystem from 'game/systems/PhysicsSystem';
import Renderer from 'game/systems/Renderer';
import { createPlayer } from 'game/entities/Player';
import { createPlatform } from 'game/entities/Platform';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';

export default class GameScene extends Scene {
    init(params = {}) {
        this.physicsSystem = new PhysicsSystem();
        this.renderer = new Renderer();
        this.level = params.level || null;

        const player = createPlayer(100, 100);
        this.addGameObject(player);
        if (this.level?.settings?.gravity != null) {
            const phys = player.getComponent('Physics');
            if (phys) phys.gravity = this.level.settings.gravity;
        }

        if (this.level && Array.isArray(this.level.entities)) {
            this.level.entities
                .filter(e => e.type === 'platform')
                .forEach(e => this.addGameObject(createPlatform(e.x, e.y, e.width, e.height)));
        } else {
            const ground = createPlatform(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20);
            const platform1 = createPlatform(300, 450, 150, 20);
            const platform2 = createPlatform(500, 350, 100, 20);
            this.addGameObject(ground);
            this.addGameObject(platform1);
            this.addGameObject(platform2);
        }
    }

    update(deltaTime) {
        super.update(deltaTime); // Updates all game objects
        this.physicsSystem.update(this.gameObjects, deltaTime);
    }

    draw(ctx) {
        const bg = this.level?.settings?.backgroundColor || '#1e1e2e';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.draw(this.gameObjects, ctx);
    }
}
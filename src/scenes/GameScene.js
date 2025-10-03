import Scene from './Scene.js';
import PhysicsSystem from '../systems/PhysicsSystem.js';
import Renderer from '../systems/Renderer.js';
import { createPlayer } from '../entities/Player.js';
import { createPlatform } from '../entities/Platform.js';
import { createFire } from '../entities/Fire.js';
import { createFuelCan } from '../entities/FuelCan.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/constants.js';
import EditorScene from './EditorScene.js';
import InGameMenu from '../ui/InGameMenu.js';

export default class GameScene extends Scene {
    init(params = {}) {
        this.physicsSystem = new PhysicsSystem();
        this.renderer = new Renderer();
        this.level = params.level || null;
        this.menu = new InGameMenu(this.game, document.getElementById('menu-button'));
        this.menu.showButton();

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

        // Add some fuel cans for pyromania gameplay
        const fuel1 = createFuelCan(200, 400);
        const fuel2 = createFuelCan(600, 300);
        this.addGameObject(fuel1);
        this.addGameObject(fuel2);
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

    destroy() {
        if (this.menu) this.menu.destroy();
        super.destroy();
    }
}
import Scene from './Scene.js';
import PhysicsSystem from '../systems/PhysicsSystem.js';
import Renderer from '../systems/Renderer.js';
import ParticleSystem from '../systems/ParticleSystem.js';
import { createPlayer } from '../entities/Player.js';
import { createPlatform } from '../entities/Platform.js';
import { createRamp } from '../entities/Ramp.js';
import { createExitDoor } from '../entities/ExitDoor.js';
import { createEnemySpawner } from '../entities/EnemySpawner.js';
import { createParticleEmitterObject } from '../entities/ParticleEmitterObject.js';
import { createFire } from '../entities/Fire.js';
import { createFuelCan } from '../entities/FuelCan.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/constants.js';
import InGameMenu from '../ui/InGameMenu.js';
import CharacterDisplay from '../ui/CharacterDisplay.js';
import GasolineMeter from '../ui/GasolineMeter.js';
import Camera from '../core/Camera.js';
import Minimap from 'game/ui/Minimap';
import EndScreen from '../ui/EndScreen.js';

export default class GameScene extends Scene {
    init(params = {}) {
        this.physicsSystem = new PhysicsSystem();
        this.renderer = new Renderer();
        this.particleSystem = new ParticleSystem();
        this.level = params.level || null;

        const worldWidth = this.level?.settings?.width || SCREEN_WIDTH;
        const worldHeight = this.level?.settings?.height || SCREEN_HEIGHT;
        this.camera = new Camera(worldWidth, worldHeight);

        const uiContainer = document.getElementById('game-ui');
        this.menu = new InGameMenu(this.game, document.getElementById('menu-button'));
        this.menu.showButton();
        this.endScreen = new EndScreen(this);
        this.ended = false;

        // Determine player start position from level data
        const playerStart = this.level?.entities?.find(e => e.type === 'player_start');
        const startX = playerStart ? playerStart.x : 100;
        const startY = playerStart ? playerStart.y : 100;

        const player = createPlayer(startX, startY);
        this.addGameObject(player);
        this.camera.setTarget(player);

        const characterController = player.getComponent('CharacterController');
        this.characterDisplay = new CharacterDisplay(characterController);
        this.characterDisplay.init(uiContainer);

        const fuelController = player.getComponent('FuelController');
        this.gasolineMeter = new GasolineMeter(fuelController);
        this.gasolineMeter.init(uiContainer);
        
        // Minimap
        this.minimap = new Minimap(uiContainer, worldWidth, worldHeight);
        this.minimap.init();
        this.playerRef = player;

        if (this.level?.settings?.gravity != null) {
            const phys = player.getComponent('Physics');
            if (phys) phys.gravity = this.level.settings.gravity;
        }

        if (this.level && Array.isArray(this.level.entities)) {
            this.level.entities.forEach(e => {
                switch (e.type) {
                    case 'platform': {
                        const platform = createPlatform(e.x, e.y, e.width, e.height);
                        if (e.killsPlayer) {
                            platform.killsPlayer = true;
                            // Make deadly platforms visually distinct
                            const renderer = platform.getComponent('SpriteRenderer');
                            if(renderer) renderer.color = '#ff4747';
                        }
                        this.addGameObject(platform);
                        break;
                    }
                    case 'ramp': {
                        const ramp = createRamp(e.x, e.y, e.width, e.height, e.angle);
                        this.addGameObject(ramp);
                        break;
                    }
                    case 'fuel':
                        this.addGameObject(createFuelCan(e.x, e.y));
                        break;
                    case 'exit_door':
                        this.addGameObject(createExitDoor(e.x, e.y, e.width, e.height));
                        break;
                    case 'enemy_spawner':
                        this.addGameObject(createEnemySpawner(this, e.x, e.y, e.enemyType, e.spawnInterval));
                        break;
                    case 'particle_emitter':
                        this.addGameObject(createParticleEmitterObject(e.x, e.y, e));
                        break;
                }
            });
        } else {
            // Default level if none is loaded
            const ground = createPlatform(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20);
            const platform1 = createPlatform(300, 450, 150, 20);
            const platform2 = createPlatform(500, 350, 100, 20);
            this.addGameObject(ground);
            this.addGameObject(platform1);
            this.addGameObject(platform2);
            // Add some fuel cans for pyromania gameplay
            const fuel1 = createFuelCan(200, 400);
            const fuel2 = createFuelCan(600, 300);
            this.addGameObject(fuel1);
            this.addGameObject(fuel2);
        }
    }

    update(deltaTime) {
        super.update(deltaTime); // Updates all game objects
        this.physicsSystem.update(this.gameObjects, deltaTime);
        this.particleSystem.update(deltaTime, this.gameObjects);
        this.camera.update(deltaTime);
        // Instant death if player leaves map bounds
        if (!this.ended && this.playerRef?.transform) {
            const t = this.playerRef.transform;
            const w = this.camera.worldBounds.x, h = this.camera.worldBounds.y;
            const leniency = 20; // one cell margin before instant death
            if (t.position.x < -leniency ||
                t.position.y < -leniency ||
                (t.position.x + t.size.x) > (w + leniency) ||
                (t.position.y + t.size.y) > (h + leniency)) {
                this.onPlayerDeath();
            }
        }
        // Update minimap render
        const playerColor = this.playerRef?.getComponent('SpriteRenderer')?.color || '#ffffff';
        this.minimap?.render(this.gameObjects, playerColor);
    }

    draw(ctx) {
        ctx.save();
        
        const bg = this.level?.settings?.backgroundColor || '#1e1e2e';
        ctx.fillStyle = bg;
        ctx.fillRect(this.camera.position.x, this.camera.position.y, SCREEN_WIDTH, SCREEN_HEIGHT);
        
        this.camera.applyTransform(ctx);

        this.renderer.draw(this.gameObjects, ctx);
        this.particleSystem.draw(ctx);

        ctx.restore();
    }

    destroy() {
        if (this.menu) this.menu.destroy();
        if (this.characterDisplay) this.characterDisplay.destroy();
        if (this.gasolineMeter) this.gasolineMeter.destroy();
        if (this.minimap) this.minimap.destroy();
        this.endScreen?.close();
        super.destroy();
    }

    onPlayerDeath() {
        if (this.ended) return;
        this.ended = true;
        this.menu?.hideButton();
        this.endScreen.open('dead');
    }

    onLevelComplete() {
        if (this.ended) return;
        this.ended = true;
        this.menu?.hideButton();
        this.endScreen.open('win');
    }

    retryLevel() {
        const lvl = this.level ? { level: this.level } : {};
        this.game.sceneManager.changeScene('game', lvl);
    }

    returnToMenu() {
        this.game.sceneManager.changeScene('splash');
    }
}
import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import { createEnemy } from './Enemy.js';

class SpawnerController {
    constructor(scene, enemyType, interval) {
        this.scene = scene;
        this.enemyType = enemyType;
        this.interval = interval;
        this.timer = this.interval;
    }

    update(deltaTime) {
        this.timer -= deltaTime;
        if (this.timer <= 0) {
            this.spawn();
            this.timer = this.interval;
        }
    }

    spawn() {
        const { x, y } = this.gameObject.transform.position;
        // Logic to spawn different enemy types can go here
        const enemy = createEnemy(x, y);
        this.scene.addGameObject(enemy);
        console.log(`Spawned ${this.enemyType} at ${x}, ${y}`);
    }
}

export function createEnemySpawner(scene, x, y, enemyType = 'basic', interval = 5) {
    const spawner = new GameObject('EnemySpawner');
    spawner.addComponent(new Transform(x, y, 32, 32));
    spawner.addComponent(new SpawnerController(scene, enemyType, interval));

    // Spawners are invisible in-game
    // spawner.addComponent(new SpriteRenderer('#ff00ff'));

    return spawner;
}
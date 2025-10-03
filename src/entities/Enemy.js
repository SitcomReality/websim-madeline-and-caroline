import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import Physics from 'game/ecs/components/Physics';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';
import { GRAVITY } from 'game/config/constants';

class EnemyController {
    constructor() {
        this.speed = 50;
        this.direction = 1;
        this.moveTimer = 2;
    }

    update(deltaTime) {
        const physics = this.gameObject.getComponent('Physics');
        physics.velocity.x = this.speed * this.direction;

        this.moveTimer -= deltaTime;
        if (this.moveTimer <= 0) {
            this.direction *= -1;
            this.moveTimer = 2 + Math.random() * 2;
        }
    }
}

export function createEnemy(x, y) {
    const enemy = new GameObject('Enemy');
    enemy.addComponent(new Transform(x, y, 32, 32));
    
    const physics = new Physics();
    physics.gravity = GRAVITY;
    enemy.addComponent(physics);

    enemy.addComponent(new SpriteRenderer('#ff00ff'));
    enemy.addComponent(new EnemyController());

    return enemy;
}


import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import Physics from 'game/ecs/components/Physics';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';
import PlayerController from 'game/ecs/components/PlayerController';
import { GRAVITY } from 'game/config/constants';

export function createPlayer(x, y) {
    const player = new GameObject('Player');

    player.addComponent(new Transform(x, y, 32, 32));
    
    const physics = new Physics();
    physics.gravity = GRAVITY;
    player.addComponent(physics);

    player.addComponent(new SpriteRenderer('#ff47ab'));
    player.addComponent(new PlayerController());

    return player;
}


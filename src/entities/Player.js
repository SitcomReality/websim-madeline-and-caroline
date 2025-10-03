import GameObject from './GameObject.js';
import Transform from '../ecs/components/Transform.js';
import Physics from '../ecs/components/Physics.js';
import SpriteRenderer from '../ecs/components/SpriteRenderer.js';
import PlayerController from '../ecs/components/PlayerController.js';
import { GRAVITY, FIRE_DAMAGE } from '../config/constants.js';

export function createPlayer(x, y) {
    const player = new GameObject('Player');

    player.addComponent(new Transform(x, y, 32, 32));
    
    const physics = new Physics();
    physics.gravity = GRAVITY;
    player.addComponent(physics);

    player.addComponent(new SpriteRenderer('#ff47ab'));
    player.addComponent(new PlayerController());
    
    // Add fire immunity for pyromania gameplay
    const phys = player.getComponent('Physics');
    if (phys) {
        phys.fireImmune = false;
        phys.fireImmunityTimer = 0;
    }
    
    return player;
}
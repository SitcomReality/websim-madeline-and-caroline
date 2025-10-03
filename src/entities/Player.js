import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import Physics from 'game/ecs/components/Physics';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';
import PlayerController from 'game/ecs/components/PlayerController';
import CharacterController from 'game/ecs/components/CharacterController';
import FuelController from 'game/ecs/components/player/FuelController';
import { GRAVITY, FIRE_DAMAGE } from 'game/config/constants';

export function createPlayer(x, y) {
    const player = new GameObject('Player');

    player.addComponent(new Transform(x, y, 32, 32));
    
    const physics = new Physics();
    physics.gravity = GRAVITY;
    player.addComponent(physics);

    player.addComponent(new SpriteRenderer('#ff47ab')); // Default color
    player.addComponent(new PlayerController());
    player.addComponent(new CharacterController());
    player.addComponent(new FuelController());
    
    // Add fire immunity for pyromania gameplay
    const phys = player.getComponent('Physics');
    if (phys) {
        phys.fireImmune = false;
        phys.fireImmunityTimer = 0;
    }
    
    return player;
}
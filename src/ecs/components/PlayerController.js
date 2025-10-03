import Component from 'game/ecs/components/Component';
import InputManager from 'game/core/InputManager';
import { PLAYER_SPEED, PLAYER_JUMP_FORCE } from 'game/config/constants';

export default class PlayerController extends Component {
    update(deltaTime) {
        const physics = this.gameObject.getComponent('Physics');
        if (!physics) return;

        physics.velocity.x = 0;
        
        if (InputManager.isKeyPressed('KeyA') || InputManager.isKeyPressed('ArrowLeft')) {
            physics.velocity.x = -PLAYER_SPEED;
        }
        if (InputManager.isKeyPressed('KeyD') || InputManager.isKeyPressed('ArrowRight')) {
            physics.velocity.x = PLAYER_SPEED;
        }

        if ((InputManager.isKeyPressed('Space') || InputManager.isKeyPressed('ArrowUp')) && physics.onGround) {
            physics.velocity.y = -PLAYER_JUMP_FORCE;
            physics.onGround = false;
        }
    }
}


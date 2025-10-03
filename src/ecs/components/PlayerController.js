import Component from 'game/ecs/components/Component';
import InputManager from 'game/core/InputManager';
import { PLAYER_SPEED, PLAYER_JUMP_FORCE } from 'game/config/constants';

export default class PlayerController extends Component {
    constructor() {
        super();
        this.hasLighter = true; // Player starts with lighter
        this.canIgnite = true;
    }
    
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

        // Pyromania controls
        if (InputManager.isKeyPressed('KeyF') && this.canIgnite) {
            this.ignite();
        }
        
        if (InputManager.isKeyPressed('KeyG')) {
            this.dropFuel();
        }
    }
    
    ignite() {
        const transform = this.gameObject.transform;
        if (!transform || !this.hasLighter) return;
        
        // Create fire at player position
        const fire = createFire(
            transform.position.x + transform.size.x / 2,
            transform.position.y + transform.size.y
        );
        this.gameObject.scene?.addGameObject(fire);
        this.canIgnite = false;
        setTimeout(() => this.canIgnite = true, 500); // Cooldown
    }
    
    dropFuel() {
        const transform = this.gameObject.transform;
        if (!transform) return;
        
        const fuelCan = createFuelCan(
            transform.position.x,
            transform.position.y + transform.size.y + 10
        );
        this.gameObject.scene?.addGameObject(fuelCan);
    }
}
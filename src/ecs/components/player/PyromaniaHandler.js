import InputManager from '../../core/InputManager.js';
import { createFire } from '../../entities/Fire.js';
import { createFuelCan } from '../../entities/FuelCan.js';

export default class PyromaniaHandler {
    constructor(playerController) {
        this.playerController = playerController;
    }
    
    update(deltaTime) {
        // Pyromania controls
        if (InputManager.isKeyPressed('KeyF') && this.playerController.canIgnite) {
            this.ignite();
        }
        
        if (InputManager.isKeyPressed('KeyG')) {
            this.dropFuel();
        }
    }
    
    ignite() {
        const transform = this.playerController.gameObject.transform;
        if (!transform || !this.playerController.hasLighter) return;
        
        const fire = createFire(
            transform.position.x + transform.size.x / 2,
            transform.position.y + transform.size.y
        );
        this.playerController.gameObject.scene?.addGameObject(fire);
        this.playerController.canIgnite = false;
        setTimeout(() => this.playerController.canIgnite = true, 500);
    }
    
    dropFuel() {
        const transform = this.playerController.gameObject.transform;
        if (!transform) return;
        
        const fuelCan = createFuelCan(
            transform.position.x,
            transform.position.y + transform.size.y + 10
        );
        this.playerController.gameObject.scene?.addGameObject(fuelCan);
    }
}


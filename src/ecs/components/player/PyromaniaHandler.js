import InputManager from '../../../core/InputManager.js';
import { createFire } from '../../../entities/Fire.js';
import { createFuelCan } from '../../../entities/FuelCan.js';
import { FUEL_SPRAY_RATE } from '../../../config/constants.js';

export default class PyromaniaHandler {
    constructor(playerController) {
        this.playerController = playerController;
        this.lastSprayTime = 0;
    }
    
    update(deltaTime) {
        // Pyromania controls
        if (InputManager.isKeyPressed('KeyF') && this.playerController.canIgnite) {
            this.ignite();
        }
        
        if (InputManager.isKeyPressed('KeyG')) {
            this.dropFuel();
        }

        // Gasoline spray
        if (InputManager.isKeyPressed('ShiftLeft') || InputManager.isKeyPressed('ShiftRight')) {
            this.sprayGasoline(deltaTime);
        }
    }
    
    sprayGasoline(deltaTime) {
        const fuelController = this.playerController.fuelController;
        if (!fuelController || !fuelController.hasFuel()) return;

        const fuelUsed = FUEL_SPRAY_RATE * deltaTime;
        if (fuelController.useFuel(fuelUsed)) {
            const particleSystem = this.playerController.gameObject.scene?.particleSystem;
            if (particleSystem) {
                const transform = this.playerController.gameObject.transform;
                const physics = this.playerController.gameObject.getComponent('Physics');
                
                // Determine direction
                let dir = 1;
                if (Math.abs(physics.velocity.x) > 1) {
                    dir = Math.sign(physics.velocity.x);
                } else {
                    dir = transform.lastDirection || 1;
                }
                
                particleSystem.emit('gasoline_spray', {
                    x: transform.position.x + (dir > 0 ? transform.size.x : 0),
                    y: transform.position.y + transform.size.y / 2,
                    angle: { min: dir > 0 ? -15 : 165, max: dir > 0 ? 15 : 195 },
                });
            }
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
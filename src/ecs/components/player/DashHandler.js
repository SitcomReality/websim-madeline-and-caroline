import InputManager from '../../core/InputManager.js';
import { GRAVITY } from '../../config/constants.js';

export default class DashHandler {
    constructor(playerController) {
        this.playerController = playerController;
    }

    updateDashing(deltaTime, physics) {
        const MOVEMENT = this.playerController.characterController.getMovementStats();
        this.playerController.movementState.dashTimer += deltaTime;

        if (this.playerController.movementState.dashTimer >= MOVEMENT.DASH_DURATION) {
            this.playerController.movementState.isDashing = false;
            this.playerController.movementState.dashCooldownTimer = MOVEMENT.DASH_COOLDOWN;
            physics.gravity = GRAVITY;
        } else {
            // Maintain dash velocity
            physics.velocity.x = this.playerController.movementState.dashDirection.x * MOVEMENT.DASH_SPEED;
            physics.velocity.y = this.playerController.movementState.dashDirection.y * MOVEMENT.DASH_SPEED;

            // No gravity during dash
            physics.gravity = 0;
        }
    }

    dash(dirX, dirY) {
        if (!this.playerController.movementState || !this.playerController.movementState.canDash()) return;

        const physics = this.playerController.gameObject.getComponent('Physics');
        if (!physics) return;

        const MOVEMENT = this.playerController.characterController.getMovementStats();

        // Normalize direction
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        if (magnitude === 0) return;

        const normalizedDir = {
            x: dirX / magnitude,
            y: dirY / magnitude
        };

        this.playerController.movementState.startDash(normalizedDir);
        this.playerController.movementState.dashTimer = 0;

        // Emit dash particles
        const particleSystem = this.playerController.gameObject.scene?.particleSystem;
        const particleConfig = this.playerController.characterController.getParticleConfig();
        if (particleSystem && particleConfig.dash) {
            const transform = this.playerController.gameObject.transform;
            const angle = Math.atan2(dirY, dirX) * 180 / Math.PI;
            particleSystem.emit(particleConfig.dash, {
                x: transform.position.x + transform.size.x / 2,
                y: transform.position.y + transform.size.y / 2,
                angle: { min: angle + 170, max: angle + 190 }
            });
        }
    }
}
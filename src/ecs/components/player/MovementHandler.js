import InputManager from '../../core/InputManager.js';
import { GRAVITY } from '../../config/constants.js';

export default class MovementHandler {
    constructor(playerController) {
        this.playerController = playerController;
    }

    updateNormalMovement(deltaTime, physics) {
        // Reset acceleration each frame
        physics.acceleration.set(0, 0);

        const MOVEMENT = this.playerController.characterController.getMovementStats();

        // Check if sliding
        const isPressingDown = InputManager.isKeyPressed('KeyS') || InputManager.isKeyPressed('ArrowDown');
        this.playerController.movementState.isSliding = isPressingDown && physics.onGround && Math.abs(physics.velocity.x) > MOVEMENT.SLIDE_MIN_SPEED;

        // Horizontal movement
        const acceleration = physics.onGround ? MOVEMENT.GROUND_ACCELERATION : MOVEMENT.AIR_ACCELERATION;
        const maxSpeed = physics.onGround ? MOVEMENT.GROUND_MAX_SPEED : MOVEMENT.AIR_MAX_SPEED;

        let horizontalInput = 0;
        if (InputManager.isKeyPressed('KeyA') || InputManager.isKeyPressed('ArrowLeft')) {
            horizontalInput = -1;
        }
        if (InputManager.isKeyPressed('KeyD') || InputManager.isKeyPressed('ArrowRight')) {
            horizontalInput = 1;
        }

        // Don't allow input during slide unless changing direction
        if (this.playerController.movementState.isSliding) {
            if (horizontalInput !== 0 && Math.sign(horizontalInput) !== Math.sign(physics.velocity.x)) {
                // Allow direction change during slide
                physics.applyAcceleration(horizontalInput * acceleration, 0);
            }
        } else if (horizontalInput !== 0) {
            physics.applyAcceleration(horizontalInput * acceleration, 0);
        }

        // Apply velocity from acceleration
        physics.velocity.x += physics.acceleration.x * deltaTime;

        // Apply friction
        if (physics.onGround) {
            const friction = this.playerController.movementState.isSliding
                ? MOVEMENT.GROUND_FRICTION * MOVEMENT.SLIDE_FRICTION_MULTIPLIER
                : MOVEMENT.GROUND_FRICTION;
            physics.applyFriction(friction, deltaTime);
        } else {
            physics.applyFriction(MOVEMENT.AIR_RESISTANCE, deltaTime);
        }

        // Clamp horizontal speed
        if (Math.abs(physics.velocity.x) > maxSpeed) {
            physics.velocity.x = Math.sign(physics.velocity.x) * maxSpeed;
        }

        // Jump
        const jumpPressed = InputManager.isKeyPressed('Space') || InputManager.isKeyPressed('ArrowUp');

        if (jumpPressed && physics.onGround && !this.playerController.movementState.isJumping) {
            physics.velocity.y = -MOVEMENT.JUMP_FORCE;
            physics.onGround = false;
            this.playerController.movementState.isJumping = true;
            this.playerController.movementState.jumpHoldTimer = MOVEMENT.MAX_JUMP_HOLD_TIME;
            this.playerController.movementState.setState(MOVEMENT_STATES.JUMPING);

            // Emit jump particles
            this.emitJumpParticles();
        }

        // Variable jump height
        if (this.playerController.movementState.isJumping && jumpPressed && this.playerController.movementState.jumpHoldTimer > 0) {
            // Reduce gravity while holding jump
            physics.gravity = GRAVITY * MOVEMENT.JUMP_HOLD_GRAVITY_MULTIPLIER;
        } else {
            if (this.playerController.movementState.isJumping && !jumpPressed) {
                // Released jump early, increase gravity for faster fall
                physics.gravity = GRAVITY * MOVEMENT.JUMP_RELEASE_GRAVITY_MULTIPLIER;
                this.playerController.movementState.isJumping = false;
            } else {
                physics.gravity = GRAVITY;
            }
        }

        // Update state based on conditions
        if (!this.playerController.movementState.isDashing) {
            if (!physics.onGround) {
                if (physics.velocity.y < 0) {
                    this.playerController.movementState.setState(MOVEMENT_STATES.JUMPING);
                } else {
                    this.playerController.movementState.setState(MOVEMENT_STATES.FALLING);
                }
            } else if (this.playerController.movementState.isSliding) {
                this.playerController.movementState.setState(MOVEMENT_STATES.SLIDING);
            } else if (Math.abs(physics.velocity.x) > 10) {
                this.playerController.movementState.setState(MOVEMENT_STATES.RUNNING);
            } else {
                this.playerController.movementState.setState(MOVEMENT_STATES.IDLE);
            }
        }

        // Reset jump flag when landing
        if (physics.onGround && this.playerController.movementState.previousState !== MOVEMENT_STATES.IDLE && this.playerController.movementState.previousState !== MOVEMENT_STATES.RUNNING) {
            this.playerController.movementState.isJumping = false;
        }
    }

    emitJumpParticles() {
        const particleSystem = this.playerController.gameObject.scene?.particleSystem;
        if (!particleSystem) return;

        const transform = this.playerController.gameObject.transform;
        const x = transform.position.x + transform.size.x / 2;
        const y = transform.position.y + transform.size.y;

        particleSystem.emit('jump_dust', {
            x: x,
            y: y,
        });
    }
}
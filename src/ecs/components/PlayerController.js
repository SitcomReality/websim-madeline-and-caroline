import Component from './Component.js';
import InputManager from '../../core/InputManager.js';
import InputBuffer from '../../systems/InputBuffer.js';
import MovementState, { MOVEMENT_STATES } from './MovementState.js';
import { MOVEMENT } from '../../config/movementConstants.js';
import { GRAVITY } from '../../config/constants.js';
import { createFire } from '../../entities/Fire.js';
import { createFuelCan } from '../../entities/FuelCan.js';

export default class PlayerController extends Component {
    constructor() {
        super();
        this.hasLighter = true;
        this.canIgnite = true;
        this.movementState = null;
    }
    
    init() {
        // Add MovementState component if not present
        if (!this.gameObject.getComponent('MovementState')) {
            this.movementState = new MovementState();
            this.gameObject.addComponent(this.movementState);
        } else {
            this.movementState = this.gameObject.getComponent('MovementState');
        }
        
        // Register double-tap callbacks
        InputBuffer.registerDoubleTap('KeyA', () => this.dash(-1, 0));
        InputBuffer.registerDoubleTap('ArrowLeft', () => this.dash(-1, 0));
        InputBuffer.registerDoubleTap('KeyD', () => this.dash(1, 0));
        InputBuffer.registerDoubleTap('ArrowRight', () => this.dash(1, 0));
        InputBuffer.registerDoubleTap('KeyW', () => this.dash(0, -1));
        InputBuffer.registerDoubleTap('ArrowUp', () => this.dash(0, -1));
        InputBuffer.registerDoubleTap('KeyS', () => this.dash(0, 1));
        InputBuffer.registerDoubleTap('ArrowDown', () => this.dash(0, 1));
    }
    
    update(deltaTime) {
        const physics = this.gameObject.getComponent('Physics');
        if (!physics) return;
        
        if (!this.movementState) {
            this.init();
        }
        
        this.movementState.update(deltaTime);
        InputBuffer.update();
        
        // Handle different movement states
        if (this.movementState.isDashing) {
            this.updateDashing(deltaTime, physics);
        } else {
            this.updateNormalMovement(deltaTime, physics);
        }
        
        // Pyromania controls
        if (InputManager.isKeyPressed('KeyF') && this.canIgnite) {
            this.ignite();
        }
        
        if (InputManager.isKeyPressed('KeyG')) {
            this.dropFuel();
        }
    }
    
    updateNormalMovement(deltaTime, physics) {
        // Reset acceleration each frame
        physics.acceleration.set(0, 0);
        
        // Check if sliding
        const isPressingDown = InputManager.isKeyPressed('KeyS') || InputManager.isKeyPressed('ArrowDown');
        this.movementState.isSliding = isPressingDown && physics.onGround && Math.abs(physics.velocity.x) > MOVEMENT.SLIDE_MIN_SPEED;
        
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
        if (this.movementState.isSliding) {
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
            const friction = this.movementState.isSliding 
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
        
        if (jumpPressed && physics.onGround && !this.movementState.isJumping) {
            physics.velocity.y = -MOVEMENT.JUMP_FORCE;
            physics.onGround = false;
            this.movementState.isJumping = true;
            this.movementState.jumpHoldTimer = MOVEMENT.MAX_JUMP_HOLD_TIME;
            this.movementState.setState(MOVEMENT_STATES.JUMPING);
        }
        
        // Variable jump height
        if (this.movementState.isJumping && jumpPressed && this.movementState.jumpHoldTimer > 0) {
            // Reduce gravity while holding jump
            physics.gravity = GRAVITY * MOVEMENT.JUMP_HOLD_GRAVITY_MULTIPLIER;
        } else {
            if (this.movementState.isJumping && !jumpPressed) {
                // Released jump early, increase gravity for faster fall
                physics.gravity = GRAVITY * MOVEMENT.JUMP_RELEASE_GRAVITY_MULTIPLIER;
                this.movementState.isJumping = false;
            } else {
                physics.gravity = GRAVITY;
            }
        }
        
        // Update state based on conditions
        if (!this.movementState.isDashing) {
            if (!physics.onGround) {
                if (physics.velocity.y < 0) {
                    this.movementState.setState(MOVEMENT_STATES.JUMPING);
                } else {
                    this.movementState.setState(MOVEMENT_STATES.FALLING);
                }
            } else if (this.movementState.isSliding) {
                this.movementState.setState(MOVEMENT_STATES.SLIDING);
            } else if (Math.abs(physics.velocity.x) > 10) {
                this.movementState.setState(MOVEMENT_STATES.RUNNING);
            } else {
                this.movementState.setState(MOVEMENT_STATES.IDLE);
            }
        }
        
        // Reset jump flag when landing
        if (physics.onGround && this.movementState.previousState !== MOVEMENT_STATES.IDLE && this.movementState.previousState !== MOVEMENT_STATES.RUNNING) {
            this.movementState.isJumping = false;
        }
    }
    
    updateDashing(deltaTime, physics) {
        this.movementState.dashTimer += deltaTime;
        
        if (this.movementState.dashTimer >= MOVEMENT.DASH_DURATION) {
            this.movementState.isDashing = false;
            this.movementState.dashCooldownTimer = MOVEMENT.DASH_COOLDOWN;
            physics.gravity = GRAVITY;
        } else {
            // Maintain dash velocity
            physics.velocity.x = this.movementState.dashDirection.x * MOVEMENT.DASH_SPEED;
            physics.velocity.y = this.movementState.dashDirection.y * MOVEMENT.DASH_SPEED;
            
            // No gravity during dash
            physics.gravity = 0;
        }
    }
    
    dash(dirX, dirY) {
        if (!this.movementState || !this.movementState.canDash()) return;
        
        const physics = this.gameObject.getComponent('Physics');
        if (!physics) return;
        
        // Normalize direction
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        if (magnitude === 0) return;
        
        const normalizedDir = {
            x: dirX / magnitude,
            y: dirY / magnitude
        };
        
        this.movementState.startDash(normalizedDir);
        this.movementState.dashTimer = 0;
    }
    
    ignite() {
        const transform = this.gameObject.transform;
        if (!transform || !this.hasLighter) return;
        
        const fire = createFire(
            transform.position.x + transform.size.x / 2,
            transform.position.y + transform.size.y
        );
        this.gameObject.scene?.addGameObject(fire);
        this.canIgnite = false;
        setTimeout(() => this.canIgnite = true, 500);
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
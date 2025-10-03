import Component from './Component.js';
import InputManager from '../../core/InputManager.js';
import InputBuffer from '../../systems/InputBuffer.js';
import MovementState, { MOVEMENT_STATES } from './MovementState.js';
import MovementHandler from './player/MovementHandler.js';
import DashHandler from './player/DashHandler.js';
import PyromaniaHandler from './player/PyromaniaHandler.js';
import { GRAVITY } from '../../config/constants.js';

export default class PlayerController extends Component {
    constructor() {
        super();
        this.hasLighter = true;
        this.canIgnite = true;
        this.movementState = null;
        this.characterController = null;
        this.fuelController = null;
        
        // Handlers
        this.movementHandler = null;
        this.dashHandler = null;
        this.pyromaniaHandler = null;
    }
    
    init() {
        // Get other components - ensure they exist
        this.movementState = this.gameObject.getComponent('MovementState');
        if (!this.movementState) {
            this.movementState = new MovementState();
            this.gameObject.addComponent(this.movementState);
        }
        
        this.characterController = this.gameObject.getComponent('CharacterController');
        this.fuelController = this.gameObject.getComponent('FuelController');
        
        // Initialize handlers
        this.movementHandler = new MovementHandler(this);
        this.dashHandler = new DashHandler(this);
        this.pyromaniaHandler = new PyromaniaHandler(this);
        
        // Register double-tap callbacks
        InputBuffer.registerDoubleTap('KeyA', () => this.dash(-1, 0));
        InputBuffer.registerDoubleTap('ArrowLeft', () => this.dash(-1, 0));
        InputBuffer.registerDoubleTap('KeyD', () => this.dash(1, 0));
        InputBuffer.registerDoubleTap('ArrowRight', () => this.dash(1, 0));
        InputBuffer.registerDoubleTap('KeyW', () => this.dash(0, -1));
        InputBuffer.registerDoubleTap('ArrowUp', () => this.dash(0, 1));
        InputBuffer.registerDoubleTap('KeyS', () => this.dash(0, 1));
        InputBuffer.registerDoubleTap('ArrowDown', () => this.dash(0, 1));
    }
    
    update(deltaTime) {
        const physics = this.gameObject.getComponent('Physics');
        if (!physics) return;
        
        // Ensure components are initialized
        if (!this.movementState || !this.characterController || !this.fuelController) {
            this.init();
        }
        
        this.movementState.update(deltaTime);
        InputBuffer.update();
        
        // Handle different movement states
        if (this.movementState && this.movementState.isDashing) {
            this.dashHandler.updateDashing(deltaTime, physics);
        } else {
            this.movementHandler.updateNormalMovement(deltaTime, physics);
        }
        
        // Pyromania controls
        this.pyromaniaHandler.update(deltaTime);
        
        this.handleCollisions();
    }
    
    dash(dirX, dirY) {
        this.dashHandler.dash(dirX, dirY);
    }
    
    handleCollisions() {
        const transform = this.gameObject.transform;
        const physics = this.gameObject.getComponent('Physics');

        // Check against all collidable game objects
        for (const other of this.gameObject.scene?.gameObjects || []) {
            if (other === this.gameObject || other._destroyed) continue;

            const otherTransform = other.transform;
            if (!otherTransform) continue;

            if (
                transform.position.x < otherTransform.position.x + otherTransform.size.x &&
                transform.position.x + transform.size.x > otherTransform.position.x &&
                transform.position.y < otherTransform.position.y + otherTransform.size.y &&
                transform.position.y + transform.size.y > otherTransform.position.y
            ) {
                // Collision detected, handle based on other's name/type
                if (other.name === 'FuelCan') {
                    this.collectFuelCan(other);
                } else if (other.name === 'ExitDoor') {
                    this.levelComplete();
                } else if (other.name === 'Platform' && other.killsPlayer && physics.onGround) {
                    this.die();
                }
            }
        }
    }
    
    collectFuelCan(can) {
        can.destroy();
        this.fuelController?.addFuel(50);

        const particleSystem = this.gameObject.scene?.particleSystem;
        if (particleSystem) {
            const transform = can.transform;
            particleSystem.emit('fuel_collect', {
                x: transform.position.x + transform.size.x / 2,
                y: transform.position.y + transform.size.y / 2
            });
        }
    }

    die() {
        console.log("Player died!");
        // For now, just reload the level.
        const level = this.gameObject.scene?.level;
        this.gameObject.scene?.game.sceneManager.changeScene('game', { level });
    }

    levelComplete() {
        console.log("Level Complete!");
        // For now, return to splash screen
        this.gameObject.scene?.game.sceneManager.changeScene('splash');
    }
}
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
        if (!this.movementState || !this.characterController) {
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
    }
    
    dash(dirX, dirY) {
        this.dashHandler.dash(dirX, dirY);
    }
}
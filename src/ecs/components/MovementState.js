import Component from './Component.js';

export const MOVEMENT_STATES = {
    IDLE: 'idle',
    RUNNING: 'running',
    JUMPING: 'jumping',
    FALLING: 'falling',
    DASHING: 'dashing',
    SLIDING: 'sliding'
};

export default class MovementState extends Component {
    constructor() {
        super();
        this.currentState = MOVEMENT_STATES.IDLE;
        this.previousState = MOVEMENT_STATES.IDLE;
        this.stateTime = 0;
        
        // Dash tracking
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.dashDirection = { x: 0, y: 0 };
        
        // Jump tracking
        this.isJumping = false;
        this.jumpHoldTimer = 0;
        
        // Slide tracking
        this.isSliding = false;
    }
    
    setState(newState) {
        if (this.currentState !== newState) {
            this.previousState = this.currentState;
            this.currentState = newState;
            this.stateTime = 0;
        }
    }
    
    update(deltaTime) {
        this.stateTime += deltaTime;
        
        // Update dash timers
        if (this.dashTimer > 0) {
            this.dashTimer -= deltaTime;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }
        }
        
        if (this.dashCooldownTimer > 0) {
            this.dashCooldownTimer -= deltaTime;
        }
        
        // Update jump timer
        if (this.jumpHoldTimer > 0) {
            this.jumpHoldTimer -= deltaTime;
        }
    }
    
    canDash() {
        return this.dashCooldownTimer <= 0 && !this.isDashing;
    }
    
    startDash(direction) {
        this.isDashing = true;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.dashDirection = direction;
        this.setState(MOVEMENT_STATES.DASHING);
    }
}
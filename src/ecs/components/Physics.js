import Component from 'game/ecs/components/Component';
import Vector2 from 'game/utils/Vector2';

export default class Physics extends Component {
    constructor() {
        super();
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.gravity = 0;
        this.onGround = false;
        
        // Friction system
        this.frictionMultiplier = 1.0; // Can be modified by liquids
        this.currentFriction = 0;
        
        // For liquid interactions (future)
        this.liquidDepth = 0;
        this.liquidType = null;
    }
    
    applyAcceleration(ax, ay) {
        this.acceleration.x += ax;
        this.acceleration.y += ay;
    }
    
    applyFriction(baseFriction, deltaTime) {
        const friction = baseFriction * this.frictionMultiplier;
        this.currentFriction = friction;
        
        if (this.velocity.x !== 0) {
            const frictionForce = friction * deltaTime;
            const sign = Math.sign(this.velocity.x);
            this.velocity.x -= sign * Math.min(Math.abs(this.velocity.x), frictionForce);
        }
    }
    
    clampSpeed(maxSpeed) {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
    }
}
import Particle from './Particle.js';
import { GRAVITY } from 'game/config/constants';

export default class PhysicalParticle extends Particle {
    constructor() {
        super();
        this.bounciness = 0.5;
        this.friction = 0.98;
    }

    init(options) {
        super.init(options);
        this.bounciness = options.bounciness !== undefined ? options.bounciness : 0.5;
        this.friction = options.friction !== undefined ? options.friction : 0.98;

        // Physical particles are affected by gravity by default
        if (options.ay === undefined) {
            this.acceleration.y = GRAVITY;
        }
    }

    update(deltaTime, colliders = []) {
        super.update(deltaTime);
        if (!this.active) return;

        let onSurface = false;

        // Collision detection with platforms and ramps
        for (const collider of colliders) {
            const colTransform = collider.transform;
            const p = this.position;
            const v = this.velocity;
            const prevY = p.y - v.y * deltaTime;

            if (collider.name === 'Platform') {
                if (p.x >= colTransform.position.x &&
                    p.x <= colTransform.position.x + colTransform.size.x &&
                    prevY <= colTransform.position.y &&
                    p.y >= colTransform.position.y) {
                    
                    p.y = colTransform.position.y;
                    v.y *= -this.bounciness; // Bounce
                    v.x *= this.friction;    // Apply friction
                    onSurface = true;
                }
            } else if (collider.name === 'Ramp') {
                 // Simple bounding box check first
                if (
                    p.x >= colTransform.position.x &&
                    p.x <= colTransform.position.x + colTransform.size.x &&
                    p.y >= colTransform.position.y &&
                    p.y <= colTransform.position.y + colTransform.size.y
                ) {
                    const relativeX = p.x - colTransform.position.x;
                    // Assuming ramp slopes up from left to right
                    const rampSurfaceY = colTransform.position.y + colTransform.size.y * (1 - (relativeX / colTransform.size.x));
                    
                    if (p.y > rampSurfaceY) {
                        p.y = rampSurfaceY;
                        v.y *= -this.bounciness * 0.5; // Less bounce on ramps
                        v.x *= this.friction;
                        onSurface = true;
                    }
                }
            }
        }
        
        // If on a surface and moving slowly, come to a rest.
        if (onSurface && Math.abs(v.y) < 5) {
            v.y = 0;
            this.acceleration.y = 0;
        }
        if (onSurface && Math.abs(v.x) < 1) {
            v.x = 0;
        }
    }
}
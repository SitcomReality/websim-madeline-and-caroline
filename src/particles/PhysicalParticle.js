import Particle from './Particle.js';
import { GRAVITY } from 'game/config/constants';

export default class PhysicalParticle extends Particle {
    constructor() {
        super();
        this.bounciness = 0.5;
        this.friction = 0.98;
        this.prevPosition = { x: 0, y: 0 };
    }

    init(options) {
        super.init(options);
        this.bounciness = options.bounciness !== undefined ? options.bounciness : 0.5;
        this.friction = options.friction !== undefined ? options.friction : 0.98;
        
        // Store initial position
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;

        // Physical particles are affected by gravity by default
        if (options.ay === undefined) {
            this.acceleration.y = GRAVITY;
        }
    }

    update(deltaTime, colliders = []) {
        if (!this.active) return;

        // Store position before updating
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;
        
        // Update velocity and position
        super.update(deltaTime);
        if (!this.active) return;

        let onSurface = false;

        // Collision detection with platforms and ramps
        for (const collider of colliders) {
            if (!collider.transform) continue;
            
            const colTransform = collider.transform;
            const p = this.position;
            const v = this.velocity;

            if (collider.name === 'Platform') {
                // Check if particle is within horizontal bounds
                if (p.x >= colTransform.position.x - 2 &&
                    p.x <= colTransform.position.x + colTransform.size.x + 2) {
                    
                    const platformTop = colTransform.position.y;
                    const platformBottom = colTransform.position.y + colTransform.size.y;
                    
                    // Check if particle crossed through platform from above
                    if (this.prevPosition.y <= platformTop && p.y > platformTop && p.y < platformBottom + 10) {
                        // Collision! Place particle on top of platform
                        p.y = platformTop;
                        v.y *= -this.bounciness;
                        v.x *= this.friction;
                        onSurface = true;
                        
                        // If bounce is small, stop bouncing
                        if (Math.abs(v.y) < 10) {
                            v.y = 0;
                            this.acceleration.y = 0;
                        }
                    }
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
                        v.y *= -this.bounciness * 0.5;
                        v.x *= this.friction;
                        onSurface = true;
                    }
                }
            }
        }
        
        // If on a surface and moving slowly, come to a rest
        if (onSurface && Math.abs(v.y) < 5) {
            v.y = 0;
            this.acceleration.y = 0;
        }
        if (onSurface && Math.abs(v.x) < 1) {
            v.x = 0;
        }
    }
}
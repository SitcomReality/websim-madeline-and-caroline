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
        
        // Store initial position properly
        this.prevPosition.x = options.x;
        this.prevPosition.y = options.y;

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
                const platformTop = colTransform.position.y;
                const platformBottom = colTransform.position.y + colTransform.size.y;
                const platformLeft = colTransform.position.x;
                const platformRight = colTransform.position.x + colTransform.size.x;
                
                // Check if particle is within or near horizontal bounds (with margin)
                if (p.x >= platformLeft - 5 && p.x <= platformRight + 5) {
                    // Check if particle crossed through platform or is already inside/below it
                    // More lenient check - if particle is anywhere near the platform vertically
                    if (p.y >= platformTop - 5 && p.y <= platformBottom + 20) {
                        // Check if coming from above
                        if (this.prevPosition.y < platformTop + 5) {
                            // Collision! Place particle on top of platform
                            p.y = platformTop;
                            v.y *= -this.bounciness;
                            v.x *= this.friction;
                            onSurface = true;
                            
                            // If bounce is small, stop bouncing
                            if (Math.abs(v.y) < 20) {
                                v.y = 0;
                                this.acceleration.y = 0;
                            }
                            break; // Found collision, stop checking other platforms
                        }
                    }
                }
            } else if (collider.name === 'Ramp') {
                const rampLeft = colTransform.position.x;
                const rampRight = colTransform.position.x + colTransform.size.x;
                const rampTop = colTransform.position.y;
                const rampBottom = colTransform.position.y + colTransform.size.y;
                
                // Check if within ramp bounds
                if (p.x >= rampLeft - 5 && p.x <= rampRight + 5 &&
                    p.y >= rampTop - 5 && p.y <= rampBottom + 20) {
                    
                    const relativeX = Math.max(0, Math.min(colTransform.size.x, p.x - rampLeft));
                    // Ramp slopes up from left to right
                    const rampSurfaceY = rampBottom - (relativeX / colTransform.size.x) * colTransform.size.y;
                    
                    if (p.y >= rampSurfaceY - 5 && this.prevPosition.y < rampSurfaceY) {
                        p.y = rampSurfaceY;
                        v.y *= -this.bounciness * 0.5;
                        v.x *= this.friction;
                        onSurface = true;
                        
                        if (Math.abs(v.y) < 20) {
                            v.y = 0;
                            this.acceleration.y = 0;
                        }
                        break;
                    }
                }
            }
        }
        
        // If on a surface and moving slowly, come to a rest
        if (onSurface) {
            if (Math.abs(v.y) < 10) {
                v.y = 0;
                this.acceleration.y = 0;
            }
            if (Math.abs(v.x) < 2) {
                v.x = 0;
            }
        }
    }
}
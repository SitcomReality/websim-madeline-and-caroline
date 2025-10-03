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

        // Simple collision detection with platforms
        for (const platform of colliders) {
            if (platform.name !== 'Platform') continue;
            
            const platTransform = platform.transform;
            const p = this.position;
            const v = this.velocity;
            
            if (p.x > platTransform.position.x &&
                p.x < platTransform.position.x + platTransform.size.x &&
                p.y > platTransform.position.y &&
                p.y < platTransform.position.y + platTransform.size.y) {
                
                // Approximate collision response
                const prevY = p.y - v.y * deltaTime;
                if (prevY <= platTransform.position.y) {
                    p.y = platTransform.position.y;
                    v.y *= -this.bounciness; // Bounce
                    v.x *= this.friction;    // Apply friction on bounce
                }
            }
        }
    }
}


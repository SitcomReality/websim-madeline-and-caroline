export default class ParticleManager {
    constructor(maxParticles = 5000) {
        this.pools = new Map();
        this.activeParticles = [];
        this.maxParticles = maxParticles;
    }

    get(ParticleClass) {
        if (!this.pools.has(ParticleClass)) {
            this.pools.set(ParticleClass, []);
        }

        const pool = this.pools.get(ParticleClass);
        let particle;

        if (pool.length > 0) {
            particle = pool.pop();
        } else if (this.activeParticles.length < this.maxParticles) {
            particle = new ParticleClass();
        } else {
            // Optional: Recycle the oldest active particle
            // For now, just return null if we're at capacity
            return null; 
        }

        this.activeParticles.push(particle);
        return particle;
    }

    release(particle) {
        const index = this.activeParticles.indexOf(particle);
        if (index > -1) {
            this.activeParticles.splice(index, 1);
            const pool = this.pools.get(particle.constructor);
            if (pool) {
                particle.active = false;
                pool.push(particle);
            }
        }
    }

    update(deltaTime, colliders) {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const p = this.activeParticles[i]; 
            
            if (p.update.length > 1) { // Check if update accepts colliders
                p.update(deltaTime, colliders);
            } else {
                p.update(deltaTime);
            }

            if (!p.active) {
                this.release(p);
            }
        }
    }

    draw(ctx) {
        for (const p of this.activeParticles) {
            p.draw(ctx);
        }
    }
}
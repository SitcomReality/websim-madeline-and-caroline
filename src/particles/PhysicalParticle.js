import Particle from './Particle.js';

export default class PhysicalParticle extends Particle {
    constructor() {
        super();
        this.bounciness = 0.3;
        this.friction = 0.95;
        this.onGround = false;
        this.gravity = 500;
    }

    init(options) {
        super.init(options);
        this.bounciness = options.bounciness !== undefined ? options.bounciness : 0.3;
        this.friction = options.friction !== undefined ? options.friction : 0.95;
        this.gravity = options.ay || 500;
        this.onGround = false;
    }

    update(deltaTime, colliders = []) {
        if (!this.active) return;

        // Age tracking
        this.age += deltaTime;
        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        // Apply gravity
        this.acceleration.y = this.gravity;

        // Apply acceleration to velocity
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // Store old position for collision resolution
        const oldX = this.position.x;
        const oldY = this.position.y;

        // Attempt to move
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // Collision detection with platforms and ramps
        this.onGround = false;
        const particleSize = this.size;

        for (const collider of colliders) {
            if (!collider.transform) continue;

            const ct = collider.transform;

            // AABB collision check
            if (
                this.position.x < ct.position.x + ct.size.x &&
                this.position.x + particleSize > ct.position.x &&
                this.position.y < ct.position.y + ct.size.y &&
                this.position.y + particleSize > ct.position.y
            ) {
                // Determine collision direction based on previous position
                const overlapLeft = (this.position.x + particleSize) - ct.position.x;
                const overlapRight = (ct.position.x + ct.size.x) - this.position.x;
                const overlapTop = (this.position.y + particleSize) - ct.position.y;
                const overlapBottom = (ct.position.y + ct.size.y) - this.position.y;

                // Find minimum overlap to determine collision side
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapTop && this.velocity.y > 0) {
                    // Collision from top - land on surface
                    this.position.y = ct.position.y - particleSize;
                    this.velocity.y = Math.abs(this.velocity.y) < 50 ? 0 : -this.velocity.y * this.bounciness;
                    this.velocity.x *= this.friction;
                    this.onGround = true;
                } else if (minOverlap === overlapBottom && this.velocity.y < 0) {
                    // Collision from bottom - hit ceiling
                    this.position.y = ct.position.y + ct.size.y;
                    this.velocity.y = -this.velocity.y * this.bounciness;
                } else if (minOverlap === overlapLeft && this.velocity.x > 0) {
                    // Collision from left
                    this.position.x = ct.position.x - particleSize;
                    this.velocity.x = -this.velocity.x * this.bounciness;
                } else if (minOverlap === overlapRight && this.velocity.x < 0) {
                    // Collision from right
                    this.position.x = ct.position.x + ct.size.x;
                    this.velocity.x = -this.velocity.x * this.bounciness;
                }

                // Reduce velocity after collision
                if (Math.abs(this.velocity.x) < 10) this.velocity.x = 0;
                if (Math.abs(this.velocity.y) < 10 && this.onGround) this.velocity.y = 0;
            }
        }

        // Ground friction
        if (this.onGround) {
            const frictionFactor = Math.pow(0.5, deltaTime);
            this.velocity.x *= frictionFactor;
        }

        // Interpolate visual properties
        const t = this.age / this.lifetime;
        this.size = this.lerp(this.startSize, this.endSize, t);
        for (let i = 0; i < 4; i++) {
            this.color[i] = this.lerp(this.startColor[i], this.endColor[i], t);
        }
    }
}
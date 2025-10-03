export default class SlimeParticle extends (await import('./PhysicalParticle.js')).default {
    constructor() {
        super();
        this.bounciness = 0.05;
        this.friction = 0.98;
        this.gravity = 400;
        this.stickThreshold = 8;
    }

    init(options) {
        super.init({
            ...options,
            bounciness: options.bounciness ?? 0.05,
            friction: options.friction ?? 0.98,
            ay: options.ay ?? 400
        });
        this.stickThreshold = options.stickThreshold ?? 8;
    }

    update(deltaTime, colliders = []) {
        super.update(deltaTime, colliders);
        if (!this.active) return;
        // Extra stickiness when grounded: kill tiny horizontal motion
        if (this.onGround && Math.abs(this.velocity.x) < this.stickThreshold) {
            this.velocity.x = 0;
        }
    }
}
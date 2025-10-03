import Component from "./Component.js";

export default class EmitterController extends Component {
    constructor(config) {
        super();
        this.config = config;
        this.timer = 0;

        // Use ?? for nullish coalescing to handle 0 values correctly
        this.burstMode = this.config.burstMode ?? false;

        if (this.burstMode) {
            this.emitInterval = this.config.burstInterval ?? 2;
        } else {
            const emitRate = this.config.emitRate ?? 10;
            this.emitInterval = emitRate > 0 ? 1 / emitRate : Infinity;
        }
    }

    update(deltaTime) {
        this.timer += deltaTime;

        if (this.timer >= this.emitInterval) {
            this.emit();
            this.timer = this.timer % this.emitInterval; // Carry over excess time
        }
    }

    emit() {
        const particleSystem = this.gameObject.scene?.particleSystem;
        if (!particleSystem) return;

        const { position, size } = this.gameObject.transform;

        const emitterName = this.config.emitterType || 'magic_sparkle';
        const angle = this.config.angle ?? -90;
        const cone = this.config.cone ?? 20;

        const emitOptions = {
            x: position.x + size.x / 2,
            y: position.y + size.y / 2,
            angle: { min: angle - cone / 2, max: angle + cone / 2 }
        };

        // Only override color if specified in config
        if (this.config.particleColor) {
             emitOptions.color = this.config.particleColor;
        }

        particleSystem.emit(emitterName, emitOptions);
    }
}
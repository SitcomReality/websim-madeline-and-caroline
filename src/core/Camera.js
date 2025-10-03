import Vector2 from 'game/utils/Vector2';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';

export default class Camera {
    constructor(worldWidth = SCREEN_WIDTH, worldHeight = SCREEN_HEIGHT) {
        this.position = new Vector2(0, 0);
        this.viewportSize = new Vector2(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.worldBounds = new Vector2(worldWidth, worldHeight);

        this.target = null;
        this.smoothing = 0.05;
        this.deadzone = new Vector2(200, 150);
        this.lookahead = new Vector2(150, 0);

        // For panning
        this.isPanning = false;
        this.panStart = new Vector2(0, 0);
        this.panPositionStart = new Vector2(0, 0);
    }

    setTarget(gameObject) {
        this.target = gameObject;
    }

    update(deltaTime) {
        if (!this.target) return;

        const targetPos = this.target.transform.position;
        const targetSize = this.target.transform.size;
        const targetCenter = new Vector2(
            targetPos.x + targetSize.x / 2,
            targetPos.y + targetSize.y / 2
        );

        const physics = this.target.getComponent('Physics');
        const lookaheadOffset = physics ? Math.sign(physics.velocity.x) : this.target.transform.lastDirection;

        const desiredPos = new Vector2(
            targetCenter.x - this.viewportSize.x / 2 + (this.lookahead.x * lookaheadOffset),
            targetCenter.y - this.viewportSize.y / 2
        );

        // Smooth follow
        this.position.x += (desiredPos.x - this.position.x) * this.smoothing;
        this.position.y += (desiredPos.y - this.position.y) * this.smoothing;

        this.clampToBounds();
    }

    clampToBounds() {
        this.position.x = Math.max(0, Math.min(this.position.x, this.worldBounds.x - this.viewportSize.x));
        this.position.y = Math.max(0, Math.min(this.position.y, this.worldBounds.y - this.viewportSize.y));
    }

    applyTransform(ctx) {
        ctx.translate(-Math.round(this.position.x), -Math.round(this.position.y));
    }

    screenToWorld(screenVec) {
        return new Vector2(screenVec.x + this.position.x, screenVec.y + this.position.y);
    }
}
import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';

export function createRamp(x, y, width, height, angle = 45) {
    const ramp = new GameObject('Ramp');

    ramp.addComponent(new Transform(x, y, width, height));

    // Custom draw for ramp shape
    const renderer = new SpriteRenderer('#888888');
    renderer.draw = (ctx) => {
        const { position, size } = ramp.transform;
        ctx.fillStyle = renderer.color;
        ctx.beginPath();
        // Assuming a right-angle ramp for now
        ctx.moveTo(position.x, position.y + size.y);
        ctx.lineTo(position.x + size.x, position.y + size.y);
        ctx.lineTo(position.x + size.x, position.y);
        ctx.closePath();
        ctx.fill();
    };
    ramp.addComponent(renderer);
    ramp.angle = angle;

    return ramp;
}
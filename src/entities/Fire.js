import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';
import Physics from 'game/ecs/components/Physics';
import { GRAVITY } from 'game/config/constants';

export function createFire(x, y, intensity = 1) {
    const fire = new GameObject('Fire');
    
    const size = 24 * intensity;
    fire.addComponent(new Transform(x, y, size, size));
    
    const physics = new Physics();
    physics.gravity = GRAVITY * 0.3; // Fire rises slightly
    physics.velocity.y = -50 * intensity; // Upward movement
    fire.addComponent(physics);
    
    const renderer = new SpriteRenderer('#ff4500');
    renderer.animate = true;
    renderer.intensity = intensity;
    fire.addComponent(renderer);
    
    return fire;
}


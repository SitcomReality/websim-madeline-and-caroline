import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';

export function createPlatform(x, y, width, height) {
    const platform = new GameObject('Platform');

    platform.addComponent(new Transform(x, y, width, height));
    platform.addComponent(new SpriteRenderer('#47ffff'));

    return platform;
}


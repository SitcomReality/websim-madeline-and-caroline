import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';

export function createPlatform(x, y, width, height) {
    const platform = new GameObject('Platform');

    platform.addComponent(new Transform(x, y, width, height));
    // Use provided color if passed in via an extra argument on the function call
    const color = arguments[4] !== undefined ? arguments[4] : '#47ffff';
    platform.addComponent(new SpriteRenderer(color));

    return platform;
}
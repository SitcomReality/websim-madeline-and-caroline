import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';

export function createExitDoor(x, y, width, height) {
    const door = new GameObject('ExitDoor');

    door.addComponent(new Transform(x, y, width, height));
    door.addComponent(new SpriteRenderer('#00ffff'));

    return door;
}


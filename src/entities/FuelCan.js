import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import SpriteRenderer from 'game/ecs/components/SpriteRenderer';

export function createFuelCan(x, y) {
    const fuelCan = new GameObject('FuelCan');
    
    fuelCan.addComponent(new Transform(x, y, 28, 32));
    
    const renderer = new SpriteRenderer('#ffff00');
    renderer.hasGlow = true;
    fuelCan.addComponent(renderer);
    
    return fuelCan;
}


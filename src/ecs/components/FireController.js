import Component from './Component.js';
import { FIRE_SPREAD_RATE, FIRE_DAMAGE } from '../../config/constants.js';
import { createFire } from '../../entities/Fire.js';

export default class FireController extends Component {
    constructor() {
        super();
        this.lifetime = 5; // seconds
        this.spreadTimer = 0;
        this.spreadInterval = 1 / FIRE_SPREAD_RATE;
    }
    
    update(deltaTime) {
        this.lifetime -= deltaTime;
        this.spreadTimer += deltaTime;
        
        if (this.lifetime <= 0) {
            this.gameObject.destroy();
            return;
        }
        
        // Flickering effect
        const renderer = this.gameObject.getComponent('SpriteRenderer');
        if (renderer) {
            const flicker = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
            renderer.color = `hsl(${20 + Math.random() * 40}, 100%, ${50 * flicker}%)`;
        }
        
        // Check for nearby flammable objects
        if (this.spreadTimer >= this.spreadInterval) {
            this.spreadTimer = 0;
            this.checkForSpread();
        }
    }
    
    checkForSpread() {
        // Check for nearby fuel cans or platforms to ignite
        const transform = this.gameObject.transform;
        const gameObjects = this.gameObject.scene?.gameObjects || [];
        
        for (const obj of gameObjects) {
            if (obj.name === 'FuelCan' || obj.name === 'Platform') {
                const objTransform = obj.transform;
                const distance = Math.sqrt(
                    Math.pow(transform.position.x - objTransform.position.x, 2) +
                    Math.pow(transform.position.y - objTransform.position.y, 2)
                );
                
                if (distance < 50 && Math.random() < FIRE_SPREAD_RATE) {
                    // Create new fire at object location
                    const fire = createFire(objTransform.position.x, objTransform.position.y);
                    this.gameObject.scene?.addGameObject(fire);
                }
            }
        }
    }
}
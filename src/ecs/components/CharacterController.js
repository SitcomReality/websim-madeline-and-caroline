import Component from './Component.js';
import { CHARACTERS } from '../../config/characters.js';
import InputManager from '../../core/InputManager.js';

export default class CharacterController extends Component {
    constructor() {
        super();
        this.characters = [CHARACTERS.MADELINE, CHARACTERS.CAROLINE];
        this.characterIndex = 0;
        this.activeCharacter = this.characters[this.characterIndex];
        this.canSwitch = true;

        this.onCharacterSwitch = () => {}; // Callback for UI updates
    }

    init() {
        this.applyCharacterStats();
    }

    update(deltaTime) {
        if (InputManager.isKeyPressed('Enter')) {
            if (this.canSwitch) {
                this.switchCharacter();
                this.canSwitch = false;
            }
        } else {
            this.canSwitch = true;
        }
    }

    switchCharacter() {
        this.characterIndex = (this.characterIndex + 1) % this.characters.length;
        this.activeCharacter = this.characters[this.characterIndex];
        this.applyCharacterStats();

        // Emit particles for switch effect
        const particleSystem = this.gameObject.scene?.particleSystem;
        if (particleSystem) {
            const transform = this.gameObject.transform;
            particleSystem.emit('character_switch', {
                x: transform.position.x + transform.size.x / 2,
                y: transform.position.y + transform.size.y / 2,
                color: this.activeCharacter.color,
            });
        }

        // Notify listeners (like UI)
        this.onCharacterSwitch(this.activeCharacter);
    }

    applyCharacterStats() {
        // Apply color
        const renderer = this.gameObject.getComponent('SpriteRenderer');
        if (renderer) {
            renderer.color = this.activeCharacter.color;
        }

        // The PlayerController is responsible for reading movement stats.
    }

    getMovementStats() {
        return this.activeCharacter.movement;
    }

    getParticleConfig() {
        return this.activeCharacter.particles;
    }
}
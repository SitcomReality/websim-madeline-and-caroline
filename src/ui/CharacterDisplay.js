import UIComponent from './UIComponent.js';

export default class CharacterDisplay extends UIComponent {
    constructor(playerCharacterController) {
        super();
        this.controller = playerCharacterController;
        this.nameElement = null;
    }

    init(container) {
        this.createElement('div', 'character-display', container);

        const title = document.createElement('h4');
        title.textContent = 'ACTIVE CHARACTER';
        this.element.appendChild(title);

        this.nameElement = document.createElement('div');
        this.nameElement.className = 'char-name';
        this.element.appendChild(this.nameElement);
        
        this.update();
        
        // Listen for character switches
        this.controller.onCharacterSwitch = () => this.update();
    }

    update() {
        if (!this.controller || !this.nameElement) return;

        const char = this.controller.activeCharacter;
        this.nameElement.textContent = char.name;
        this.nameElement.style.color = char.color;
        this.element.style.borderColor = char.color;
    }

    destroy() {
        if (this.controller) {
            this.controller.onCharacterSwitch = () => {};
        }
        super.destroy();
    }
}


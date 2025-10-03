export default class CharacterDisplay {
    constructor(playerCharacterController) {
        this.controller = playerCharacterController;
        this.element = null;
        this.nameElement = null;
    }

    init(container) {
        this.element = document.createElement('div');
        this.element.id = 'character-display';

        const title = document.createElement('h4');
        title.textContent = 'ACTIVE CHARACTER';
        this.element.appendChild(title);

        this.nameElement = document.createElement('div');
        this.nameElement.className = 'char-name';
        this.element.appendChild(this.nameElement);

        container.appendChild(this.element);
        
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
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.controller) {
            this.controller.onCharacterSwitch = () => {};
        }
    }
}


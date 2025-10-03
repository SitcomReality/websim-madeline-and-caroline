import UIComponent from './UIComponent.js';

export default class GasolineMeter extends UIComponent {
    constructor(playerFuelController) {
        super();
        this.controller = playerFuelController;
        this.barElement = null;
    }

    init(container) {
        this.createElement('div', 'gasoline-meter', container);

        const title = document.createElement('h4');
        title.textContent = 'GASOLINE';
        this.element.appendChild(title);

        const barContainer = document.createElement('div');
        barContainer.className = 'gas-bar-container';

        this.barElement = document.createElement('div');
        this.barElement.className = 'gas-bar';
        barContainer.appendChild(this.barElement);

        this.element.appendChild(barContainer);

        this.update();

        // Listen for fuel changes
        this.controller.onFuelChange = (current, max) => this.update(current, max);
    }

    update(current, max) {
        if (!this.barElement || !this.controller) return;

        current = current !== undefined ? current : this.controller.currentFuel;
        max = max !== undefined ? max : this.controller.maxFuel;

        const percentage = (current / max) * 100;
        this.barElement.style.width = `${percentage}%`;
    }

    destroy() {
        if (this.controller) {
            this.controller.onFuelChange = () => {};
        }
        super.destroy();
    }
}


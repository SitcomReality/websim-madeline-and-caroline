import UIComponent from './UIComponent.js';

export default class InGameMenu extends UIComponent {
    constructor(game, buttonEl) {
        super();
        this.game = game;
        this.buttonEl = buttonEl;
        this.modalEl = null;
        this.keyHandler = (e) => {
            if (e.key === 'Escape') {
                this.toggleMenu();
            }
        };
        this.buttonEl.onclick = () => this.toggleMenu();
        document.addEventListener('keydown', this.keyHandler);
    }

    showButton() { this.buttonEl.classList.remove('hidden'); }
    hideButton() { this.buttonEl.classList.add('hidden'); }

    toggleMenu() {
        if (this.modalEl) { this.close(); } else { this.open(); }
    }

    open() {
        const modal = document.createElement('div');
        modal.className = 'save-load-modal menu';
        const title = document.createElement('h2');
        title.textContent = 'Pause';
        const actions = document.createElement('div');
        actions.className = 'modal-actions';
        const resume = document.createElement('button');
        resume.textContent = 'Resume';
        resume.onclick = () => this.close();
        const toMenu = document.createElement('button');
        toMenu.textContent = 'Return to Menu';
        toMenu.onclick = () => { this.close(); this.hideButton(); this.game.sceneManager.changeScene('splash'); };
        actions.appendChild(resume);
        actions.appendChild(toMenu);
        modal.appendChild(title);
        modal.appendChild(actions);
        document.getElementById('game-container').appendChild(modal);
        this.modalEl = modal;
    }

    close() {
        if (this.modalEl) {
            this.modalEl.remove();
            this.modalEl = null;
        }
    }

    destroy() {
        this.close();
        this.hideButton();
        this.buttonEl.onclick = null;
        document.removeEventListener('keydown', this.keyHandler);
    }
}


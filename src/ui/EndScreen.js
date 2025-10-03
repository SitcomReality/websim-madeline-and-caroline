export default class EndScreen {
    constructor(gameScene) {
        this.scene = gameScene;
        this.element = null;
    }

    open(type = 'dead') {
        this.close();
        const modal = document.createElement('div');
        modal.className = 'save-load-modal';
        const title = document.createElement('h2');
        title.textContent = type === 'dead' ? 'Bad Luck!' : 'Well Done!';
        const actions = document.createElement('div');
        actions.className = 'modal-actions';
        const retry = document.createElement('button');
        retry.textContent = 'Retry';
        retry.onclick = () => this.scene.retryLevel();
        const menu = document.createElement('button');
        menu.textContent = 'Main Menu';
        menu.onclick = () => this.scene.returnToMenu();
        actions.appendChild(retry); actions.appendChild(menu);
        modal.appendChild(title); modal.appendChild(actions);
        document.getElementById('game-container').appendChild(modal);
        this.element = modal;
    }

    close() {
        if (this.element) { this.element.remove(); this.element = null; }
    }
}


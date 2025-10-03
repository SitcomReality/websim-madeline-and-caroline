import InputBuffer from '../systems/InputBuffer.js';

class InputManager {
    constructor() {
        this.keys = new Set();

        window.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keys.add(e.code);
                InputBuffer.handleKeyDown(e.code);
            }
        });
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    }

    isKeyPressed(keyCode) {
        return this.keys.has(keyCode);
    }
}

// Singleton instance
const inputManager = new InputManager();
export default inputManager;
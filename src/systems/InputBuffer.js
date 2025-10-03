import { MOVEMENT } from '../config/movementConstants.js';

class InputBuffer {
    constructor() {
        this.keyTapTimes = new Map();
        this.doubleTapCallbacks = new Map();
    }

    registerDoubleTap(keyCode, callback) {
        this.doubleTapCallbacks.set(keyCode, callback);
    }

    unregisterDoubleTap(keyCode) {
        this.doubleTapCallbacks.delete(keyCode);
    }

    handleKeyDown(keyCode) {
        const now = performance.now() / 1000;
        const lastTapTime = this.keyTapTimes.get(keyCode);

        if (lastTapTime && (now - lastTapTime) < MOVEMENT.DOUBLE_TAP_WINDOW) {
            // Double tap detected
            const callback = this.doubleTapCallbacks.get(keyCode);
            if (callback) {
                callback();
            }
            // Clear the tap time so triple-taps don't register
            this.keyTapTimes.delete(keyCode);
        } else {
            // Single tap, record time
            this.keyTapTimes.set(keyCode, now);
        }
    }

    update() {
        // Clean up old tap times
        const now = performance.now() / 1000;
        for (const [key, time] of this.keyTapTimes.entries()) {
            if (now - time > MOVEMENT.DOUBLE_TAP_WINDOW) {
                this.keyTapTimes.delete(key);
            }
        }
    }
}

// Singleton instance
const inputBuffer = new InputBuffer();
export default inputBuffer;
export default class EditorHistory {
    constructor(maxSize = 50) {
        this.actions = [];
        this.currentIndex = -1;
        this.maxSize = maxSize;
    }

    recordAction(action) {
        // Remove any actions after current index (when undoing then doing something new)
        this.actions = this.actions.slice(0, this.currentIndex + 1);
        
        // Add new action
        this.actions.push(action);
        this.currentIndex++;
        
        // Limit history size
        if (this.actions.length > this.maxSize) {
            this.actions.shift();
            this.currentIndex--;
        }
    }

    undo() {
        if (this.canUndo()) {
            const action = this.actions[this.currentIndex];
            this.currentIndex--;
            return action;
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            const action = this.actions[this.currentIndex];
            return action;
        }
        return null;
    }

    canUndo() {
        return this.currentIndex >= 0;
    }

    canRedo() {
        return this.currentIndex < this.actions.length - 1;
    }

    clear() {
        this.actions = [];
        this.currentIndex = -1;
    }
}
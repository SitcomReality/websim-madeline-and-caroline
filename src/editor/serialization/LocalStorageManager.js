export default class LocalStorageManager {
    constructor() {
        this.prefix = 'madeline_caroline_level_';
    }

    saveLevel(name, data) {
        const key = this.prefix + name;
        localStorage.setItem(key, data);
    }

    loadLevel(name) {
        const key = this.prefix + name;
        return localStorage.getItem(key);
    }

    deleteLevel(name) {
        const key = this.prefix + name;
        localStorage.removeItem(key);
    }

    listLevels() {
        const levels = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                levels.push(key.substring(this.prefix.length));
            }
        }
        return levels;
    }
}


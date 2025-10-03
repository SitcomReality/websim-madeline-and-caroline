export default class EmitterRegistry {
    constructor(manager) {
        this.manager = manager;
        this.emitters = new Map();
    }

    register(name, emitter) {
        this.emitters.set(name, emitter);
    }

    get(name) {
        return this.emitters.get(name);
    }

    getAvailableEmitterTypes() {
        const exclude = new Set([
            'character_switch',
            'madeline_dash',
            'caroline_dash',
            'player_death_burst',
            'generic_aesthetic',
            'generic_physical'
        ]);
        return Array.from(this.emitters.keys()).filter(n => !exclude.has(n));
    }
}
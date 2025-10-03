export default class Scene {
    constructor(game) {
        this.game = game;
        this.gameObjects = [];
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    init() {}
    
    update(deltaTime) {
        for(const go of this.gameObjects) {
            go.update(deltaTime);
        }
    }

    draw(ctx) {
        for(const go of this.gameObjects) {
            go.draw(ctx);
        }
    }

    destroy() {}
}


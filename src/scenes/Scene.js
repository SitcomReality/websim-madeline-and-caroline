export default class Scene {
    constructor(game) {
        this.game = game;
        this.gameObjects = [];
        this.particleSystem = null;
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        gameObject.scene = this;
    }

    init() {}
    
    update(deltaTime) {
        for(const go of this.gameObjects) {
            go.update(deltaTime);
        }
        
        // Remove destroyed objects
        this.gameObjects = this.gameObjects.filter(go => !go._destroyed);
    }

    draw(ctx) {
        for(const go of this.gameObjects) {
            go.draw(ctx);
        }
    }

    destroy() {
        this.gameObjects = [];
    }
}
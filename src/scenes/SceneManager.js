export default class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
    }

    addScene(name, scene) {
        this.scenes[name] = scene;
    }

    changeScene(name, params = {}) {
        if (this.currentScene) {
            this.currentScene.destroy();
        }
        this.currentScene = this.scenes[name];
        if (this.currentScene) {
            this.currentScene.init(params);
        }
    }

    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    draw(ctx) {
        if (this.currentScene) {
            this.currentScene.draw(ctx);
        }
    }
}


export default class Renderer {
    draw(gameObjects, ctx) {
        for (const go of gameObjects) {
            go.draw(ctx);
        }
    }
}


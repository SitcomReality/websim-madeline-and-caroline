export default class GameObject {
    constructor(name = 'GameObject') {
        this.name = name;
        this.components = [];
        this.transform = null; // Quick access to transform
    }

    addComponent(component) {
        this.components.push(component);
        component.gameObject = this;
        if (component.constructor.name === 'Transform') {
            this.transform = component;
        }
    }

    getComponent(componentClass) {
        return this.components.find(c => c.constructor.name === componentClass.name);
    }

    update(deltaTime) {
        for (const component of this.components) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }

    draw(ctx) {
         for (const component of this.components) {
            if (component.draw) {
                component.draw(ctx);
            }
        }
    }
}
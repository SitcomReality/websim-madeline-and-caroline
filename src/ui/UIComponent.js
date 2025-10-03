export default class UIComponent {
    constructor() {
        this.element = null;
        this.isVisible = true;
    }

    createElement(tag = 'div', className = '', parent = null) {
        this.element = document.createElement(tag);
        if (className) this.element.className = className;
        if (parent) parent.appendChild(this.element);
        return this.element;
    }

    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            this.isVisible = true;
        }
    }

    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            this.isVisible = false;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    mount(parent) {
        if (this.element && parent) {
            parent.appendChild(this.element);
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    // Override these in subclasses
    init() {}
    update() {}
}
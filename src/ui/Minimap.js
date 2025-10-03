import UIComponent from './UIComponent.js';

export default class Minimap extends UIComponent {
    constructor(container, worldWidth, worldHeight, options = {}) {
        super();
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.width = options.width || 200;
        this.height = options.height || 140;
        this.header = null;
        this.canvas = null;
        this.ctx = null;
        this.toggleBtn = null;
        this.hidden = false;
        this.parentContainer = container;
    }

    init() {
        this.createElement('div', 'minimap', this.parentContainer);
        
        this.header = document.createElement('div');
        this.header.className = 'minimap-header';
        this.header.innerHTML = '<span>Minimap</span>';
        
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'mini-toggle';
        this.toggleBtn.textContent = 'Hide';
        this.toggleBtn.onclick = () => this.toggle();
        this.header.appendChild(this.toggleBtn);
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        
        this.element.appendChild(this.header);
        this.element.appendChild(this.canvas);
    }

    toggle() {
        this.hidden = !this.hidden;
        this.canvas.style.display = this.hidden ? 'none' : 'block';
        this.toggleBtn.textContent = this.hidden ? 'Show' : 'Hide';
    }

    render(gameObjects, playerColor = '#fff') {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        const scale = Math.min(this.width / this.worldWidth, this.height / this.worldHeight);
        const offsetX = (this.width - this.worldWidth * scale) / 2;
        const offsetY = (this.height - this.worldHeight * scale) / 2;

        // Level perimeter
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX, offsetY, this.worldWidth * scale, this.worldHeight * scale);

        for (const go of gameObjects) {
            const t = go.transform;
            if (!t) continue;
            const x = offsetX + t.position.x * scale;
            const y = offsetY + t.position.y * scale;
            const w = t.size.x * scale;
            const h = t.size.y * scale;

            if (go.name === 'Platform') {
                ctx.fillStyle = '#47ffff';
                ctx.fillRect(x, y, w, h);
            } else if (go.name === 'FuelCan') {
                ctx.fillStyle = '#ffff47';
                ctx.fillRect(x, y, Math.max(2, w), Math.max(2, h));
            } else if (go.name === 'Fire') {
                ctx.fillStyle = '#ff6a00';
                ctx.fillRect(x, y, Math.max(2, w), Math.max(2, h));
            } else if (go.name === 'Player') {
                ctx.fillStyle = playerColor;
                ctx.fillRect(x, y, Math.max(3, w), Math.max(3, h));
            }
        }
    }
}


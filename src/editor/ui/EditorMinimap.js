export default class EditorMinimap {
    constructor(editorScene, options = {}) {
        this.scene = editorScene;
        this.editor = editorScene.editorManager;
        this.width = options.width || 200;
        this.height = options.height || 140;
        this.container = document.createElement('div');
        this.container.className = 'minimap';
        this.container.style.right = '20px';
        this.container.style.top = '20px';
        this.container.style.bottom = '';
        this.header = document.createElement('div');
        this.header.className = 'minimap-header';
        this.header.innerHTML = '<span>Editor Minimap</span>';
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'mini-toggle';
        this.toggleBtn.textContent = 'Hide';
        this.toggleBtn.onclick = () => this.toggle();
        this.header.appendChild(this.toggleBtn);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.header);
        this.container.appendChild(this.canvas);
        document.getElementById('editor-ui').appendChild(this.container);
        this.hidden = false;

        // Click to move camera
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    toggle() {
        this.hidden = !this.hidden;
        this.canvas.style.display = this.hidden ? 'none' : 'block';
        this.toggleBtn.textContent = this.hidden ? 'Show' : 'Hide';
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const level = this.editor.state.levelSettings;
        const worldWidth = level.width;
        const worldHeight = level.height;
        const scale = Math.min(this.width / worldWidth, this.height / worldHeight);
        const offsetX = (this.width - worldWidth * scale) / 2;
        const offsetY = (this.height - worldHeight * scale) / 2;

        const worldX = (mx - offsetX) / scale;
        const worldY = (my - offsetY) / scale;

        const cam = this.scene.camera;
        const vw = cam.viewportSize.x;
        const vh = cam.viewportSize.y;
        cam.position.set(
            Math.max(0, Math.min(worldX - vw / 2, worldWidth - vw)),
            Math.max(0, Math.min(worldY - vh / 2, worldHeight - vh))
        );
        cam.clampToBounds();
    }

    render() {
        const ctx = this.ctx;
        const level = this.editor.state.levelSettings;
        const worldWidth = level.width;
        const worldHeight = level.height;
        ctx.clearRect(0, 0, this.width, this.height);

        const scale = Math.min(this.width / worldWidth, this.height / worldHeight);
        const offsetX = (this.width - worldWidth * scale) / 2;
        const offsetY = (this.height - worldHeight * scale) / 2;

        // Level perimeter
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX, offsetY, worldWidth * scale, worldHeight * scale);

        // Entities
        for (const e of this.editor.state.entities) {
            ctx.fillStyle = e.color || '#fff';
            ctx.fillRect(offsetX + e.x * scale, offsetY + e.y * scale, Math.max(1, e.width * scale), Math.max(1, e.height * scale));
        }

        // Camera viewport
        const cam = this.scene.camera;
        const vx = offsetX + cam.position.x * scale;
        const vy = offsetY + cam.position.y * scale;
        const vw = cam.viewportSize.x * scale;
        const vh = cam.viewportSize.y * scale;
        ctx.strokeStyle = '#ff47ab';
        ctx.lineWidth = 2;
        ctx.strokeRect(vx, vy, vw, vh);
    }

    destroy() {
        this.container.remove();
    }
}


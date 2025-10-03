import Tool from 'game/editor/tools/Tool';

export default class PlatformTool extends Tool {
    constructor(editorManager) {
        super(editorManager);
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.gridSize = 20;
    }

    snapToGrid(value) {
        return Math.round(value / this.gridSize) * this.gridSize;
    }

    onMouseDown(x, y) {
        this.isDrawing = true;
        this.startX = this.snapToGrid(x);
        this.startY = this.snapToGrid(y);
        this.currentX = this.startX;
        this.currentY = this.startY;
    }

    onMouseMove(x, y) {
        if (this.isDrawing) {
            this.currentX = this.snapToGrid(x);
            this.currentY = this.snapToGrid(y);
        }
    }

    onMouseUp(x, y) {
        if (this.isDrawing) {
            this.currentX = this.snapToGrid(x);
            this.currentY = this.snapToGrid(y);

            const minX = Math.min(this.startX, this.currentX);
            const minY = Math.min(this.startY, this.currentY);
            const width = Math.abs(this.currentX - this.startX);
            const height = Math.abs(this.currentY - this.startY);

            if (width > 0 && height > 0) {
                const entity = {
                    x: minX,
                    y: minY,
                    width: width,
                    height: height,
                    color: '#47ffff',
                    type: 'platform'
                };
                this.editorManager.addEntity(entity);
            }

            this.isDrawing = false;
        }
    }

    draw(ctx) {
        if (this.isDrawing) {
            const minX = Math.min(this.startX, this.currentX);
            const minY = Math.min(this.startY, this.currentY);
            const width = Math.abs(this.currentX - this.startX);
            const height = Math.abs(this.currentY - this.startY);

            ctx.fillStyle = 'rgba(71, 255, 255, 0.3)';
            ctx.fillRect(minX, minY, width, height);

            ctx.strokeStyle = '#47ffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(minX, minY, width, height);
            ctx.setLineDash([]);
        }
    }
}
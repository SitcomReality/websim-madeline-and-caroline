import Tool from 'game/editor/tools/Tool';

export default class RampTool extends Tool {
    constructor(editorManager) {
        super(editorManager);
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.gridSize = this.editorManager.gridSize || 20;
    }

    snapToGrid(value) {
        if (!this.editorManager.snapToGrid) return value;
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
                    color: '#888888',
                    type: 'ramp',
                    angle: 45
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

            ctx.fillStyle = 'rgba(136, 136, 136, 0.3)';
            ctx.beginPath();
            ctx.moveTo(minX, minY + height);
            ctx.lineTo(minX + width, minY + height);
            ctx.lineTo(minX + width, minY);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}
import Component from 'game/ecs/components/Component';

export default class SpriteRenderer extends Component {
    constructor(color = 'white') {
        super();
        this.color = color;
    }

    draw(ctx) {
        if (!this.gameObject.transform) return;

        const { position, size } = this.gameObject.transform;
        ctx.fillStyle = this.color;
        ctx.fillRect(position.x, position.y, size.x, size.y);
    }
}


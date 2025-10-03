import Component from 'game/ecs/components/Component';
import Vector2 from 'game/utils/Vector2';

export default class Transform extends Component {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super();
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.lastDirection = 1; // 1 for right, -1 for left
    }
}


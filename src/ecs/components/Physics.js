import Component from 'game/ecs/components/Component';
import Vector2 from 'game/utils/Vector2';

export default class Physics extends Component {
    constructor() {
        super();
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.gravity = 0;
        this.onGround = false;
    }
}


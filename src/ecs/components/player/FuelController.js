import Component from 'game/ecs/components/Component';

export default class FuelController extends Component {
    constructor() {
        super();
        this.maxFuel = 100;
        this.currentFuel = 50; // Start with some fuel
        this.onFuelChange = () => {}; // UI callback
    }

    addFuel(amount) {
        this.currentFuel = Math.min(this.maxFuel, this.currentFuel + amount);
        this.onFuelChange(this.currentFuel, this.maxFuel);
    }

    useFuel(amount) {
        if (this.currentFuel > 0) {
            this.currentFuel = Math.max(0, this.currentFuel - amount);
            this.onFuelChange(this.currentFuel, this.maxFuel);
            return true;
        }
        return false;
    }

    getFuel() {
        return this.currentFuel;
    }

    hasFuel() {
        return this.currentFuel > 0;
    }
}


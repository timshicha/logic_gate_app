

class CircuitBoard {
    public wirePairs;
    public andGates;
    public orGates;
    public notGates;
    public inputs;
    public lights;

    constructor() {
        this.wirePairs = [];
        this.andGates = [];
        this.orGates = [];
        this.notGates = [];
        this.inputs = [];
        this.lights = [];
    }

    public addWire = (x1, y1, x2, y2) => {
        this.wirePairs.push([x1, y1, x2, y2]);
        this.wirePairs.push([x2, y2, x1, y1]);
    }

    public addObject = (obj, x, y) => {
        if(obj === "AND") {
            this.andGates.push([x, y]);
        }
        else if(obj === "OR") {
            this.orGates.push([x, y]);
        }
        else if(obj === "NOT") {
            this.notGates.push([x, y]);
        }
        else if (obj === "inputs") {
            this.inputs.push([x, y]);
        }
        else if(obj === "lights") {
            this.lights.push([x, y]);
        }
        else {
            console.log("Class CircuitBoard: invalid object passed to addObject:", obj);
        }
    }
}



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

    // Clears a grid spot: wires that start/end and objects centered on this grid spot
    // will be removed;
    public clearSelection(x, y) {
        // Find wires that start/end here
        for (let i = this.wirePairs.length; i >= 0; i--) {
            // If wire start or end matches
            if((this.wirePairs[i][0] === x && this.wirePairs[i][1] === y) ||
                (this.wirePairs[i][2] === x && this.wirePairs[i][3] === y)){
                this.wirePairs.splice(i, 1);
            }
        }
        // Find objects that are centered here
        function removeMatches(array, x, y) {
            for (let i = array.length; i >= 0; i--) {
                if(array[i][0] === x &&array[i][1] === y) {
                    array.splice(i, 1);
                }
            }
        }
        removeMatches(this.andGates, x, y);
        removeMatches(this.orGates, x, y);
        removeMatches(this.notGates, x, y);
        removeMatches(this.inputs, x, y);
        removeMatches(this.lights, x, y);
    }
}

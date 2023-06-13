
export class CircuitBoard {

    public objects;
    public power;
    public switches;
    public width;
    public height;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        // Create a matrix. Each cell contains everything that's part of that cell.
        this.resetBoard();
    }

    public addSwitch = (x, y) => {
        this.switches.push([x, y, 0]);
    }

    public toggleSwitch = (switchX, switchhY, switchPower: 0 | 1 | null = null) => {
        // Find the switch
        for (let currentSwitch of this.switches) {
            if(currentSwitch[0] === switchX && currentSwitch[1] === switchhY) {
                // If switch power not provied, flip the switch
                if(switchPower === null) {
                    if(currentSwitch[2] === 0) {
                        currentSwitch[2] = 1;
                    }
                    else {
                        currentSwitch[2] = 0;
                    }
                }
                else {
                    currentSwitch[2] = switchPower;
                }
                return;
            }
        }
        console.log("Switch to toggle not found.");
    }

    public addObject = (obj, x, y, x2=null, y2=null) => {
        if(obj === "wire") {
            this.objects[x][y].push(["wire", x2, y2, 0]);
            this.objects[x2][y2].push(["wire", x, y, 0]);
        }
        else {
            this.objects[x][y].push([obj, x, y, 0]);
        }
    }

    public resetPower = () => {
        for (let i = 0; i < this.power.length; i++) {
            for (let j = 0; j < this.power[0].length; j++) {
                this.power[i][j] = 0;
                for (let object of this.objects[i][j]) {
                    object[3] = 0;
                }
            }
        }
    }

    public propogatePower = () => {
        this.resetPower();

        // Start by sending signals from the switches:
        for (let currentSwitch of this.switches) {
            this.power[currentSwitch[0]][currentSwitch[1] + 1] = currentSwitch[2];
        }

        let iterations = 0;
        // Iterate propogating to neighbors until no one propogates anything:
        let propogated = true;
        while(propogated) {
            propogated = false;

            // For each row
            for (let i = 0; i < this.objects.length; i++) {
                // For each column
                for (let j = 0; j < this.objects[0].length; j++) {
                    // For each cell
                    for (let object of this.objects[i][j]) {
                        // If wire
                        if(object[0] === "wire") {
                            // If this endpoint is on, but the other isn't, turn other on
                            if(this.power[i][j] && !this.power[object[1]][object[2]]) {
                                this.power[object[1]][object[2]] = 1;
                                object[3] = 1;
                                propogated = true;
                            }
                            // If this endpoint is on but the wire isn't on, turn on wire
                            if(this.power[i][j] && object[3] === 0) {
                                object[3] = 1;
                                propogated = true;
                            }
                        }
                        // If AND gate
                        else if(object[0] === "AND") {
                            // If both inputs on and output isn't, propograte
                            if(this.power[i - 1][j - 1] && this.power[i + 1][j - 1] && !this.power[i][j + 1]) {
                                this.power[i][j + 1] = 1;
                                object[3] = 1;
                                propogated = true;
                            }
                        }
                        // If OR gate
                        else if(object[0] === "OR") {
                            // If either input is on and output isn't, propogate
                            if((this.power[i - 1][j - 1] || this.power[i + 1][j - 1]) && !this.power[i][j + 1]) {
                                this.power[i][j + 1] = 1;
                                object[3] = 1;
                                propogated = true;
                            }
                        }
                        // If NOT gate
                        else if(object[0] === "NOT") {
                            // If input is 0, then output should be 1
                            if(this.power[i][j - 1] === 0) {
                                // Turn on gate
                                object[3] = 1;
                                // Propogate if need be
                                if(this.power[i][j + 1] === 0) {
                                    this.power[i][j + 1] = 1;
                                    propogated = true;
                                }
                            }
                            // If input is 1, then output should be 0
                            else if(this.power[i][j - 1] === 1) {
                                // Turn off gate
                                object[3] = 0;
                                // Propogate if need be
                                if(this.power[i][j + 1] === 1) {
                                    this.power[i][j + 1] = 0;
                                    propogated = true;
                                }
                            }
                        }
                        // If light
                        else if(object[0] === "light") {
                            // If light is not what is should be
                            if(object[3] === 0 && this.power[i + 1][j] === 1) {
                                object[3] = 1;
                                propogated = true;
                            }
                            else if(object[3] === 1 && this.power[i + 1][j] === 0) {
                                object[3] = 0;
                                propogated = true;
                            }
                        }
                    }
                }
            }
            // If we reached 1000 iterations, there's probably a loop:
            if(++iterations >= 1000) {
                return false;
            }
        }
        return true;
    }

    public resetBoard = () => {
        this.objects = new Array(this.height);
        this.power = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.objects[i] = new Array(this.width);
            this.power[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.objects[i][j] = [];
                this.power[i][j] = 0;
            }
        }
        this.switches = [];
    }
}

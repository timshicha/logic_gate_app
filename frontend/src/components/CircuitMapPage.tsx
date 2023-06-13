import React, { Component, useEffect, useRef, useState } from "react";
import { COLORS } from "@/utils/constants.tsx";
import { CircuitBoard } from "@/utils/circuitLogic.tsx";

// How many "blocks" the canvas should be. The more blocks, the
// bigger the grid. This allows the user to place gates and wires
// on a bigger board.
const CANVAS_UNITS = 40;
// How many pixels each "block" should be.
const UNIT_SIZE = 15;
let toolInHand = "wire";
const switchPositions = [[2, 5], [2, 15], [2, 25], [2, 35]];
const lightPosition = [20, CANVAS_UNITS - 2];

export function CircuitMapPage() {

	const mainCanvasRef = useRef(null);
	const gridCanvasRef = useRef(null);
	const hintCanvasRef = useRef(null);
	const [wireStart, setWireStart] = useState([null, null]);
	// Where the user's last coordinates were
	const [clientPos, setClientPost] = useState([0, 0]);
	const [circuitBoard] = useState(new CircuitBoard(CANVAS_UNITS, CANVAS_UNITS));

	useEffect(() => {
		// Add a listener to detect canvas clicks
		mainCanvasRef.current.addEventListener("mousedown", handleCanvasClick);
		mainCanvasRef.current.addEventListener("mousemove", event => handleCanvasMove(event));
		return () => {
			mainCanvasRef.current.removeEventListener("mousedown", handleCanvasClick);
			mainCanvasRef.current.removeEventListener("mousemove", event => handleCanvasMove(event));
		}
	}, []);

	function resetBoard() {
		circuitBoard.resetBoard();
		// Add switches
		for (let currentSwitch of switchPositions) {
			circuitBoard.addSwitch(currentSwitch[1], currentSwitch[0]);
		}
		// Add light
		circuitBoard.addObject("light", lightPosition[0], lightPosition[1]);
	}

	// Remove all gates and wires from canvas
	function resetCanvas(canvas) {
		// Draw the grid lines on the grid canvas
		function drawCanvasGridLines(color) {
			const context = gridCanvasRef.current.getContext("2d");
			context.reset();
			context.beginPath();
			// Draw horizontal lines
			for (let i = 0; i <= CANVAS_UNITS; i++) {
				context.moveTo(0, i * UNIT_SIZE);
				context.lineTo(CANVAS_UNITS * UNIT_SIZE, i * UNIT_SIZE);
			}
			// Draw vertical lines
			for (let i = 0; i <= CANVAS_UNITS; i++) {
				context.moveTo(i * UNIT_SIZE, 0);
				context.lineTo(i * UNIT_SIZE, CANVAS_UNITS * UNIT_SIZE);
			}
			context.strokeStyle = color;
			context.lineWidth = 0.1;
			context.stroke();
		}

		drawCanvasGridLines(gridCanvasRef.current);
		const context = canvas.getContext("2d");
		// context.clearRect(0, 0, gridCanvasRef.current.width, gridCanvasRef.current.height);
		context.reset();
		// Add switches to board
		for (let currentSwitch of switchPositions) {
			circuitBoard.addSwitch(currentSwitch[1], currentSwitch[0]);
		}
		// Add light to board
		circuitBoard.addObject("light", lightPosition[1], lightPosition[0]);
	}

	// Given two coordinates on the canvas, find the nearest grid intersection and
	// return its x and y.
	function readCanvasClick(x, y) {
		// Round nearest reference: https://1loc.dev/math/round-a-number-to-the-nearest-multiple-of-a-given-value/
		function roundNearest (value, nearest) {
			return Math.round(value / nearest) * nearest;
		}
		let coords = [(roundNearest(x, UNIT_SIZE) / UNIT_SIZE), (roundNearest(y, UNIT_SIZE) / UNIT_SIZE)];
		return coords;
	}

	function handleCanvasClick() {

		// See if they clicked on a switch. If they did, toggle the switch.
		// Go through each switch position
		for (let i = 0; i < switchPositions.length; i++) {
			if(clientPos[0] === switchPositions[i][0] && clientPos[1] === switchPositions[i][1]) {
				circuitBoard.toggleSwitch(switchPositions[i][1], switchPositions[i][0]);
				circuitBoard.propogatePower();
				refreshCanvas();
				return;
			}
		}

		// If a wire is in hand, special treatment
		if(toolInHand === "wire") {
			// If no first point selected, select this as first point
			if(wireStart[0] === null || wireStart[1] === null) {
				wireStart[0] = clientPos[0];
				wireStart[1] = clientPos[1];
			}
			// If selected the same point, cancel wire placement
			else if (wireStart[0] === clientPos[0] && wireStart[1] === clientPos[1]) {
				wireStart[0] = null;
				wireStart[1] = null;
				hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
			}
			// Otherwise, place the wire
			else {
				// Clear hint canvas
				hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);

				circuitBoard.addObject("wire", wireStart[1], wireStart[0], clientPos[1], clientPos[0]);
				draw(mainCanvasRef.current, toolInHand, wireStart[0], wireStart[1], clientPos[0], clientPos[1], 0, false);
				wireStart[0] = null;
				wireStart[1] = null;
			}
		}
		else {
			// Clear hint canvas
			hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
			circuitBoard.addObject(toolInHand, clientPos[1], clientPos[0]);
			draw(mainCanvasRef.current, toolInHand, clientPos[0],clientPos[1], null, null, 0, false);
		}
		circuitBoard.propogatePower();
		refreshCanvas();
	}

	// When the user moves in the canvas, see if they hovered over a new grid intersection.
	// If so, update the canvas.
	function handleCanvasMove(event) {
		const rect = hintCanvasRef.current.getBoundingClientRect();
		const coordX = event.clientX - rect.left;
		const coordY = event.clientY - rect.top;
		let [x, y] = readCanvasClick(coordX, coordY);
		if(x !== clientPos[0] || y !== clientPos[y]) {
			clientPos[0] = x;
			clientPos[1] = y;
			hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);

			// See if they hovered over a switch. If they did, do not show their
			// tool to make it clear that they are not placing down a gate / wire.
			for (let i = 0; i < switchPositions.length; i++) {
				if(clientPos[0] === switchPositions[i][0] && clientPos[1] === switchPositions[i][1]) {
					return;
				}
			}

			// Wires get special treatment
			if(toolInHand === "wire") {
				// If we have a wire start
				if(wireStart[0] !== null && wireStart[1] !== null) {
					draw(hintCanvasRef.current, toolInHand, wireStart[0], wireStart[1], clientPos[0], clientPos[1], 0, true);
				}
				else {
					draw(hintCanvasRef.current, toolInHand, clientPos[0], clientPos[1], clientPos[0], clientPos[1], 0, true);
				}
			}
			else {
				draw(hintCanvasRef.current, toolInHand, clientPos[0], clientPos[1], null, null, 0, true);
			}
		}
	}

	// Draw the circuit in the CircuitBoard object on to the canvas.
	// Note: the canvas will be reset first.
	function refreshCanvas() {
		const canvas = mainCanvasRef.current;
		const context = canvas.getContext("2d");
		context.reset();

		// DRAW WIRES FIRST SO THEY DON'T COVER GATES
		// For each row
		for (let i = 0; i < circuitBoard.objects.length; i++) {
			// For each cell
			for (let j = 0; j < circuitBoard.objects[0].length; j++) {
				// For each object
				for (let object of circuitBoard.objects[i][j]) {
					if(object[0] === "wire") {
						draw(mainCanvasRef.current, "wire", j, i, object[2], object[1], object[3]);
					}
					else {
						draw(mainCanvasRef.current, object[0], j, i, null, null, object[3]);
					}
				}
			}
		}
		// DRAW GATES
		// For each row
		for (let i = 0; i < circuitBoard.objects.length; i++) {
			// For each cell
			for (let j = 0; j < circuitBoard.objects[0].length; j++) {
				// For each object
				for (let object of circuitBoard.objects[i][j]) {
					if(object[0] !== "wire") {
						draw(mainCanvasRef.current, object[0], j, i, null, null, object[3]);
					}
				}
			}
		}
		// Draw switches
		const letters = ["A", "B", "C", "D"];
		for (let i = 0; i < circuitBoard.switches.length; i++) {
			const currentSwitch = circuitBoard.switches[i];
			drawSwitch(canvas, currentSwitch[1], currentSwitch[0], letters[i], currentSwitch[2]);
		}
	}

	// Draw a switch on the canvas
	function drawSwitch(canvas, x, y, text, power= 0) {
		const context = canvas.getContext("2d");
		context.lineWidth = 4;

		context.strokeStyle = COLORS.BLACK;
		context.moveTo((x + 1) * UNIT_SIZE, y * UNIT_SIZE);
		context.lineTo((x + 0.5) * UNIT_SIZE, y * UNIT_SIZE);
		context.stroke();
		context.beginPath();
		context.lineTo((x + 0.5) * UNIT_SIZE, (y - 1) * UNIT_SIZE);
		context.lineTo((x - 1) * UNIT_SIZE, (y - 1) * UNIT_SIZE);
		context.lineTo((x - 1) * UNIT_SIZE, (y + 1) * UNIT_SIZE);
		context.lineTo((x + 0.5) * UNIT_SIZE, (y + 1) * UNIT_SIZE);
		context.closePath();
		if(power) {
			context.fillStyle = COLORS.YELLOW;
			context.fill();
		}
		context.stroke();
		context.font = "20px Arial";
		context.textAlign = "center";
		context.fillStyle = COLORS.BLACK;
		context.fillText(text, (x - 1/3) * UNIT_SIZE, (y + 0.5) * UNIT_SIZE);
	}

	// Draw the specified shape.
	// If wire, x2 and y2 must also be specified.
	function draw(canvas, obj, x1, y1, x2, y2, power=0, hint=false) {
		const context = canvas.getContext("2d");
		context.lineWidth = 4;

		context.beginPath();
		if(obj === "AND") {
			context.moveTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			if(power) {
				context.fillStyle = COLORS.YELLOW;
				context.fill();
			}
			context.strokeStyle = COLORS.BLACK;
			if(hint) {
				context.strokeStyle = COLORS.DARK_GRAY;
			}
			context.stroke();
		}
		else if(obj === "OR") {
			context.arc((x1 - 2) * UNIT_SIZE, y1 * UNIT_SIZE, 1.5 * UNIT_SIZE, 7 * Math.PI / 4 + 0.05, Math.PI / 4 - 0.05, false);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			if(power) {
				context.fillStyle = COLORS.YELLOW;
				context.fill();
			}
			context.strokeStyle = COLORS.BLACK;
			if(hint) {
				context.strokeStyle = COLORS.DARK_GRAY;
			}
			context.stroke();
		}
		else if(obj === "NOT") {
			context.moveTo((x1 + 1/3) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.closePath();
			context.fillStyle = COLORS.YELLOW;
			if(power && !hint) {
				context.fill();
			}
			context.strokeStyle = COLORS.BLACK;
			if(hint) {
				context.strokeStyle = COLORS.DARK_GRAY;
			}
			context.stroke();
			context.beginPath();
			context.arc((x1 + 2/3) * UNIT_SIZE, y1 * UNIT_SIZE, 1/3 * UNIT_SIZE, Math.PI, 4 * Math.PI, false);
			context.closePath();
			if(power && !hint) {
				context.fill();
			}
			context.stroke();
		}
		else if(obj === "light") {
			context.moveTo(x1 * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.lineTo(x1 * UNIT_SIZE, (y1 + 0.5) * UNIT_SIZE);
			context.strokeStyle = COLORS.BLACK;
			if(hint) {
				context.strokeStyle = COLORS.DARK_GRAY;
			}
			context.stroke();
			context.beginPath();
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 0.5) * ( UNIT_SIZE));
			context.lineTo((x1 - 1) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, 1 * UNIT_SIZE, Math.PI, 0, false);
			context.lineTo((x1 + 1) * UNIT_SIZE, (y1 + 0.5) * UNIT_SIZE);
			context.closePath();
			if(power) {
				context.fillStyle = COLORS.LIGHT_YELLOW;
			}
			else {
				context.fillStyle = COLORS.DARK_GRAY;
			}
			context.fill();
			context.stroke();
		}
		else if(obj === "wire") {
			context.lineWidth = 2;
			context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, 0.125 * UNIT_SIZE, 0, 2 * Math.PI);
			context.strokeStyle = COLORS.BLACK;
			context.fillStyle = COLORS.BLACK;
			if(hint) {
				context.strokeStyle = COLORS.DARK_GRAY;
				context.fillStyle = COLORS.DARK_GRAY;
			}
			if(power) {
				context.strokeStyle = COLORS.YELLOW;
				context.fillStyle = COLORS.YELLOW;
			}
			context.stroke();
			context.fill();
			context.beginPath();
			context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
			context.stroke();
			context.fill();
			context.beginPath();
			context.arc(x2 * UNIT_SIZE, y2 * UNIT_SIZE, 0.125 * UNIT_SIZE, 0, 2 * Math.PI);
			context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
			context.stroke();
			context.fill();
		}
		else {
			alert("Cannot draw an object that does not exist");
		}
	}

	return (
		<>
			Circuit Map Page
			<br />
			<button onClick={() => {resetCanvas(mainCanvasRef.current)}}>Setup board</button>
			<br />
			<button onClick={() => {resetBoard()}}>Reset board obj</button>
			<br />

			<div>
				<button onClick={() => toolInHand = "AND"}>AND</button>
				<button onClick={() => toolInHand = "OR"}>OR</button>
				<button onClick={() => toolInHand = "NOT"}>NOT</button>
				<button onClick={() => toolInHand = "wire"}>Wire</button>
				<button onClick={() => toolInHand = "light"}>Light</button>
			</div>
			<br />

			<button onClick={() => {console.log(circuitBoard.objects)}}>List objects</button>
			<button onClick={() => {circuitBoard.propogatePower()}}>Propogate</button>
			<button onClick={refreshCanvas}>Draw canvas</button>

			<div className="relative">
				<canvas ref={gridCanvasRef} className="bg-red-600 absolute pointer-events-none" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
				<canvas ref={mainCanvasRef} className="absolute" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
				<canvas ref={hintCanvasRef} className="absolute pointer-events-none" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
			</div>
		</>
	);
}

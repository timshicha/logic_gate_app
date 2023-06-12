import React, {useEffect, useRef, useState} from "react";
import { COLORS } from "@/utils/constants.tsx";

let toolInHand = "wire";
let c = 0;

export function CircuitMapPage() {


	// How many "blocks" the canvas should be. The more blocks, the
	// bigger the grid. This allows the user to place gates and wires
	// on a bigger board.
	const CANVAS_UNITS = 10;
	// How many pixels each "block" should be.
	const UNIT_SIZE = 70;
	const mainCanvasRef = useRef(null);
	const gridCanvasRef = useRef(null);
	const hintCanvasRef = useRef(null);
	const [wireStart, setWireStart] = useState(null);
	// Where the user's last coordinates were
	let clientX = 0;
	let clientY = 0;

	useEffect(() => {
		// Add a listener to detect canvas clicks
		mainCanvasRef.current.addEventListener("mousedown", event => handleCanvasClick(event));
		mainCanvasRef.current.addEventListener("mousemove", event => handleCanvasMove(event));

		return () => {
			mainCanvasRef.current.removeEventListener("mousedown", event => handleCanvasClick(event));
			mainCanvasRef.current.removeEventListener("mousemove", event => handleCanvasMove(event));
		}
	});

	function clearCanvas(canvas) {
		canvas.getContext("2d").clearRect(0, 0, gridCanvasRef.current.width, gridCanvasRef.current.height);
	}

	// Given two coordinates on the canvas, find the nearest grid intersection and
	// return its x and y.
	function readCanvasClick(x, y) {
		// Round nearest reference: https://1loc.dev/math/round-a-number-to-the-nearest-multiple-of-a-given-value/
		function roundNearest (value, nearest) {
			return Math.round(value / nearest) * nearest;
		}
		return [(roundNearest(x, UNIT_SIZE) / UNIT_SIZE), (roundNearest(y, UNIT_SIZE) / UNIT_SIZE)];
	}

	function handleCanvasClick(event) {
		// The following code detects canvas clicks.
		// Reference: https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
		const rect = mainCanvasRef.current.getBoundingClientRect();
		const coordX = event.clientX - rect.left;
		const coordY = event.clientY - rect.top;

		let [x, y] = readCanvasClick(coordX, coordY);

		// If a wire is in hand, special treatment
		if(toolInHand === "wire") {
			// If no first point selected, select this as first point
			if(wireStart === null) {
				setWireStart([x, y]);
			}
			// If selected the same point, cancel wire placement
			else if (wireStart[0] === x && wireStart[1] === y) {
				setWireStart(null);
				hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
			}
			// Otherwise, place the wire
			else {
				draw(mainCanvasRef.current, toolInHand, wireStart[0], wireStart[1], x, y, COLORS.BLACK);
				setWireStart(null);
				hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
			}
		}
		else {
			// Clear hint canvas
			draw(mainCanvasRef.current, toolInHand, x,y, null, null, COLORS.BLACK);
			hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
		}
	}

	// When the user moves in the canvas, see if they hovered over a new grid intersection.
	// If so, update the canvas.
	function handleCanvasMove(event) {
		const rect = hintCanvasRef.current.getBoundingClientRect();
		const coordX = event.clientX - rect.left;
		const coordY = event.clientY - rect.top;
		let [x, y] = readCanvasClick(coordX, coordY);
		if(x !== clientX || y !== clientY) {
			clientX = x;
			clientY = y;
			console.log("new x and y:", x, y);
			hintCanvasRef.current.getContext("2d").clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
			// Wires get special treatment
			if(toolInHand === "wire") {
				if(wireStart) {
					draw(hintCanvasRef.current, toolInHand, wireStart[0], wireStart[1], x, y, COLORS.DARK_GRAY);
				}
			}
			else {
				draw(hintCanvasRef.current, toolInHand, x, y, null, null, COLORS.DARK_GRAY);
			}
		}
	}

	// Draw the grid lines on the canvas
	function drawCanvasGridLines(color) {
		const context = gridCanvasRef.current.getContext("2d");
		context.clearRect(0, 0, gridCanvasRef.current.width, gridCanvasRef.current.height);
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

	// Draw the specified shape.
	// If wire, x2 and y2 must also be specified.
	function draw(canvas, obj, x1, y1, x2, y2, color) {
		const context = canvas.getContext("2d");
		function strokeAndFill () {
			context.strokeStyle = color;
			context.fillStyle = color;
			context.lineWidth = 1;
			context.stroke();
			context.fill();
			context.closePath();
		}

		context.beginPath();
		if(obj === "AND") {
			context.moveTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			strokeAndFill();
		}
		else if(obj === "OR") {
			context.arc((x1 - 2) * UNIT_SIZE, y1 * UNIT_SIZE, 1.5 * UNIT_SIZE, 7 * Math.PI / 4 + 0.05, Math.PI / 4 - 0.05, false);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			strokeAndFill();
		}
		else if(obj === "NOT") {
			context.moveTo((x1 + 0.5) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.lineTo((x1 + 1/3) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.arc((x1 + 2/3) * UNIT_SIZE, y1 * UNIT_SIZE, 1/3 * UNIT_SIZE, Math.PI, 4 * Math.PI, false);
			strokeAndFill();
		}
		else if(obj === "wire") {
			context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, 0.125 * UNIT_SIZE, 0, 2 * Math.PI);
			strokeAndFill();
			context.beginPath();
			context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
			strokeAndFill();
			context.beginPath();
			context.arc(x2 * UNIT_SIZE, y2 * UNIT_SIZE, 0.125 * UNIT_SIZE, 0, 2 * Math.PI);
			context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
			console.log(c++);
			strokeAndFill();
		}
		context.closePath();
	}


	return (
		<>
			Circuit Map Page
			<br />
			<button onClick={() => drawCanvasGridLines(COLORS.GRAY)}>Set up</button>
			<button onClick={() => {clearCanvas(mainCanvasRef.current)}}>Clear canvas</button>
			<br />

			<div>
				<button onClick={() => toolInHand = ("AND")}>AND</button>
				<button onClick={() => toolInHand = ("OR")}>OR</button>
				<button onClick={() => toolInHand = ("NOT")}>NOT</button>
				<button onClick={() => toolInHand = ("wire")}>Wire</button>
			</div>
			<br />

			<div className="relative">
				<canvas ref={gridCanvasRef} className="bg-red-600 absolute pointer-events-none" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
				<canvas ref={mainCanvasRef} className="absolute" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
				<canvas ref={hintCanvasRef} className="absolute pointer-events-none" width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
			</div>
		</>
	);
}

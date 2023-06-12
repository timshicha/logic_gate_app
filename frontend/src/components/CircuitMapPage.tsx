import React, {useEffect, useRef, useState} from "react";
import { COLORS } from "@/utils/constants.tsx";

export function CircuitMapPage() {


	// How many "blocks" the canvas should be. The more blocks, the
	// bigger the grid. This allows the user to place gates and wires
	// on a bigger board.
	const CANVAS_UNITS = 40;
	// How many pixels each "block" should be.
	const UNIT_SIZE = 15;
	const canvasRef = useRef(null);

	useEffect(() => {
		// Add a listener to detect canvas clicks
		canvasRef.current.addEventListener("mousedown", event => handleCanvasClick(event));

		return () => {
			canvasRef.current.removeEventListener("mousedown", event => handleCanvasClick(event));
		}
	});

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
		const rect = canvasRef.current.getBoundingClientRect();
		const coordX = event.clientX - rect.left;
		const coordY = event.clientY - rect.top;

		let [x, y] = readCanvasClick(coordX, coordY);
		console.log(x, y);
	}

	// Draw the grid lines on the canvas
	function drawCanvasGridLines(color) {
		const context = canvasRef.current.getContext("2d");
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
		context.lineWidth = 0.3;
		context.stroke();
	}

	// Draw the specified shape.
	// If wire, x2 and y2 must also be specified.
	function draw(obj, x1, y1, x2, y2, color) {
		const context = canvasRef.current.getContext("2d");
		context.beginPath();
		if(obj === "AND") {
			context.moveTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
		}
		else if(obj === "OR") {
			context.arc((x1 - 2) * UNIT_SIZE, y1 * UNIT_SIZE, 1.5 * UNIT_SIZE, 7 * Math.PI / 4 + 0.05, Math.PI / 4 - 0.05, false);
			context.arc(x1 * UNIT_SIZE, y1 * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
		}
		else if(obj === "NOT") {
			context.moveTo((x1 + 0.5) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 - 1) * UNIT_SIZE);
			context.lineTo((x1 - 1) * UNIT_SIZE, (y1 + 1) * UNIT_SIZE);
			context.lineTo((x1 + 0.5) * UNIT_SIZE, y1 * UNIT_SIZE);
			context.arc((x1 + 0.75) * UNIT_SIZE, y1 * UNIT_SIZE, 0.25 * UNIT_SIZE, Math.PI, 3 * Math.PI, false);

		}
		else if(obj === "wire") {
			context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
			context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
		}
		context.strokeStyle = color;
		context.fillStyle = color;
		context.lineWidth = 1;
		context.stroke();
		context.fill();
	}

	function place() {
		const x1 = parseInt(document.getElementById("x1").value);
		const x2 = parseInt(document.getElementById("x2").value);
		const y1 = parseInt(document.getElementById("y1").value);
		const y2 = parseInt(document.getElementById("y2").value);
		const item = document.getElementById("item").value;

		draw(item, x1, y1, x2, y2, COLORS.BLACK);

		console.log(x1, x2, y1, y2, item);
	}

	return (
		<>
			Circuit Map Page
			<br />
			<button onClick={() => drawCanvasGridLines(COLORS.GRAY)}>Set up</button>
			<br />
			x1: <input type="number" id="x1"/>
			<br />
			y1: <input type="number" id="y1"/>
			<br />
			x1: <input type="number" id="x2"/>
			<br />
			y1: <input type="number" id="y2"/>
			<br />
			item: <select name="item" id="item">
				<option value="AND" >AND</option>
				<option value="OR" >OR</option>
				<option value="NOT" >NOT</option>
				<option value="wire" >wire</option>
			</select>
			<br />
			<button className="bg-gray-600" onClick={place}>Place</button>

			<canvas ref={canvasRef} className={`bg-red-600`} width={CANVAS_UNITS * UNIT_SIZE} height={CANVAS_UNITS * UNIT_SIZE}></canvas>
		</>
	);
}

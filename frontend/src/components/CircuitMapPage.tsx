import React, { useRef, useState } from "react";

export function CircuitMapPage() {

	// How many "blocks" the canvas should be. The more blocks, the
	// bigger the grid. This allows the user to place gates and wires
	// on a bigger board.
	const CANVAS_UNITS = 35;
	// How many pixels each "block" should be.
	const UNIT_SIZE = 20;
	const canvasRef = useRef(null);

	// Place a wire given two coordinates
	function placeWire(x1, y1, x2, y2) {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.beginPath();
		context.moveTo(x1 * UNIT_SIZE, y1 * UNIT_SIZE);
		context.lineTo(x2 * UNIT_SIZE, y2 * UNIT_SIZE);
		context.strokeStyle = "#000000";
		context.fillStyle = "#000000";
		context.lineWidth = 3;
		context.stroke();
	}

	function placeAnd(x, y) {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.beginPath();
		context.moveTo((x - 1) * UNIT_SIZE, (y - 1) * UNIT_SIZE);
		context.lineTo((x - 1) * UNIT_SIZE, (y + 1) * UNIT_SIZE);
		context.arc(x * UNIT_SIZE, y * UNIT_SIZE, UNIT_SIZE, Math.PI / 2, 3 * Math.PI / 2, true);
		context.lineTo((x - 1) * UNIT_SIZE, (y - 1) * UNIT_SIZE);
		context.strokeStyle = "#000000";
		context.fillStyle = "#000000";
		context.lineWidth = 3;
		context.stroke();
		context.fill();
	}

	function place() {
		const x1 = parseInt(document.getElementById("x1").value);
		const x2 = parseInt(document.getElementById("x2").value);
		const y1 = parseInt(document.getElementById("y1").value);
		const y2 = parseInt(document.getElementById("y2").value);
		const item = document.getElementById("item").value;

		if(item === "wire") {
			placeWire(x1, y1, x2, y2);
		}
		else if(item === "AND") {
			placeAnd(x1, y1);
		}
		console.log(x1, x2, y1, y2, item);
	}

	return (
		<>
			Circuit Map Page
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

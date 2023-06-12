import React, { useRef, useState } from "react";

export function CircuitMapPage() {

	const TABLE_SIZE = 30;

	const tableRef = useRef(null);
	const circuitTable = useState(Array(TABLE_SIZE).fill(null).map(() => Array(TABLE_SIZE).fill(null)));

	function setupUI() {

		function circleClick(x, y) {

		}

		function createClickableCircle(x, y) {
			const clickableCircle = (
				<input type="button" className="w-[10px] h-[10px]" onClick={() => circleClick(x, y)}/>
			);
		}

		let table = tableRef.current;
		// If the table grid was previously set up, reset it. Remove every
		// child of the table.
		while(table.firstChild) {
			table.removeChild(table.firstChild);
		}

		// Create the rows
		for (let i = 0; i < 30; i++) {
			let row = table.insertRow(i);
			for (let j = 0; j < 30; j++) {
				row.insertCell(j);
			}
		}



	}

	return (
		<>
			Circuit Map Page
			<br />
			<button onClick={() => setupUI()}>reset table</button>
			<div>
				<table ref={tableRef} className="bg-red-600"></table>
			</div>
		</>
	);
}

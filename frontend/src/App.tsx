import "/src/assets/css/LogicGateStyles.css";
import React from "react";
import Navbar from "@/components/Navbar.tsx";

export function App() {
	return (
		<>
			<Navbar></Navbar>
			<p>App page</p>
			<p>The app element is showing</p>
			<p className="text-red-400">If this is red, tailwind is working</p>
		</>
	);
}

export default App;

import {HomePage} from "@/components/HomePage.tsx";
import {CircuitMapPage} from "@/components/CircuitMapPage.tsx";
import {MyMapsPage} from "@/components/MyMapsPage.tsx";
import { Navbar } from "@/components/Navbar";
import { Route, Routes } from "react-router-dom";

export function LogicGateRoutes() {
	return (
		<div>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/mymaps" element={<MyMapsPage />} />
				<Route path="/circuitmap" element={<CircuitMapPage />} />
			</Routes>
		</div>
	);
}

import {CreateAccountPage} from "@/components/CreateAccountPage.tsx";
import {HomePage} from "@/components/HomePage.tsx";
import {CircuitMapPage} from "@/components/CircuitMapPage.tsx";
import {LoginPage} from "@/components/LoginPage.tsx";
import {MyMapsPage} from "@/components/MyMapsPage.tsx";
import { Navbar } from "@/components/Navbar";
import { Route, Routes } from "react-router-dom";

export function LogicGateRoutes() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/mymaps" element={<MyMapsPage />} />
				<Route path="/circuitmap" element={<CircuitMapPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/createaccount" element={<CreateAccountPage />} />
			</Routes>
		</div>
	);
}

import "/src/assets/css/LogicGateStyles.css";
import {LogicGateRoutes} from "@/LogicGateRoutes.tsx";
import React, {Suspense} from "react";
import { BrowserRouter} from "react-router-dom";

export function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading....</div>}>
				<LogicGateRoutes />
			</Suspense>
		</BrowserRouter>
	);
}

export default App;

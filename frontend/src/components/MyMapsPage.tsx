import {RetriveAllMapsService} from "@/Services/MapServices.tsx";
import React, {useState} from "react";
import {Navigate} from "react-router-dom";

export function MyMapsPage() {
	
	// See if email is set:
	let email = localStorage.getItem("email");
	const [navigateToLogin, setNavigateToLogin] = useState(email ? false : true);
	// Otherwise, try loading maps
	const [mapTitles] = useState([]);
	getMapList();
	
	
	async function getMapList() {
		// Try getting the user's maps.
		// If error, user has error with email/auth.
		try {
			const result = await RetriveAllMapsService(email);
			mapTitles.length = 0;
			for (let i of result.data) {
				mapTitles.push(i);
			}
			console.log(mapTitles);
		} catch(err) {
			localStorage.removeItem("email");
			setNavigateToLogin(true);
		}
	}
	
	return (
		<>
			{navigateToLogin && <Navigate to="/login" />}
			My Maps Page
			<br />
		</>
	);
}

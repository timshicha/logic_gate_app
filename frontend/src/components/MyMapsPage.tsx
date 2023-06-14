import {RetriveAllMapsService, DeleteMapService} from "@/Services/MapServices.tsx";
import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import delete_img from "@/assets/images/delete.svg";

export function MyMapsPage() {
	
	// See if email is set:
	let email = localStorage.getItem("email");
	const [navigateToLogin, setNavigateToLogin] = useState(email ? false : true);
	// Otherwise, try loading maps
	const [mapTitles] = useState([]);
	const [mapsHTML, setMapsHTML] = useState(<></>);
	const [navigateToMap, setNavigateToMap] = useState(false);
	
	useEffect(() => {
		getMapList();
	}, []);
	
	
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
			createHTMLCode();
		} catch(err) {
			localStorage.removeItem("email");
			setNavigateToLogin(true);
		}
	}
	
	function goToMapPage(mapTitle) {
		sessionStorage.setItem("mapTitle", mapTitle);
		setNavigateToMap(true);
	}
	
	async function deleteMap(mapTitle) {
		await DeleteMapService(email, mapTitle);
		await getMapList();
	}
	
	function createHTMLCode() {
		setMapsHTML(
			<>
				{mapTitles.map((title) =>
				<li key={title} className={"mt-[10px]"}>
					<button onClick={() => goToMapPage(title)} className={"w-[400px] h-[40px] m-[5px] bg-gray-500 rounded-lg text-lg overflow-hidden align-middle"}>{title}</button>
					<button onClick={() => deleteMap((title))}><img alt={"delete " + title} src={delete_img} className={"w-[50px] h-[50px] m-[5px] rounded-lg bg-red-600 inline-block"}/></button>
				</li>)}
				</>
		);
	}
	
	return (
		<>
			<h1 className="text-[50px]">My Maps</h1>
			{navigateToLogin && <Navigate to="/login" />}
			{navigateToMap && <Navigate to="/circuitmap" />}
			<br />
			<ul>
			{mapsHTML}
			</ul>
		</>
	);
}

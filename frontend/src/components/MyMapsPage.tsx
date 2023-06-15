import {Navbar} from "@/components/Navbar.tsx";
import {RetriveAllMapsService, DeleteMapService, CreateMapService} from "@/Services/MapServices.tsx";
import React, {useEffect, useRef, useState} from "react";
import {Navigate} from "react-router-dom";
import delete_img from "@/assets/images/delete.svg";
import plus_img from "@/assets/images/plus.svg";

export function MyMapsPage() {
	
	// See if email is set:
	let email = localStorage.getItem("email");
	if(!email) {
		return <Navigate to="/login" />;
	}
	const [navigateToLogin, setNavigateToLogin] = useState(false);
	// Otherwise, try loading maps
	const [mapTitles] = useState([]);
	const [mapsHTML, setMapsHTML] = useState(<></>);
	const [navigateToMap, setNavigateToMap] = useState(false);
	const nameFieldRef = useRef(null);
	
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
	
	async function createMap() {
		const mapTitle = nameFieldRef.current.value;
		try {
			await CreateMapService(email, mapTitle);
		} catch(err) {
			alert("Error creating map. This may be because another user already has a map with the same title.");
		}
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
			<Navbar />
			<div className={"bg-gray-200 w-fit h-fit p-[30px] rounded-xl mx-auto mt-[30px]"}>
				<h1 className="text-[50px]">My Maps</h1>
				{navigateToLogin && <Navigate to="/login" />}
				{navigateToMap && <Navigate to="/circuitmap" />}
				<br />
				<ul>
				{mapsHTML}
				</ul>
				<div className={"mt-[25px]"}>
					<input type={"text"} className={"w-[400px] h-[40px] m-[5px] bg-gray-600 rounded-lg text-lg align-middle pl-[5px]"} placeholder="map name" ref={nameFieldRef}/>
					<button onClick={createMap} className={"w-[200px] h-[40px] m-[5px] bg-gray-500 rounded-lg text-lg overflow-hidden align-middle"}>
						<img src={plus_img} alt={"Create map"} className={"absolute h-[30px] ml-[10px]"}/>
						Create Map
					</button>
				</div>
			</div>
		</>
	);
}

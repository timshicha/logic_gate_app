import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";

export function LoginPage() {
	
	const [navigateToMaps, setNavigateToMaps] = useState(localStorage.getItem("email"));
	
	function login () {
		const email = document.getElementById("email").value;
		localStorage.setItem("email", email);
		document.getElementById("email").value;
		window.location.reload();
	}
	
	return (
		<>
			{navigateToMaps &&
				<Navigate to="/mymaps" />
			}
			Login Page
			< br/>
			Email: <input type="email" id="email"/>
			<br />
			<button onClick={login}>login</button>
		</>
	);
}

import React from "react";

export function LoginPage() {
	
	function login () {
		const email = document.getElementById("email").value;
		localStorage.setItem("email", email);
		document.getElementById("email").value = "";
	}
	
	return (
		<>
			Login Page
			< br/>
			Email: <input type="text" id="email"/>
			<br />
			<button onClick={login}>login</button>
		</>
	);
}

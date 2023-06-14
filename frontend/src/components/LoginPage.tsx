import {googleLogin} from "@/Services/AuthServices.tsx";
import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";

export function LoginPage() {
	
	const [navigateToMaps, setNavigateToMaps] = useState(localStorage.getItem("email"));
	
	function login (event) {
		event.preventDefault();
		const email = event.target.email.value;
		console.log(email);
		localStorage.setItem("email", email);
		window.location.reload();
	}
	
	function goToogleLogin() {
		googleLogin();
	}
	
	return (
		<>
			{navigateToMaps &&
				<Navigate to="/mymaps" />
			}
			<form onSubmit={login} className={"w-fit bg-gray-200 p-[20px] rounded-xl mx-auto mt-[20px]"}>
				<h1 className="text-[50px] block text-center">Login</h1>
				<label htmlFor={"loginEmail"} className={"text-[20px]"}>Email: </label>
				<input type="email" id="loginEmail" name="email" className={"w-[400px] h-[40px] m-[5px] bg-gray-600 rounded-lg text-lg align-middle"}/>
				<button type={"submit"} className={"block w-[200px] h-[40px] m-[15px] mx-auto bg-gray-500 rounded-lg text-lg"}>Login</button>
			</form>
			<button onClick={goToogleLogin}>Google login</button>
		</>
	);
}

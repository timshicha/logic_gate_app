import {googleLogin} from "@/Services/AuthServices.tsx";
import {httpClient} from "@/Services/HttpClient.tsx";
import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";

export function LoginPage() {
	
	const [navigateToHome, setNavigateToHome] = useState(false);
	
	async function login (event) {
		event.preventDefault();
		const email = event.target.email.value;
		// Make sure "login" is successful
		try {
			const response = await httpClient.post(import.meta.env.API_URL + "/users", {
				email: email
			});
			localStorage.setItem("email", email);
			setNavigateToHome(true);
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
	}
	
	function goToGoogleLogin() {
		googleLogin();
	}
	
	return (
		<>
			{navigateToHome &&
				<Navigate to="/" />
			}
			<form onSubmit={login} className={"w-fit bg-gray-200 p-[20px] rounded-xl mx-auto mt-[20px]"}>
				<h1 className="text-[50px] block text-center">Login</h1>
				<button onClick={goToGoogleLogin} className={"block w-[200px] h-[40px] m-[15px] mx-auto bg-gray-500 rounded-lg text-lg"}>Login with Google</button>
				<p>While in development, you may also just provide your email to login or sign up.</p>
				<label htmlFor={"loginEmail"} className={"text-[20px]"}>Email: </label>
				<input type="email" id="loginEmail" name="email" className={"w-[400px] h-[40px] m-[5px] bg-gray-600 rounded-lg text-lg align-middle"}/>
				<button type={"submit"} className={"block w-[200px] h-[40px] m-[15px] mx-auto bg-gray-500 rounded-lg text-lg"}>Login</button>
			</form>
		</>
	);
}

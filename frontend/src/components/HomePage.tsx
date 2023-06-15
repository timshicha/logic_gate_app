import {httpClient} from "@/Services/HttpClient.tsx";
import React, {useEffect} from "react";
import circuit_img from "@/assets/images/circuit.svg";

export function HomePage() {
	
	useEffect(() => {
		// If there is an access token in URL params, extract it.
		// We were redirected from Google.
		const paramsStr = "?" + window.location.href.replace(import.meta.env.CLIENT_URL, "").replace("/", "").replace("#", "");
		const params = new URLSearchParams(paramsStr);
		
		if(params.get("access_token")) {
			try {
				fetch("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + params.get("access_token"))
					.then(res => res.json()).then(async res => {
					const email = res.email;
					// Try loggin into app now
					const response = await httpClient.post(import.meta.env.API_URL + "/users", {
						email: email
					});
					localStorage.setItem("email", email);
					window.history.replaceState(null, null, "/");
					window.location.reload();
				});
			} catch (err) {
				window.history.replaceState(null, null, "/");
				window.location.reload();
			}

		}
	}, []);
	
	return (
		<>
			<h1 className={"block text-[50px] m-[20px] text-center"}>Welcome to Logic Page Simulator</h1>
			<hr className={"border-[5px]"}/>
			
			<img src={circuit_img} className={"w-full my-[30px]"}/>
			<p className={"block w-3/4 text-[30px] mt-[30px] mx-auto"}>
				Have you ever wanted to build and simulate a logic circuits? Well,
				you have come to the right place. Have fun!
			</p>
			<img src={circuit_img} className={"w-full my-[40px]"}/>
		</>
	);
}

import React, {useEffect} from "react";
import circuit_img from "@/assets/images/circuit.svg";
import {useSearchParams} from "react-router-dom";

export function HomePage() {
	
	useEffect(() => {
		// If there is an access token in URL params, extract it.
		// We were redirected from Google.
		const paramsStr = "?" + window.location.href.replace(import.meta.env.CLIENT_URL, "").replace("/", "").replace("#", "");
		const params = new URLSearchParams(paramsStr);
		
		if(params.get("access_token")) {
			localStorage.setItem("access_token", params.get("access_token"))
			window.history.replaceState(null, null, "/");
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

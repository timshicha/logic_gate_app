import React from "react";
import circuit_img from "@/assets/images/circuit.svg";

export function HomePage() {
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

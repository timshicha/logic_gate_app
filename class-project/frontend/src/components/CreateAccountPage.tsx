import {Navbar} from "@/components/Navbar.tsx";
import React from "react";

export function CreateAccountPage() {
	return (
		<>
			<Navbar />
			<p className={"w-3/4 text-[30px] mx-auto mt-[30px]"}>For now, to create an account, go to the login page and either enter an email (a Logic Gate Simuator account will be created for you), or log in with Google.</p>
		</>
	);
}

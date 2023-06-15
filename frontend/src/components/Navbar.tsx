import {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import logo_img from "@/assets/images/logo.svg";

export function Navbar() {
	
	// Email state will be used to keep track of what should appear in navbar
	const [email, setEmail] = useState(localStorage.getItem("email"));
	const [navigateHome, setNavigateHome] = useState(false);
	
	useEffect(() => {
		if(email != localStorage.getItem("email")) {
			setEmail(localStorage.getItem("email"));
		}
	});
	
	function logout() {
		setEmail(null);
		localStorage.removeItem("email");
		setNavigateHome(true);
	}
	
	return (
		<>
			{navigateHome && <Navigate to="/" />}
			{/* The structure of the navbar below was copied from here: https://flowbite.com/docs/components/navbar */}
		<nav className="bg-white border-gray-200 dark:bg-gray-900">
			<div className="flex flex-wrap items-center justify-between mx-auto p-4">
				<Link to="/" className="flex items-center">
					<img src={logo_img} className="w-[50px] mr-3 bg-gray-400 rounded-lg" alt="Logic Gate App Logo" />
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Logic Gate Simulator</span>
				</Link>
				<div className="w-full md:block md:w-auto" id="navbar-default">
					<ul
						className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
						{email &&
						<li>
							<Link to="/mymaps"
								 className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0 dark:text-white"
								 aria-current="page">
								My Maps
							</Link>
						</li>}
						{!email &&
						<li>
							<Link to="/login"
								 className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
								Login
							</Link>
						</li>
						}
						{!email &&
						<li>
							<Link to="/createaccount"
								 className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
								Create Account
							</Link>
						</li>
						}
						{email &&
              <li>
                <button onClick={logout}
                      className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Log out
                </button>
              </li>
						}
					</ul>
				</div>
			</div>
		</nav>
	</>
	);
}

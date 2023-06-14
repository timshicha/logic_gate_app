import { httpClient } from "@/Services/HttpClient.tsx";

export async function UpdateMapService(userEmail, mapTitle, newMapAsJsonStr) {
	const data = {
		email: userEmail,
		mapTitle: mapTitle,
		newMap: newMapAsJsonStr
	};
	const response = await httpClient.put(import.meta.env.API_URL + "/circuitmaps", data);
	console.log(response);
}
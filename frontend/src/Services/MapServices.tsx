import { httpClient } from "@/Services/HttpClient.tsx";

export async function CreateMapService(userEmail, mapTitle) {
	const data = {
		email: userEmail,
		mapTitle: mapTitle
	};
	const response = await httpClient.post(import.meta.env.API_URL + "/circuitmaps", data);
	return response;
}

export async function UpdateMapService(userEmail, mapTitle, newMapAsJsonStr) {
	const data = {
		email: userEmail,
		mapTitle: mapTitle,
		newMap: newMapAsJsonStr
	};
	const response = await httpClient.put(import.meta.env.API_URL + "/circuitmaps", data);
	return response;
}

export async function RetrieveMapService(userEmail, mapTitle) {
	const data = {
		email: userEmail,
		mapTitle: mapTitle
	};
	const response = await httpClient.search("/circuitmaps", data);
	return response;
}

export async function RetriveAllMapsService(userEmail) {
	const data = {
		email: userEmail
	};
	const response = await httpClient.search("/circuitmaps/all", data);
	return response;
}

export async function DeleteMapService(userEmail, mapTitle) {
	const data = {
		email: userEmail,
		mapTitle: mapTitle
	};
	const response = await httpClient.delete(import.meta.env.API_URL + "/circuitmaps", {data: data});
	return response;
}

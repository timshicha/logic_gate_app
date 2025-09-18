import axios, { AxiosInstance, AxiosResponse } from "axios";

// Most of this was just copied from doggr

interface SearchableAxiosInstance extends AxiosInstance {
	search<T = any, R = AxiosResponse<T>>(path: string, data: any): Promise<R>;
	
}

let httpClient: SearchableAxiosInstance = axios.create({
	baseURL: import.meta.env.API_URL,
	headers: {
		"Content-type": "application/json",
	},
	
}) as SearchableAxiosInstance;

// Note we have to do this separately from axios.create above
// because it has to be first typecast to Searchable
httpClient.search = async(path, data) => {
	let config = {
		method: "SEARCH",
		url: import.meta.env.API_URL + path,
		data
	};
	// @ts-ignore
	return httpClient.request(config);
};

export { httpClient };

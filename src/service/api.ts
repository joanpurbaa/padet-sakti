// const BASE_URL = import.meta.env.VITE_API_TARGET || "/proxy-api";
const BASE_URL = "/proxy-api";

export async function apiFetch<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const token = localStorage.getItem("token");

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json", 
			Accept: "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options?.headers,
		},
	});

	if (response.status === 401) {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
		throw new Error("Unauthenticated");
	}

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response.json() as Promise<T>;
}

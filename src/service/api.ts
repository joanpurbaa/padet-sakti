const BASE_URL = import.meta.env.VITE_API_TARGET + "/api" || "/proxy-api";
// const BASE_URL = "/proxy-api";
// const BASE_URL = "http://localhost:8000";

export function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return decodeURIComponent(parts.pop()!.split(";").shift()!);
	}
	return null;
}

export async function getCsrfCookie(): Promise<void> {
	await fetch(`${import.meta.env.VITE_API_TARGET}/sanctum/csrf-cookie`, {
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});
}

export async function getCsrfToken(): Promise<string> {
	const response = await fetch(`${import.meta.env.VITE_API_TARGET}/csrf-token`, {
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});

	const data = await response.json();

	return data.token;
}

export async function apiFetch<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...options?.headers,
		},
	});

	if (response.status === 401) {
		throw new Error("401");
	}

	if (!response.ok) {
		throw new Error(`${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}
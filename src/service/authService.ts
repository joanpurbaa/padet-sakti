import { apiFetch, getCsrfCookie, getCookie } from "./api";
import type { LoginForm, User } from "../types/Auth";

const BASE_URL = "/proxy-api";

export async function loginApi(form: LoginForm): Promise<User> {
	await getCsrfCookie();

	const xsrfToken = getCookie("XSRF-TOKEN");

	const response = await fetch(`${BASE_URL}/spa/login`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"X-XSRF-TOKEN": xsrfToken || "",
		},
		body: JSON.stringify({
			username: form.username,
			password: form.password,
		}),
	});

	if (response.status === 401) {
		throw new Error("401");
	}

	if (response.status === 422) {
		throw new Error("422");
	}

	if (!response.ok) {
		throw new Error(`${response.status}`);
	}

	return getCurrentUser();
}

export async function getCurrentUser(): Promise<User> {
	return apiFetch<User>("/api/profile", {
		method: "GET",
	});
}

export async function logoutApi(): Promise<void> {
	const xsrfToken = getCookie("XSRF-TOKEN");

	const response = await fetch(`${BASE_URL}/logout`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"X-XSRF-TOKEN": xsrfToken || "",
		},
	});

	if (!response.ok) {
		throw new Error(`${response.status}`);
	}
}
import { apiFetch, getCsrfCookie, getCookie, getCsrfToken } from "./api";
import type { LoginForm, User } from "../types/Auth";

const BASE_URL = import.meta.env.VITE_API_TARGET + "/api" || "/proxy-api";

export async function loginApi(form: LoginForm): Promise<User> {
	await getCsrfCookie();
	const csrfToken = await getCsrfToken()
	const xsrfToken = getCookie("XSRF-TOKEN");

	const response = await fetch(`${import.meta.env.VITE_API_TARGET}/spa/login`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"X-XSRF-TOKEN": xsrfToken || "",
			"X-CSRF-TOKen": csrfToken || ""
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
	return apiFetch<User>("/profile", {
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
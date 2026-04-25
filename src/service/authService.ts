import { apiFetch } from "./api";
import type { LoginForm, LoginResponse } from "../types/Auth";

export async function loginApi(form: LoginForm): Promise<LoginResponse> {
	return apiFetch<LoginResponse>("/login", {
		method: "POST",
		body: JSON.stringify({
			username: form.username,
			password: form.password,
		}),
	});
}

export async function logoutApi(): Promise<void> {
	await apiFetch("/logout", {
		method: "POST",
	});
}

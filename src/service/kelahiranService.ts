import type {
	KelahiranFormPayload,
	KelahiranListResponse,
	KelahiranQueryParams,
	KelahiranResponse,
} from "../types/Kelahiran";
import { apiFetch } from "./api";

export const getKelahiran = async (
	params: KelahiranQueryParams,
	signal: AbortSignal,
) => {
	const query = new URLSearchParams();
	if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("per_page", String(params.limit));
	return await apiFetch<KelahiranListResponse>(
		`/kelahiran?${query.toString()}`,
		{ signal },
	);
};

export const addKelahiran = async (
	idKejadian: string,
	payload: KelahiranFormPayload,
) => {
	return await apiFetch<KelahiranResponse>(`/add_kelahiran/${idKejadian}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
};

export const editKelahiran = async (
	id: string,
	payload: KelahiranFormPayload,
) => {
	return await apiFetch<KelahiranResponse>(`/update_kelahiran/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
};

export const deleteKelahiran = async (id: string) => {
	await apiFetch(`/kelahiran/${id}`, { method: "DELETE" });
};

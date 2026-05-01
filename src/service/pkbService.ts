import type {
	PKBFormPayload,
	PKBListResponse,
	PKB,
	PKBQueryParams,
	PKBResponse,
} from "../types/PKB";
import { apiFetch } from "./api";

export const getPKB = async (params: PKBQueryParams, signal: AbortSignal) => {
	const query = new URLSearchParams();
	if (params.page) query.set("page", String(params.page));
	return await apiFetch<PKBListResponse>(`/pkb?${query.toString()}`, { signal });
};

export const addPKB = async (idKejadian: string, payload: PKBFormPayload) => {
	return await apiFetch<PKBResponse>(`/add_pkb/${idKejadian}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
};

export const editPKB = async (id: string, payload: PKBFormPayload) => {
	return await apiFetch<PKBResponse>(`/update_pkb/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
};

export const deletePKB = async (id: string) => {
	await apiFetch(`/pkb/${id}`, { method: "DELETE" });
};

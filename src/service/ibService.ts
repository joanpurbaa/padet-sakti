import { apiFetch } from "./api";
import type {
	IBListResponse,
	IBQueryParams,
	IB,
	IBFormPayload,
	IBSearchParams,
} from "../types/Ib";

export async function getIB(
	params?: IBQueryParams,
	signal?: AbortSignal,
): Promise<IBListResponse> {
	const query = new URLSearchParams();
	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));
	if (params?.limit) query.set("per_page", String(params.limit));

	const qs = query.toString();
	const endpoint = `/ib${qs ? `?${qs}` : ""}`;

	return apiFetch<IBListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchIB(
	params: IBSearchParams,
	signal?: AbortSignal,
): Promise<IB[]> {
	const query = new URLSearchParams();
	if (params.q) query.set("q", params.q);
	if (params.kejadian) query.set("kejadian", params.kejadian);

	const qs = query.toString();
	const endpoint = `/ib/search${qs ? `?${qs}` : ""}`;

	return apiFetch<IB[]>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function addIB(
	idKejadian: string,
	payload: IBFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/add_ib/${idKejadian}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editIB(
	id: string,
	payload: IBFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/update_ib/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function deleteIB(id: string): Promise<void> {
	await apiFetch(`/ib/${id}`, { method: "DELETE" });
}

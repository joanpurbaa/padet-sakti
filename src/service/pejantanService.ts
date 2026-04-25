import { apiFetch } from "./api";
import type {
	PejantanListResponse,
	PejantanQueryParams,
	PejantanSearchItem,
	PejantanSearchParams,
	PejantanFormPayload,
} from "../types/Pejantan";

export async function getPejantan(
	params?: PejantanQueryParams,
	signal?: AbortSignal,
): Promise<PejantanListResponse> {
	const query = new URLSearchParams();
	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));

	const qs = query.toString();
	const endpoint = `/pejantan${qs ? `?${qs}` : ""}`;

	return apiFetch<PejantanListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchPejantan(
	params: PejantanSearchParams,
	signal?: AbortSignal,
): Promise<PejantanSearchItem[]> {
	const query = new URLSearchParams();
	if (params.search) query.set("search", params.search);

	const qs = query.toString();
	const endpoint = `/pejantan/search${qs ? `?${qs}` : ""}`;

	return apiFetch<PejantanSearchItem[]>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function addPejantan(
	payload: PejantanFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>("/add_pejantan", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editPejantan(
	id: string,
	payload: PejantanFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/update_pejantan/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function deletePejantan(id: string): Promise<void> {
	await apiFetch(`/pejantan/${id}`, { method: "DELETE" });
}

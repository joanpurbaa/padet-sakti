import { apiFetch } from "./api";
import type {
	Penyakit,
	PenyakitListResponse,
	PenyakitQueryParams,
	PenyakitSearchParams,
	AddPenyakitPayload,
	EditPenyakitPayload,
} from "../types/Penyakit";

export async function getPenyakit(
	params?: PenyakitQueryParams,
	signal?: AbortSignal,
): Promise<PenyakitListResponse> {
	const query = new URLSearchParams();

	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));
	if (params?.limit) query.set("per_page", String(params.limit));

	const qs = query.toString();
	const endpoint = `/penyakit${qs ? `?${qs}` : ""}`;

	return apiFetch<PenyakitListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchPenyakit(
	params: PenyakitSearchParams,
	signal?: AbortSignal,
): Promise<Penyakit[]> {
	const query = new URLSearchParams();
	if (params.q) query.set("q", params.q);

	const qs = query.toString();
	const endpoint = `/penyakit${qs ? `?${qs}` : ""}`;

	return apiFetch<Penyakit[]>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function addPenyakit(
	payload: AddPenyakitPayload,
): Promise<{ status: string }> {
	return apiFetch<{ status: string }>("/add_penyakit", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editPenyakit(
	id: string,
	payload: EditPenyakitPayload,
): Promise<{ status: string }> {
	return apiFetch<{ status: string }>(`/edit_penyakit/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function deletePenyakit(id: string): Promise<void> {
	await apiFetch(`/penyakit/${id}`, { method: "DELETE" });
}

export async function printPenyakit(
	id: string,
	signal?: AbortSignal,
): Promise<Blob> {
	const response = await fetch(
		`${import.meta.env.VITE_API_TARGET}/api/print_BA/${id}`,
		{
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/pdf",
			},
			signal,
		},
	);

	if (!response.ok) {
		throw new Error(`Failed to print: ${response.status}`);
	}

	return response.blob();
}

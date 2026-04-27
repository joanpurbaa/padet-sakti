import { apiFetch } from "./api";
import type {
	KejadianListResponse,
	KejadianQueryParams,
	Kejadian,
	KejadianFormPayload,
} from "../types/Kejadian";

export async function getKejadian(
	params?: KejadianQueryParams,
	signal?: AbortSignal,
): Promise<KejadianListResponse> {
	const query = new URLSearchParams();
	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));

	const qs = query.toString();
	const endpoint = `/kejadian${qs ? `?${qs}` : ""}`;

	return apiFetch<KejadianListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchKejadian(
	search: string,
	signal?: AbortSignal,
): Promise<Kejadian[]> {
	return apiFetch<Kejadian[]>(
		`/kejadian/search?search=${encodeURIComponent(search)}`,
		{ method: "GET", signal },
	);
}

export async function addKejadian(
	payload: KejadianFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>("/add_kejadian", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editKejadian(
	id: string,
	payload: KejadianFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/edit_kejadian/${id}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function deleteKejadian(id: string): Promise<void> {
	await apiFetch(`/kejadian/${id}`, { method: "DELETE" });
}

export async function getKejadianDetail(
	id: string,
	signal?: AbortSignal,
): Promise<unknown> {
	return apiFetch<unknown>(`/kejadian/show/${id}`, {
		method: "GET",
		signal,
	});
}

export async function addInseminasi(
	idKejadian: string,
	payload: {
		kejadian: string;
		staff: string;
		ticket: string;
		status: string;
		pejantan: string;
		tanggal: string;
		keterangan: string;
	},
): Promise<unknown> {
	return apiFetch<unknown>(`/add_ib/${idKejadian}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function getPrintPdfUrl(idKejadian: string): string {
	const base = import.meta.env.VITE_API_TARGET || "/proxy-api";
	return `${base}/print_pdf/${idKejadian}`;
}

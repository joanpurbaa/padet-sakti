import { apiFetch } from "./api";
import type {
	PeternakListResponse,
	PeternakQueryParams,
	PeternakSearchItem,
	PeternakSearchParams,
	PeternakFormPayload,
	EditPeternakPayload,
} from "../types/Peternak";

export async function getPeternak(
	params?: PeternakQueryParams,
	signal?: AbortSignal,
): Promise<PeternakListResponse> {
	const query = new URLSearchParams();
	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));

	const qs = query.toString();
	const endpoint = `/peternak${qs ? `?${qs}` : ""}`;

	return apiFetch<PeternakListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchPeternak(
	params: PeternakSearchParams,
	signal?: AbortSignal,
): Promise<PeternakSearchItem[]> {
	const query = new URLSearchParams();
	if (params.q) query.set("q", params.q);

	const qs = query.toString();
	const endpoint = `/peternak/search${qs ? `?${qs}` : ""}`;

	return apiFetch<PeternakSearchItem[]>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function addPeternak(
	payload: PeternakFormPayload,
): Promise<{ success: boolean; serverError?: boolean }> {
	try {
		await apiFetch<unknown>("/add_peternak", {
			method: "POST",
			body: JSON.stringify(payload),
		});
		return { success: true };
	} catch (err: unknown) {
		if (err instanceof Error && err.message.includes("500")) {
			return { success: true, serverError: true };
		}
		throw err;
	}
}

export async function editPeternak(
	id: string,
	payload: EditPeternakPayload,
): Promise<{ success: boolean; serverError?: boolean }> {
	try {
		await apiFetch<unknown>(`/update_peternak/${id}`, {
			method: "PUT",
			body: JSON.stringify(payload),
		});
		return { success: true };
	} catch (err: unknown) {
		if (err instanceof Error && err.message.includes("500")) {
			return { success: true, serverError: true };
		}
		throw err;
	}
}

export async function deletePeternak(id: string): Promise<void> {
	await apiFetch(`/peternak/${id}`, { method: "DELETE" });
}

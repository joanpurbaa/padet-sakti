import type {
	BetinaListResponse,
	BetinaQueryParams,
	BetinaFormPayload,
} from "../types/Betina";
import { apiFetch } from "./api";

export const getBetina = async (
	params: BetinaQueryParams,
	signal: AbortSignal,
) => {
	const query = new URLSearchParams();
	if (params.page) query.set("page", String(params.page));
	return await apiFetch<BetinaListResponse>(`/betina?${query.toString()}`, {
		signal,
	});
};

export interface BetinaSearchItem {
	ear_tag: string;
	nama: string;
}

export const searchBetina = async (
	idPeternak: string,
	signal?: AbortSignal,
): Promise<BetinaSearchItem[]> => {
	const query = new URLSearchParams();
	query.set("peternak", idPeternak);
	return apiFetch<BetinaSearchItem[]>(`/betina/search?${query.toString()}`, {
		method: "GET",
		signal,
	});
};

// ===== TAMBAHAN BARU =====

export async function addBetina(payload: BetinaFormPayload): Promise<unknown> {
	return apiFetch<unknown>("/add_betina", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

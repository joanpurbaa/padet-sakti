import type { BetinaListResponse, BetinaQueryParams } from "../types/Betina";
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

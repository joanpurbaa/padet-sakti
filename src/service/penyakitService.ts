import { apiFetch } from "./api";
import type {
	PenyakitListResponse,
	PenyakitQueryParams,
} from "../types/Penyakit";

export async function getPenyakit(
	params?: PenyakitQueryParams,
	signal?: AbortSignal,
): Promise<PenyakitListResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.set("page", String(params.page));

	const qs = query.toString();
	const endpoint = `/penyakit${qs ? `?${qs}` : ""}`;

	return apiFetch<PenyakitListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

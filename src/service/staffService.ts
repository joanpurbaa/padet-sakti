import { apiFetch } from "./api";
import type {
	StaffListResponse,
	StaffQueryParams,
	StaffSearchParams,
	StaffFormPayload,
	Staff,
} from "../types/Staff";

export async function getStaff(
	params?: StaffQueryParams,
	signal?: AbortSignal,
): Promise<StaffListResponse> {
	const query = new URLSearchParams();

	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("per_page", "3");

	const qs = query.toString();
	const endpoint = `/staff${qs ? `?${qs}` : ""}`;

  console.log(endpoint)

	return apiFetch<StaffListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchStaff(
	params: StaffSearchParams,
	signal?: AbortSignal,
): Promise<Staff[]> {
	const query = new URLSearchParams();
	if (params.search) query.set("search", params.search);

	const qs = query.toString();
	const endpoint = `/staff/search${qs ? `?${qs}` : ""}`;

	const res = await apiFetch<unknown>(endpoint, {
		method: "GET",
		signal,
	});

  console.log(res)

	return res as Staff[];
}

export async function addStaff(payload: StaffFormPayload): Promise<unknown> {
	return apiFetch<unknown>("/add_staff", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editStaff(
	id: string,
	payload: StaffFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/update_staff/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function deleteStaff(id: string): Promise<void> {
	await apiFetch(`/staff/${id}`, { method: "DELETE" });
}

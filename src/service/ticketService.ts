import { apiFetch } from "./api";
import type {
	TicketListResponse,
	TicketQueryParams,
	TicketSearchParams,
	TicketSearchItem,
	TicketFormPayload,
} from "../types/Ticket";

export async function getTickets(
	params?: TicketQueryParams,
	signal?: AbortSignal,
): Promise<TicketListResponse> {
	const query = new URLSearchParams();

	if (params?.sort) query.set("sort", params.sort);
	if (params?.direction) query.set("direction", params.direction);
	if (params?.page) query.set("page", String(params.page));
	if (params?.limit) query.set("per_page", String(params.limit));

	const qs = query.toString();
	const endpoint = `/ticket${qs ? `?${qs}` : ""}`;

	return apiFetch<TicketListResponse>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function searchTickets(
	params: TicketSearchParams,
	signal?: AbortSignal,
): Promise<TicketSearchItem[]> {
	const query = new URLSearchParams();
	if (params.q) query.set("q", params.q);
	if (params.jenis) query.set("jenis", params.jenis);
	if (params.kejadian) query.set("kejadian", params.kejadian);

	const qs = query.toString();
	const endpoint = `/ticket/search${qs ? `?${qs}` : ""}`;

	return apiFetch<TicketSearchItem[]>(endpoint, {
		method: "GET",
		signal,
	});
}

export async function addTicket(payload: TicketFormPayload): Promise<unknown> {
	return apiFetch<unknown>("/add_ticket", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function editTicket(
	id: string,
	payload: TicketFormPayload,
): Promise<unknown> {
	return apiFetch<unknown>(`/edit_ticket/${id}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function deleteTicket(id: string): Promise<void> {
	await apiFetch(`/ticket/${id}`, { method: "DELETE" });
}

export async function updateTicketStatus(
	id: string,
	status: string,
): Promise<unknown> {
	return apiFetch<unknown>("/update_status", {
		method: "POST",
		body: JSON.stringify({ id, status }),
	});
}

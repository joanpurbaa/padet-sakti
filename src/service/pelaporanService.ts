import { apiFetch } from "./api";
import type {
	HomeResponse,
	CheckLimitResponse,
	SendTicketPayload,
	JenisLaporan,
} from "../types/Pelaporan";

export async function getStaffList(): Promise<HomeResponse> {
	return apiFetch<HomeResponse>("/home", { method: "GET" });
}

export async function checkLimit(
	id_peternak: string,
	jenis: JenisLaporan,
): Promise<CheckLimitResponse> {
	const qs = new URLSearchParams({ id_peternak, jenis }).toString();
	return apiFetch<CheckLimitResponse>(`/checklimit?${qs}`, { method: "GET" });
}

export async function sendTicket(payload: SendTicketPayload): Promise<void> {
	await apiFetch<unknown>("/send_ticket", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

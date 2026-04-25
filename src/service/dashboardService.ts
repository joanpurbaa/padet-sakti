import { apiFetch } from "./api";
import type { TicketStatistics } from "../types/Dashboard";

export async function getDashboardStats(): Promise<TicketStatistics> {
	return apiFetch<TicketStatistics>("/ticket/statistics");
}

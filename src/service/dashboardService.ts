import { apiFetch } from "./api";
import type {
	TicketStatistics,
	TicketYearlyResponse,
	IBStatisticsResponse,
} from "../types/Dashboard";

export async function getDashboardStats(): Promise<TicketStatistics> {
	return apiFetch<TicketStatistics>("/statistics");
}

export async function getTicketYearly(): Promise<TicketYearlyResponse> {
	return apiFetch<TicketYearlyResponse>("/ticket/yearly");
}

export async function getIBStatistics(): Promise<IBStatisticsResponse> {
	return apiFetch<IBStatisticsResponse>("/ib/statistics");
}

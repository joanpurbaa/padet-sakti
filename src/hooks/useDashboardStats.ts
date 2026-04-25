import { useEffect, useState } from "react";
import type { TicketStatistics } from "../types/Dashboard";
import { getDashboardStats } from "../service/dashboardService";

interface UseDashboardStatsReturn {
	stats: TicketStatistics | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useDashboardStats(): UseDashboardStatsReturn {
	const [stats, setStats] = useState<TicketStatistics | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [trigger, setTrigger] = useState<number>(0);

	const refetch = () => setTrigger((prev) => prev + 1);

	useEffect(() => {
		const controller = new AbortController();

		const run = async () => {
			try {
				setLoading(true);
				setError(null);

				const result = await getDashboardStats();

				setStats(result);
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") return;
				setError("Gagal memuat data.");
			} finally {
				setLoading(false);
			}
		};

		run();
		return () => controller.abort();
	}, [trigger]);

	return { stats, loading, error, refetch };
}

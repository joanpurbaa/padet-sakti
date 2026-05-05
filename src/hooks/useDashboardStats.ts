import { useEffect, useState } from "react";
import type { TicketStatistics, KejadianStatistics } from "../types/Dashboard";
import { getDashboardStats } from "../service/dashboardService";
import { getPeternak } from "../service/peternakService";
import { getStaff } from "../service/staffService";
import { getKejadian } from "../service/kejadianService";
import { getTickets } from "../service/ticketService";
import type { Ticket } from "../types/Ticket";

interface UseDashboardStatsReturn {
	stats: (TicketStatistics & { peternak: number; petugas: number }) | null;
	kejadianStats: KejadianStatistics | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
	selectedYear: number;
	setSelectedYear: (year: number) => void;
	chartData: { month: string; tiket: number }[];
}

export function useDashboardStats(): UseDashboardStatsReturn {
	const currentYear = new Date().getFullYear();
	const [ticketStats, setTicketStats] = useState<TicketStatistics | null>(null);
	const [allTickets, setAllTickets] = useState<Ticket[]>([]);
	const [peternakTotal, setPeternakTotal] = useState<number>(0);
	const [petugasTotal, setPetugasTotal] = useState<number>(0);
	const [kejadianStats, setKejadianStats] = useState<KejadianStatistics | null>(
		null,
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [trigger, setTrigger] = useState<number>(0);
	const [selectedYear, setSelectedYear] = useState<number>(currentYear);

	const refetch = () => setTrigger((prev) => prev + 1);

	const getChartDataByYear = (year: number) => {
		const monthMap: Record<string, number> = {};

		const monthOrder = [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember",
		];
		monthOrder.forEach((month) => {
			monthMap[month] = 0;
		});

		allTickets.forEach((ticket) => {
			const date = new Date(ticket.created_at);
			const ticketYear = date.getFullYear();

			if (ticketYear === year) {
				const monthName = date.toLocaleString("id-ID", { month: "long" });
				monthMap[monthName] = (monthMap[monthName] || 0) + 1;
			}
		});

		return monthOrder.map((month) => ({
			month,
			tiket: monthMap[month],
		}));
	};

	const chartData = getChartDataByYear(selectedYear);

	useEffect(() => {
		const controller = new AbortController();

		const run = async () => {
			try {
				setLoading(true);
				setError(null);

				const [ticketResult, ticketsRes, peternakRes, staffRes, kejadianRes] =
					await Promise.all([
						getDashboardStats(),
						getTickets({ page: 1, limit: 10000 }),
						getPeternak({ page: 1 }),
						getStaff({ page: 1 }),
						getKejadian({ page: 1, per_page: 10000 }),
					]);

				setTicketStats(ticketResult);
				setAllTickets(ticketsRes.data.data);
				setPeternakTotal(peternakRes.data.total);
				setPetugasTotal(staffRes.data.total);

				let berhasil = 0;
				let gagal = 0;
				kejadianRes.data.data.forEach((kejadian) => {
					if (kejadian.hasil === "Berhasil") berhasil++;
					else if (kejadian.hasil === "Gagal") gagal++;
				});
				setKejadianStats({ berhasil, gagal });
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") return;
				console.error("Dashboard error:", err);
				setError("Gagal memuat data.");
			} finally {
				setLoading(false);
			}
		};

		run();
		return () => controller.abort();
	}, [trigger]);

	const combinedStats = ticketStats
		? { ...ticketStats, peternak: peternakTotal, petugas: petugasTotal }
		: null;

	return {
		stats: combinedStats,
		kejadianStats,
		loading,
		error,
		refetch,
		selectedYear,
		setSelectedYear,
		chartData,
	};
}

import { useEffect, useState } from "react";
import type {
	TicketStatistics,
	TicketYearlyResponse,
	IBStatisticsResponse,
} from "../types/Dashboard";
import {
	getDashboardStats,
	getTicketYearly,
	getIBStatistics,
} from "../service/dashboardService";

interface UseDashboardStatsReturn {
	stats: TicketStatistics | null;
	yearlyData: TicketYearlyResponse | null;
	ibStats: IBStatisticsResponse | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
	selectedYear: string;
	setSelectedYear: (year: string) => void;
	chartData: { month: string; tiket: number }[];
	availableYears: string[];
}

export function useDashboardStats(): UseDashboardStatsReturn {
	const [stats, setStats] = useState<TicketStatistics | null>(null);
	const [yearlyData, setYearlyData] = useState<TicketYearlyResponse | null>(
		null,
	);
	const [ibStats, setIbStats] = useState<IBStatisticsResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [trigger, setTrigger] = useState<number>(0);
	const [selectedYear, setSelectedYear] = useState<string>("2026");

	const refetch = () => setTrigger((prev) => prev + 1);

	const availableYears = yearlyData?.datasets.map((ds) => ds.label) || ["2026"];

	const getChartDataByYear = (year: string) => {
		if (!yearlyData) return [];

		const dataset = yearlyData.datasets.find((ds) => ds.label === year);
		if (!dataset) return [];

		return yearlyData.labels.map((month, index) => ({
			month: month,
			tiket: dataset.data[index] ?? 0,
		}));
	};

	const chartData = getChartDataByYear(selectedYear);

	useEffect(() => {
		const controller = new AbortController();

		const run = async () => {
			try {
				setLoading(true);
				setError(null);

				const [statsResult, yearlyResult, ibResult] = await Promise.all([
					getDashboardStats(),
					getTicketYearly(),
					getIBStatistics(),
				]);

				setStats(statsResult);
				setYearlyData(yearlyResult);
				setIbStats(ibResult);
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

	return {
		stats,
		yearlyData,
		ibStats,
		loading,
		error,
		refetch,
		selectedYear,
		setSelectedYear,
		chartData,
		availableYears,
	};
}

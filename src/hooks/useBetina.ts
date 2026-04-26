import { useEffect, useState, useCallback } from "react";
import type { Betina } from "../types/Betina";
import { getBetina } from "../service/betinaService";

export function useBetina() {
	const [betinaList, setBetinaList] = useState<Betina[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBetina = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getBetina({ page }, signal as AbortSignal)
			.then((res) => {
				const d = res.data;
				setBetinaList(d.data);
				setTotal(d.total);
				setCurrentPage(d.current_page);
				setLastPage(d.last_page);
				setFrom(d.from ?? 0);
				setTo(d.to ?? 0);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					setError(String(err));
				}
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchBetina(currentPage, controller.signal);
		return () => controller.abort();
	}, [currentPage, fetchBetina]);

	const refetch = useCallback(() => {
		const controller = new AbortController();
		fetchBetina(currentPage, controller.signal);
	}, [currentPage, fetchBetina]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		betinaList,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch,
		setPage,
	};
}

import { useState, useCallback, useEffect } from "react";
import { getPKB } from "../service/pkbService";
import type { PKB } from "../types/PKB";

export function usePKB() {
	const [pkbList, setPkbList] = useState<PKB[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);

	const fetchPKB = useCallback((p: number, signal: AbortSignal = new AbortController().signal) => {
		setLoading(true);
		setError(null);

		getPKB({ page: p }, signal)
			.then((res) => {
				const d = res.data;
				setPkbList(d.data);
				setTotal(d.total);
				setCurrentPage(d.current_page);
				setLastPage(d.last_page);
				setFrom(d.from ?? 0);
				setTo(d.to ?? 0);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					setError(err instanceof Error ? err.message : "Gagal memuat data PKB");
				}
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchPKB(currentPage, controller.signal);
		return () => controller.abort();
	}, [currentPage, fetchPKB]);
  
	const refetch = useCallback(() => {
    fetchPKB(currentPage);
	}, [currentPage, fetchPKB]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		pkbList,
		loading,
		error,
		currentPage,
		lastPage,
		total,
		from,
		to,
		refetch,
		setPage,
	};
}

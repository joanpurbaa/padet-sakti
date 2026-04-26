import { useEffect, useState, useCallback } from "react";
import type { Penyakit } from "../types/Penyakit";
import { getPenyakit } from "../service/penyakitService";

export function usePenyakit() {
	const [penyakitList, setPenyakitList] = useState<Penyakit[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPenyakit = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getPenyakit({ page }, signal)
			.then((res) => {
				const d = res.data;
				setPenyakitList(d.data);
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
		fetchPenyakit(currentPage, controller.signal);
		return () => controller.abort();
	}, [currentPage, fetchPenyakit]);

	const refetch = useCallback(() => {
		const controller = new AbortController();
		fetchPenyakit(currentPage, controller.signal);
	}, [currentPage, fetchPenyakit]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		penyakitList,
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

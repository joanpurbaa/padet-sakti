import { useEffect, useState, useCallback } from "react";
import type { Kejadian } from "../types/Kejadian";
import { getKejadian, searchKejadian } from "../service/kejadianService";

interface UseKejadianOptions {
	search?: string;
}

export function useKejadian(options?: UseKejadianOptions) {
	const search = options?.search ?? "";
	const isSearching = search.trim().length > 0;

	const [kejadianList, setKejadianList] = useState<Kejadian[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchKejadian = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getKejadian({ page }, signal)
			.then((res) => {
				const d = res.data;
				setKejadianList(d.data);
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

	const fetchSearch = useCallback((query: string, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		searchKejadian(query, signal)
			.then((data) => {
				const list = Array.isArray(data) ? data : [];
				setKejadianList(list);
				setTotal(list.length);
				setCurrentPage(1);
				setLastPage(1);
				setFrom(list.length > 0 ? 1 : 0);
				setTo(list.length);
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

		if (isSearching) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchSearch(search, controller.signal);
		} else {
			fetchKejadian(currentPage, controller.signal);
		}

		return () => controller.abort();
	}, [search, isSearching, currentPage, fetchKejadian, fetchSearch]);

	useEffect(() => {
		if (isSearching) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCurrentPage(1);
		}
	}, [isSearching]);

	const refetch = useCallback(() => {
		if (isSearching) {
			fetchSearch(search);
		} else {
			fetchKejadian(currentPage);
		}
	}, [isSearching, search, currentPage, fetchKejadian, fetchSearch]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		kejadianList,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch,
		setPage,
		isSearching,
	};
}

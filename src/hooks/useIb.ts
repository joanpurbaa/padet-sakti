import { useEffect, useState, useCallback } from "react";
import { getIB, searchIB } from "../service/ibService";
import type { IB } from "../types/Ib";

interface UseIBOptions {
	search?: string;
  limit?: number;
}

export function useIB(options?: UseIBOptions) {
	const search = options?.search ?? "";
  const limit = options?.limit;
	const isSearching = search.trim().length > 0;

	const [ibList, setIBList] = useState<IB[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchIB = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getIB({ page, limit }, signal)
			.then((res) => {
				const d = res.data;
				setIBList(d.data);
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
	}, [limit]);

	const fetchSearch = useCallback((query: string, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		searchIB({ q: query.trim() }, signal)
			.then((data) => {
				console.log(data);
				const list = Array.isArray(data) ? data : [];
				setIBList(list);
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
			fetchIB(currentPage, controller.signal);
		}

		return () => controller.abort();
	}, [search, isSearching, currentPage, fetchIB, fetchSearch]);

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
			fetchIB(currentPage);
		}
	}, [isSearching, search, currentPage, fetchIB, fetchSearch]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		ibList,
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

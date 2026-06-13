import { useEffect, useState, useCallback } from "react";
import { getPeternak, searchPeternak } from "../service/peternakService";
import type { Peternak, PeternakSearchItem } from "../types/Peternak";

interface UsePeternakOptions {
	search?: string;
  limit?: number;
}

type DisplayPeternak = Peternak | PeternakSearchItem;

export function usePeternak(options?: UsePeternakOptions) {
	const search = options?.search ?? "";
  const limit = options?.limit;
	const isSearching = search.trim().length > 0;

	const [peternakList, setPeternakList] = useState<DisplayPeternak[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPeternak = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getPeternak({ page, sort: "id_peternak", direction: "desc", limit }, signal)
			.then((res) => {
				const d = res.data;
				setPeternakList(d.data);
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

		searchPeternak({ q: query.trim() }, signal)
			.then((data) => {
				const list = Array.isArray(data) ? data : [];
				setPeternakList(list);
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
			fetchPeternak(currentPage, controller.signal);
		}

		return () => controller.abort();
	}, [search, isSearching, currentPage, fetchPeternak, fetchSearch]);

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
			fetchPeternak(currentPage);
		}
	}, [isSearching, search, currentPage, fetchPeternak, fetchSearch]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		peternakList,
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

import { useEffect, useState, useCallback } from "react";
import { getPejantan, searchPejantan } from "../service/pejantanService";
import type { Pejantan, PejantanSearchItem } from "../types/Pejantan";

interface UsePejantanOptions {
	search?: string;
}

type DisplayPejantan = Pejantan & { text?: string };

function mapSearchToDisplay(item: PejantanSearchItem): DisplayPejantan {
	return {
		id_pejantan: item.id_pejantan,
		id_pembuatan: item.id_pembuatan,
		jenis_straw: item.jenis_straw,
		asal_straw: item.asal_straw,
		persentase: item.persentase,
		created_at: item.created_at,
		updated_at: item.updated_at,
		text: item.text,
	};
}

export function usePejantan(options?: UsePejantanOptions) {
	const search = options?.search ?? "";
	const isSearching = search.trim().length > 0;

	const [pejantanList, setPejantanList] = useState<DisplayPejantan[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPejantan = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getPejantan({ page }, signal)
			.then((res) => {
				const d = res.data;
				setPejantanList(d.data);
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

		searchPejantan({ search: query.trim() }, signal)
			.then((data) => {
				const list = Array.isArray(data) ? data.map(mapSearchToDisplay) : [];
				setPejantanList(list);
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
			fetchPejantan(currentPage, controller.signal);
		}

		return () => controller.abort();
	}, [search, isSearching, currentPage, fetchPejantan, fetchSearch]);

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
			fetchPejantan(currentPage);
		}
	}, [isSearching, search, currentPage, fetchPejantan, fetchSearch]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		pejantanList,
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

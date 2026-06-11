import { useState, useEffect, useCallback, useRef } from "react";
import { getPenyakit, searchPenyakit } from "../service/penyakitService";
import type { Penyakit, UsePenyakitOptions } from "../types/Penyakit";

export function usePenyakit(options?: UsePenyakitOptions) {
	const search = options?.search ?? "";
	const limit = options?.limit ?? 10;

	const [penyakit, setPenyakit] = useState<Penyakit[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const abortRef = useRef<AbortController | null>(null);
	const isSearching = search.trim().length > 0;

	const fetchPenyakit = useCallback(async () => {
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setLoading(true);
		setError(null);

		try {
			if (isSearching) {
				const data = await searchPenyakit({ q: search.trim() }, controller.signal);
				const list = Array.isArray(data) ? data : [];
				setPenyakit(list);
				setTotal(list.length);
				setCurrentPage(1);
				setLastPage(1);
				setFrom(list.length > 0 ? 1 : 0);
				setTo(list.length);
			} else {
				const res = await getPenyakit(
					{ page: currentPage, limit },
					controller.signal,
				);

				// FIX: Handle response dengan pagination wrapper
				let dataList: Penyakit[] = [];
				let totalCount = 0;
				let currentPageNum = 1;
				let lastPageNum = 1;
				let fromCount = 0;
				let toCount = 0;

				// Cek apakah response memiliki data.data (pagination)
				if (
					res.data &&
					typeof res.data === "object" &&
					"data" in res.data &&
					Array.isArray(res.data.data)
				) {
					// Response dengan pagination: { status: "success", data: { data: [...], total, ... } }
					dataList = res.data.data;
					totalCount = res.data.total || 0;
					currentPageNum = res.data.current_page || 1;
					lastPageNum = res.data.last_page || 1;
					fromCount = res.data.from || 0;
					toCount = res.data.to || 0;
				} else if (Array.isArray(res.data)) {
					// Response tanpa pagination: { status: "success", data: [...] }
					dataList = res.data;
					totalCount = res.data.length;
					currentPageNum = 1;
					lastPageNum = 1;
					fromCount = res.data.length > 0 ? 1 : 0;
					toCount = res.data.length;
				} else if (res.data && "data" in res.data && Array.isArray(res.data.data)) {
					// Alternative structure
					dataList = res.data.data;
					totalCount = res.data.total || dataList.length;
				}

				setPenyakit(dataList);
				setTotal(totalCount);
				setCurrentPage(currentPageNum);
				setLastPage(lastPageNum);
				setFrom(fromCount);
				setTo(toCount);
			}
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			console.error("Fetch error:", err);
			setError(err instanceof Error ? err.message : "Gagal memuat data penyakit");
		} finally {
			setLoading(false);
		}
	}, [currentPage, isSearching, limit, search]);

	useEffect(() => {
		fetchPenyakit();
		return () => abortRef.current?.abort();
	}, [fetchPenyakit]);

	useEffect(() => {
		if (isSearching) {
			setCurrentPage(1);
		}
	}, [search, isSearching]);

	const setPage = (page: number) => {
		if (page >= 1 && page <= lastPage) {
			setCurrentPage(page);
		}
	};

	return {
		penyakit,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch: fetchPenyakit,
		setPage,
		isSearching,
	};
}

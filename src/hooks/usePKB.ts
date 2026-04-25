import { useState, useCallback, useEffect, useRef } from "react";
import { getPKB } from "../service/pkbService";
import type { PKB } from "../types/PKB";

export function usePKB() {
	const [pkbList, setPkbList] = useState<PKB[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const controllerRef = useRef<AbortController | null>(null);

	const fetchPKB = useCallback((p: number) => {
		controllerRef.current?.abort();
		const controller = new AbortController();
		controllerRef.current = controller;

		setLoading(true);
		setError(null);

		getPKB({ page: p }, controller.signal)
			.then((res) => {
				setPkbList(res.data.data);
				setTotalPages(res.data.last_page);
				setTotal(res.data.total);
				setFrom(res.data.from);
				setTo(res.data.to);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					setError(err instanceof Error ? err.message : "Gagal memuat data PKB");
				}
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchPKB(page);
		return () => controllerRef.current?.abort();
	}, [page, fetchPKB]);

	const refetch = useCallback(() => {
		fetchPKB(page);
	}, [page, fetchPKB]);

	return {
		pkbList,
		loading,
		error,
		page,
		setPage,
		totalPages,
		total,
		from,
		to,
		refetch,
	};
}

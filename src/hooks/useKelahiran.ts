import { useState, useCallback, useEffect, useRef } from "react";
import { getKelahiran } from "../service/kelahiranService";
import type { Kelahiran } from "../types/Kelahiran";

interface UseKelahiranOptions {
	limit?: number;
}

export const useKelahiran = (options?: UseKelahiranOptions) => {
	const limit = options?.limit;

	const [kelahiranList, setKelahiranList] = useState<Kelahiran[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const controllerRef = useRef<AbortController | null>(null);

	const fetchKelahiran = useCallback((p: number) => {
		controllerRef.current?.abort();
		const controller = new AbortController();
		controllerRef.current = controller;

		setLoading(true);
		setError(null);

		getKelahiran({ page: p, limit }, controller.signal)
			.then((res) => {
				setKelahiranList(res.data.data);
				setTotalPages(res.data.last_page);
				setTotal(res.data.total);
				setFrom(res.data.from);
				setTo(res.data.to);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					setError(
						err instanceof Error ? err.message : "Gagal memuat data kelahiran",
					);
				}
			})
			.finally(() => setLoading(false));
	}, [limit]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchKelahiran(page);
		return () => controllerRef.current?.abort();
	}, [page, fetchKelahiran]);

	const refetch = useCallback(() => {
		fetchKelahiran(page);
	}, [page, fetchKelahiran]);

	return {
		kelahiranList,
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
};

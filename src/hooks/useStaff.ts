import { useEffect, useState, useCallback } from "react";
import type { Staff, UseStaffOptions } from "../types/Staff";
import { getStaff, searchStaff } from "../service/staffService";

export function useStaff(options?: UseStaffOptions) {
	const search = options?.search ?? "";
	const isSearching = search.trim().length > 0;

	const [staffs, setStaffs] = useState<Staff[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

  const limit = options?.limit;

	const fetchStaff = useCallback((page: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		getStaff({ page, limit }, signal)
			.then((res) => {
				const d = res.data;
				setStaffs(d.data);
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

		searchStaff({ search: query }, signal)
			.then((res) => {
				const data = Array.isArray(res) ? res : [];
				setStaffs(data);
				setTotal(data.length);
				setCurrentPage(1);
				setLastPage(1);
				setFrom(data.length > 0 ? 1 : 0);
				setTo(data.length);
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
			fetchStaff(currentPage, controller.signal);
		}

		return () => controller.abort();
	}, [search, isSearching, currentPage, fetchStaff, fetchSearch]);

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
			fetchStaff(currentPage);
		}
	}, [isSearching, search, currentPage, fetchStaff, fetchSearch]);

	const setPage = useCallback((p: number) => {
		setCurrentPage(p);
	}, []);

	return {
		staffs,
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

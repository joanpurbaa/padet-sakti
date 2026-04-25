import { useEffect, useState, useCallback } from "react";
import { getKejadianDetail } from "../service/kejadianService";
import type { KejadianDetailResponse } from "../types/Kejadian";

export function useKejadianDetail(id: string) {
	const [detail, setDetail] = useState<KejadianDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDetail = useCallback(
		(signal?: AbortSignal) => {
			if (!id) return;

			setLoading(true);
			setError(null);

			getKejadianDetail(id, signal)
				.then((res) => {
					setDetail(res as KejadianDetailResponse);
				})
				.catch((err) => {
					if (err.name !== "AbortError") {
						setError(String(err));
					}
				})
				.finally(() => setLoading(false));
		},
		[id],
	);

	useEffect(() => {
		const controller = new AbortController();
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchDetail(controller.signal);
		return () => controller.abort();
	}, [fetchDetail]);

	const refetch = useCallback(() => {
		fetchDetail();
	}, [fetchDetail]);

	return { detail, loading, error, refetch };
}

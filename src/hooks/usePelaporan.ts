// src/hooks/usePelaporan.ts

import { useState, useCallback } from "react";
import {
	getStaffList,
	checkLimit,
	sendTicket,
} from "../service/pelaporanService";
import type { StaffItem, JenisLaporan } from "../types/Pelaporan";

export function usePelaporan() {
	const [staffList, setStaffList] = useState<StaffItem[]>([]);
	const [staffLoading, setStaffLoading] = useState(false);
	const [staffError, setStaffError] = useState<string | null>(null);

	const [limitLoading, setLimitLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	const fetchStaff = useCallback(async () => {
		setStaffLoading(true);
		setStaffError(null);
		try {
			const res = await getStaffList();
			setStaffList(res.data ?? []);
		} catch {
			setStaffError("Gagal memuat daftar petugas.");
		} finally {
			setStaffLoading(false);
		}
	}, []);

	/**
	 * Cek apakah peternak masih boleh kirim laporan hari ini.
	 * Throws dengan pesan error jika limit sudah tercapai.
	 */
	const checkCanSubmit = useCallback(
		async (id_peternak: string, jenis: JenisLaporan): Promise<void> => {
			setLimitLoading(true);
			try {
				await checkLimit(id_peternak, jenis);
				// Jika response OK (status 200), berarti masih bisa submit
			} finally {
				setLimitLoading(false);
			}
		},
		[],
	);

	const submitTicket = useCallback(
		async (
			peternak: string,
			staff: string,
			jenis: JenisLaporan,
		): Promise<void> => {
			setSubmitLoading(true);
			try {
				await sendTicket({ peternak, staff, jenis });
			} finally {
				setSubmitLoading(false);
			}
		},
		[],
	);

	return {
		staffList,
		staffLoading,
		staffError,
		limitLoading,
		submitLoading,
		fetchStaff,
		checkCanSubmit,
		submitTicket,
	};
}

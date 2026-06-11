export interface StaffItem {
	id_staff: string;
	nama: string;
	nama_lengkap: string;
	no_hp: string;
	asal: string;
	created_at: string;
	updated_at: string;
}

export interface HomeResponse {
	status: string;
	data: StaffItem[];
}

export interface CheckLimitResponse {
	status: string;
	message: string;
}

export interface SendTicketPayload {
	peternak: string;
	staff: string;
	jenis: JenisLaporan;
}

export type JenisLaporan = "IB" | "Admin" | "PKB" | "Kelahiran" | "Penyakit";

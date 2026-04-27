export interface Betina {
	ear_tag: string;
	id_peternak: string;
	nama: string;
	jenis_sapi: string;
	usia: string;
	foto: string;
	jumlah_ib: number;
	riwayat_penyakit: string;
	status: string;
	tanggal_lahir: string;
	created_at: string;
	updated_at: string | null;
}

export interface BetinaPagination {
	current_page: number;
	data: Betina[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: { url: string | null; label: string; active: boolean }[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}

export interface BetinaListResponse {
	status: string;
	data: BetinaPagination;
}

export interface BetinaQueryParams {
	page?: number;
}

// ===== TAMBAHAN BARU =====

export interface BetinaFormPayload {
	nama: string;
	peternak: string;
	jenis: string;
	tanggal: string;
}

export interface BetinaFormErrors {
	nama?: string;
	peternak?: string;
	jenis?: string;
	tanggal?: string;
}

export interface BetinaFormModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

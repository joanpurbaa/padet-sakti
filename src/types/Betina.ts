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
	limit?: number;
}

export interface BetinaFormPayload {
	eartag: string;
	nama: string;
	peternak: string;
	jenis: string;
	tanggal: string;
}

export interface BetinaFormErrors {
	ear_tag?: string;
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

export interface BetinaUpdatePayload {
	eartag: string;
	nama: string;
	peternak: string;
	jenis: string;
	tanggal: string;
}

export interface BetinaUpdateErrors {
	eartag?: string[];
	nama?: string[];
	peternak?: string[];
	jenis?: string[];
	tanggal?: string[];
}

export interface EditBetinaModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	betina: Betina | null;
}

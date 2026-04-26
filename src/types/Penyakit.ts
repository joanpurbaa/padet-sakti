export interface Penyakit {
	id_penyakit: string;
	id_ticket: string;
	id_peternak: string;
	id_sapi: string;
	keterangan: string;
	tanggal_penanganan: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface PenyakitPagination {
	current_page: number;
	data: Penyakit[];
	total: number;
	last_page: number;
	from: number;
	to: number;
	per_page: number;
	first_page_url: string;
	last_page_url: string;
	next_page_url: string | null;
	prev_page_url: string | null;
	path: string;
	links: { url: string | null; label: string; active: boolean }[];
}

export interface PenyakitListResponse {
	status: string;
	data: PenyakitPagination;
}

export interface PenyakitQueryParams {
	page?: number;
}

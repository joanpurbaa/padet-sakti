export interface Pejantan {
	id_pejantan: string;
	id_pembuatan: string;
	jenis_straw: string;
	asal_straw: string;
	persentase: number;
	created_at: string | null;
	updated_at: string | null;
}

export interface PejantanSearchItem {
	id_pejantan: string;
	id_pembuatan: string;
	jenis_straw: string;
	asal_straw: string;
	persentase: number;
	created_at: string | null;
	updated_at: string | null;
	text: string;
}

export interface PejantanPagination {
	current_page: number;
	data: Pejantan[];
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

export interface PejantanListResponse {
	status: string;
	data: PejantanPagination;
}

export interface PejantanQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
}

export interface PejantanSearchParams {
	search?: string;
}

export interface PejantanFormPayload {
	pejantan: string;
	pembuatan: string;
	jenis: string;
	asal: string;
}

export interface PejantanFormErrors {
	pejantan?: string[];
	pembuatan?: string[];
	jenis?: string[];
	asal?: string[];
}

export interface PejantanModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	pejantan: Pejantan | null;
}

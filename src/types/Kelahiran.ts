export interface Kelahiran {
	id_kelahiran: string;
	nama: string;
	jenis_kelamin: string;
	id_kejadian: string;
	id_staff: string;
	id_ticket: string;
	keunggulan: string | null;
	created_at: string;
	updated_at: string | null;
}

export interface KelahiranPagination {
	current_page: number;
	data: Kelahiran[];
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

export interface KelahiranListResponse {
	status: string;
	data: KelahiranPagination;
}

export interface KelahiranQueryParams {
	page?: number;
}

export interface KelahiranFormPayload {
	kejadian: string;
	staff: string;
	ticket: string;
	nama: string;
	kelamin: string;
	tanggal: string;
	keunggulan?: string;
}

export interface KelahiranFormErrors {
	kejadian?: string;
	staff?: string;
	ticket?: string;
	nama?: string;
	kelamin?: string;
	tanggal?: string;
	keunggulan?: string;
}

export interface KelahiranResponse {
	status: string;
	data: Kelahiran;
}

export interface AddKelahiranModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	idKejadian: string;
}

export interface KelahiranForm {
	staff: string;
	ticket: string;
	nama: string;
	kelamin: string;
	tanggal: string;
	keunggulan: string;
}

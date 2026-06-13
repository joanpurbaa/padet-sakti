export interface PKB {
	id_pkb: string;
	id_ib: string;
	id_kejadian: string;
	id_ticket: string;
	no_dokumen: string;
	id_staff: string;
	hasil: string;
	keterangan: string;
	created_at: string;
	updated_at: string | null;
}

export interface PKBPagination {
	current_page: number;
	data: PKB[];
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

export interface PKBListResponse {
	status: string;
	data: PKBPagination;
}

export interface PKBQueryParams {
	page?: number;
  limit?: number;
}

export interface PKBFormPayload {
	kejadian: string;
	ib: string;
	ticket: string;
	staff: string;
	status: string;
	tanggal: string;
	keterangan?: string;
}

export interface PKBFormErrors {
	kejadian?: string;
	ib?: string;
	ticket?: string;
	staff?: string;
	status?: string;
	tanggal?: string;
	keterangan?: string;
}

export interface PKBResponse {
	status: string;
	data: PKB;
}

export interface AddPKBModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	idKejadian: string;
}

export interface PKBForm {
	ib: string;
	kejadian : string;
	ticket: string;
	staff: string;
	status: string;
	tanggal: string;
	keterangan: string;
}

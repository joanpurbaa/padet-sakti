export interface IB {
	id_ib: string;
	id_kejadian: string;
	id_staff: string;
	id_ticket: string;
	pejantan: string;
	no_dokumen: string;
	hasil: string;
	status_tindakan: string;
	keterangan: string | null;
	status: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface IBPagination {
	current_page: number;
	data: IB[];
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

export interface IBListResponse {
	status: string;
	data: IBPagination;
}

export interface IBQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
}

export interface IBSearchParams {
	q?: string;
	kejadian?: string;
}

export interface IBFormPayload {
	kejadian: string;
	staff: string;
	ticket: string;
	pejantan: string;
	status: string;
	tanggal: string;
	keterangan: string;
}

export interface IBFormErrors {
	kejadian?: string[];
	staff?: string[];
	ticket?: string[];
	pejantan?: string[];
	status?: string[];
	keterangan?: string[];
}

export interface AddInseminasiModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	idKejadian: string;
}

export interface InseminasiForm {
	staff: string;
	ticket: string;
	pejantan: string;
	status: string;
	tanggal: string;
	keterangan: string;
}

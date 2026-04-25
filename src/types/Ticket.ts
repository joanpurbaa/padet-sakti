export interface Ticket {
	id_ticket: string;
	id_peternak: string;
	id_staff: string;
	jenis_laporan: string;
	pelapor: string;
	petugas: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface TicketSearchItem {
	id_ticket: string;
	id_peternak: string;
	nama: string;
	text: string;
	alamat: string;
	jenis_ternak: string;
	no_hp: string;
	kecamatan: string | null;
	kelurahan: string | null;
	created_at: string;
	updated_at: string;
}

export interface TicketPagination {
	current_page: number;
	data: Ticket[];
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

export interface TicketListResponse {
	status: string;
	data: TicketPagination;
}

export interface TicketQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
}

export interface TicketSearchParams {
	q?: string;
	jenis?: string;
	kejadian?: string;
}

export interface AddTicketPayload {
	staff: string;
	peternak: string;
	jenis: string;
	status: string;
}

export interface AddTicketErrors {
	staff?: string[];
	peternak?: string[];
	jenis?: string[];
	status?: string[];
}

export interface TicketFormPayload {
	staff: string;
	peternak: string;
	jenis: string;
	status: string;
}

export interface TicketFormErrors {
	staff?: string[];
	peternak?: string[];
	jenis?: string[];
	status?: string[];
}

export interface TicketModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	ticket: DisplayTicket | null;
}

export interface DisplayTicket {
	id_ticket: string;
	id_peternak: string;
	id_staff: string | null;
	jenis_laporan: string | null;
	pelapor: string;
	petugas: string | null;
	status: string | null;
	created_at: string;
	alamat?: string;
	no_hp?: string;
}

export interface UseTicketsOptions {
	search?: string;
}
export interface Staff {
	id_staff: string;
	nama: string;
	no_hp: string;
	surat_izin: string;
	asal: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface StaffPagination {
	current_page: number;
	data: Staff[];
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

export interface StaffListResponse {
	status: string;
	data: StaffPagination;
}

export interface StaffQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
  limit?: number;
}

export interface StaffSearchParams {
	search?: string;
}

export interface StaffFormPayload {
	name: string;
	// izin: string;
	asal: string;
	phone: string;
}

export interface StaffFormErrors {
	name?: string[];
	izin?: string[];
	asal?: string[];
	phone?: string[];
}

export interface DeleteStaffModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	staff: Staff | null;
}

export interface StaffFormModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	staff?: Staff | null;
}

export interface UseStaffOptions {
	search?: string;
  limit?: number;
}
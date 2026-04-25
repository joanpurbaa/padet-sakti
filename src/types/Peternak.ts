export interface Peternak {
	id_peternak: string;
	nama: string;
	alamat: string;
	kelurahan: string | null;
	kecamatan: string | null;
	jenis_ternak: string;
	no_hp: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface PeternakSearchItem {
	id_peternak: string;
	text: string;
}

export interface PeternakPagination {
	current_page: number;
	data: Peternak[];
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

export interface PeternakListResponse {
	status: string;
	data: PeternakPagination;
}

export interface PeternakQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
}

export interface PeternakSearchParams {
	q?: string;
}

export interface PeternakFormPayload {
	name: string;
	address: string;
	jenis: string;
}

export interface EditPeternakPayload {
	name: string;
	address: string;
	phone: string;
}

export interface PeternakFormErrors {
	name?: string[];
	address?: string[];
	jenis?: string[];
	phone?: string[];
}

export interface PeternakModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	peternak: Peternak | null;
}

export interface DeletePeternakModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	peternak: Peternak | null;
}

export interface Kejadian {
	id_kejadian: string;
	id_betina: string;
	id_peternak: string;
	status: string;
	hasil: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianPagination {
	current_page: number;
	data: Kejadian[];
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

export interface KejadianListResponse {
	status: string;
	data: KejadianPagination;
}

export interface KejadianQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
	per_page?: number;
  limit?: number;
}

export interface KejadianFormPayload {
	betina: string;
	peternak: string;
	status: string;
	hasil: string;
	tanggal: string;
}

export interface KejadianFormErrors {
	betina?: string[];
	peternak?: string[];
	status?: string[];
	hasil?: string[];
}

export interface KejadianDetailPeternak {
	id_peternak: string;
	nama: string;
	alamat: string;
	no_hp: string;
	jenis_ternak: string;
	kecamatan: string | null;
	kelurahan: string | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianDetailBetina {
	ear_tag: string;
	nama: string;
	tanggal_lahir: string;
	id_peternak: string;
	jenis_sapi: string;
	jumlah_ib: number;
	status: string;
	usia: string;
	riwayat_penyakit: string;
	foto: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianDetailIB {
	id_ib: string;
	id_kejadian: string;
	id_staff: string;
	id_ticket: string | null;
	pejantan: string;
	no_dokumen: string;
	hasil: string;
	status_tindakan: string;
	keterangan: string | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianDetailPKB {
	id_pkb: string;
	id_ib: string;
	id_kejadian: string;
	id_staff: string;
	id_ticket: string | null;
	no_dokumen: string;
	hasil: string;
	keterangan: string | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianDetailKelahiran {
	id_kelahiran: string;
	id_kejadian: string;
	id_staff: string;
	id_ticket: string | null;
	nama: string;
	jenis_kelamin: string;
	keunggulan: string | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface KejadianDetailResponse {
	status: string;
	data: Kejadian;
	peternak: KejadianDetailPeternak;
	betina: KejadianDetailBetina;
	ib: KejadianDetailIB[];
	pkb: KejadianDetailPKB[];
	kelahiran: KejadianDetailKelahiran[];
	countib: number;
	countpkb: number;
}

export interface DeleteKejadianModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	kejadian: Kejadian | null;
}

export interface KejadianFormModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	kejadian?: Kejadian | null;
}
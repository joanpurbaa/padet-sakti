export interface Penyakit {
	id_penyakit: string;
	id_ticket: string;
	signalment_nama: string;
	signalment_kelurahan: string;
	signalment_kecamatan: string;
	signalment_jenis: string;
	signalment_ras: string;
	signalment_jenisKelamin: string;
	signalment_umur: number;
	signalment_berat: number;
	signalment_warna: string;
	signalment_ear_tag: string;
	anamnesa: string;
	status_umum: string;
	status_mukosa: string;
	status_suhu: string;
	simptom: string;
	diagnosa: string;
	pengobatan: string;
	prognosis: string;
	created_at: string;
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
}

export interface PenyakitListResponse {
	status: string;
	data: Penyakit[];
	pagination?: PenyakitPagination;
}

export interface AddPenyakitPayload {
	id_ticket: string;
	signalment_nama: string;
	signalment_kelurahan: string;
	signalment_kecamatan: string;
	signalment_jenis: string;
	signalment_ras: string;
	signalment_jenisKelamin: string;
	signalment_umur: number;
	signalment_berat: number;
	signalment_warna: string;
	signalment_ear_tag: string;
	anamnesa: string;
	status_umum: string;
	status_mukosa: string;
	status_suhu: string;
	simptom: string;
	diagnosa: string;
	pengobatan: string;
	prognosis: string;
	tanggal: string;
}

export type EditPenyakitPayload = AddPenyakitPayload;

export interface PenyakitFormPayload {
	id_ticket: string;
	signalment_nama: string;
	signalment_kelurahan: string;
	signalment_kecamatan: string;
	signalment_jenis: string;
	signalment_ras: string;
	signalment_jenisKelamin: string;
	signalment_umur: number | "";
	signalment_berat: number | "";
	signalment_warna: string;
	signalment_ear_tag: string;
	anamnesa: string;
	status_umum: string;
	status_mukosa: string;
	status_suhu: string;
	simptom: string;
	diagnosa: string;
	pengobatan: string;
	prognosis: string;
	tanggal: string;
}

export interface PenyakitFormErrors {
	id_ticket?: string[];
	signalment_nama?: string[];
	signalment_kelurahan?: string[];
	signalment_kecamatan?: string[];
	signalment_jenis?: string[];
	signalment_ras?: string[];
	signalment_jenisKelamin?: string[];
	signalment_umur?: string[];
	signalment_berat?: string[];
	signalment_warna?: string[];
	signalment_ear_tag?: string[];
	anamnesa?: string[];
	status_umum?: string[];
	status_mukosa?: string[];
	status_suhu?: string[];
	simptom?: string[];
	diagnosa?: string[];
	pengobatan?: string[];
	prognosis?: string[];
	tanggal?: string[];
}

export interface PenyakitModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	penyakit: Penyakit | null;
}

export interface UsePenyakitOptions {
	search?: string;
	limit?: number;
}

export const PROGNOSIS_OPTIONS = ["Fausta", "Dubius", "Infausta"];
export const JENIS_KELAMIN_OPTIONS = ["Betina", "Jantan"];

export interface PenyakitQueryParams {
	sort?: string;
	direction?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface PenyakitSearchParams {
	q?: string;
}

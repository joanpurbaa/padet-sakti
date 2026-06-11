import { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { addPenyakit, editPenyakit } from "../service/penyakitService";
import { getTickets, searchTickets } from "../service/ticketService";
import SearchableSelect from "./SearchableSelect";
import type {
	PenyakitFormPayload,
	PenyakitFormErrors,
	PenyakitModalProps,
} from "../types/Penyakit";
import { PROGNOSIS_OPTIONS, JENIS_KELAMIN_OPTIONS } from "../types/Penyakit";

const EMPTY_FORM: PenyakitFormPayload = {
	id_ticket: "",
	signalment_nama: "",
	signalment_kelurahan: "",
	signalment_kecamatan: "",
	signalment_jenis: "",
	signalment_ras: "",
	signalment_jenisKelamin: "",
	signalment_umur: "",
	signalment_berat: "",
	signalment_warna: "",
	signalment_ear_tag: "",
	anamnesa: "",
	status_umum: "",
	status_mukosa: "",
	status_suhu: "",
	simptom: "",
	diagnosa: "",
	pengobatan: "",
	prognosis: "Fausta",
	tanggal: "",
};

interface TicketOption {
	value: string;
	label: string;
}

// Komponen InputField
interface InputFieldProps {
	label: string;
	name: keyof PenyakitFormPayload;
	type?: string;
	required?: boolean;
	placeholder?: string;
	value: string | number;
	error?: string[];
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
	label,
	name,
	type = "text",
	required = true,
	placeholder,
	value,
	error,
	onChange,
	onNumberChange,
}: InputFieldProps) => (
	<div>
		<label className="block text-sm font-medium text-gray-600 mb-1.5">
			{label} {required && <span className="text-red-400">*</span>}
		</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={type === "number" ? onNumberChange : onChange}
			placeholder={placeholder}
			className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors ${
				error
					? "border-red-400 bg-red-50"
					: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
			}`}
		/>
		{error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
	</div>
);

// Komponen TextAreaField
interface TextAreaFieldProps {
	label: string;
	name: keyof PenyakitFormPayload;
	required?: boolean;
	rows?: number;
	value: string;
	error?: string[];
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
	label,
	name,
	required = true,
	rows = 3,
	value,
	error,
	onChange,
}: TextAreaFieldProps) => (
	<div>
		<label className="block text-sm font-medium text-gray-600 mb-1.5">
			{label} {required && <span className="text-red-400">*</span>}
		</label>
		<textarea
			name={name}
			value={value}
			onChange={onChange}
			rows={rows}
			className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors resize-y ${
				error
					? "border-red-400 bg-red-50"
					: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
			}`}
		/>
		{error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
	</div>
);

// Komponen SelectField
interface SelectFieldProps {
	label: string;
	name: keyof PenyakitFormPayload;
	options: string[];
	required?: boolean;
	value: string;
	error?: string[];
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
	label,
	name,
	options,
	required = true,
	value,
	error,
	onChange,
}: SelectFieldProps) => (
	<div>
		<label className="block text-sm font-medium text-gray-600 mb-1.5">
			{label} {required && <span className="text-red-400">*</span>}
		</label>
		<select
			name={name}
			value={value}
			onChange={onChange}
			className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors cursor-pointer ${
				error
					? "border-red-400 bg-red-50"
					: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
			}`}>
			<option value="">Pilih {label.toLowerCase()}</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
		{error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
	</div>
);

export default function PenyakitFormModal({
	open,
	onClose,
	onSuccess,
	penyakit,
}: PenyakitModalProps) {
	const isEdit = !!penyakit;

	const [form, setForm] = useState<PenyakitFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<PenyakitFormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [ticketOptions, setTicketOptions] = useState<TicketOption[]>([]);
	const [ticketLoading, setTicketLoading] = useState(false);
	const ticketTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const ticketControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTicketLoading(true);
		getTickets({ page: 1, limit: 100 }, controller.signal)
			.then((res) => {
				const tickets = res.data.data;
				setTicketOptions(
					tickets.map((t) => ({
						value: t.id_ticket,
						label: `${t.id_ticket} - ${t.pelapor} (${t.jenis_laporan})`,
					})),
				);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load tickets:", err);
				}
			})
			.finally(() => setTicketLoading(false));

		if (penyakit) {
			setForm({
				id_ticket: penyakit.id_ticket,
				signalment_nama: penyakit.signalment_nama,
				signalment_kelurahan: penyakit.signalment_kelurahan,
				signalment_kecamatan: penyakit.signalment_kecamatan,
				signalment_jenis: penyakit.signalment_jenis,
				signalment_ras: penyakit.signalment_ras,
				signalment_jenisKelamin: penyakit.signalment_jenisKelamin,
				signalment_umur: penyakit.signalment_umur,
				signalment_berat: penyakit.signalment_berat,
				signalment_warna: penyakit.signalment_warna,
				signalment_ear_tag: penyakit.signalment_ear_tag,
				anamnesa: penyakit.anamnesa,
				status_umum: penyakit.status_umum,
				status_mukosa: penyakit.status_mukosa,
				status_suhu: penyakit.status_suhu,
				simptom: penyakit.simptom,
				diagnosa: penyakit.diagnosa,
				pengobatan: penyakit.pengobatan,
				prognosis: penyakit.prognosis,
				tanggal: penyakit.created_at ? penyakit.created_at.split("T")[0] : "",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setErrors({});
		setGeneralError(null);

		return () => controller.abort();
	}, [open, penyakit]);

	if (!open) return null;

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const numValue = value === "" ? "" : Number(value);
		setForm((prev) => ({ ...prev, [name]: numValue }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handleTicketSearch = (query: string) => {
		if (ticketTimerRef.current) clearTimeout(ticketTimerRef.current);

		if (!query.trim()) return;

		ticketTimerRef.current = setTimeout(() => {
			ticketControllerRef.current?.abort();
			const controller = new AbortController();
			ticketControllerRef.current = controller;
			setTicketLoading(true);

			searchTickets({ q: query.trim() }, controller.signal)
				.then((data) => {
					const list = Array.isArray(data) ? data : [];
					setTicketOptions(
						list.map((t) => ({
							value: t.id_ticket,
							label: `${t.id_ticket} - ${t.nama} (${t.jenis_ternak})`,
						})),
					);
				})
				.catch((err) => {
					if (err.name !== "AbortError") {
						console.error("Failed to search tickets:", err);
					}
				})
				.finally(() => setTicketLoading(false));
		}, 300);
	};

	const validate = (): boolean => {
		const errs: PenyakitFormErrors = {};
		if (!form.id_ticket) errs.id_ticket = ["ID Ticket wajib dipilih"];
		if (!form.signalment_nama.trim())
			errs.signalment_nama = ["Nama ternak wajib diisi"];
		if (!form.signalment_kelurahan.trim())
			errs.signalment_kelurahan = ["Kelurahan wajib diisi"];
		if (!form.signalment_kecamatan.trim())
			errs.signalment_kecamatan = ["Kecamatan wajib diisi"];
		if (!form.signalment_jenis.trim())
			errs.signalment_jenis = ["Jenis ternak wajib diisi"];
		if (!form.signalment_ras.trim()) errs.signalment_ras = ["Ras wajib diisi"];
		if (!form.signalment_jenisKelamin.trim())
			errs.signalment_jenisKelamin = ["Jenis kelamin wajib dipilih"];
		if (!form.signalment_umur && form.signalment_umur !== 0)
			errs.signalment_umur = ["Umur wajib diisi"];
		if (!form.signalment_berat && form.signalment_berat !== 0)
			errs.signalment_berat = ["Berat wajib diisi"];
		if (!form.signalment_warna.trim())
			errs.signalment_warna = ["Warna wajib diisi"];
		if (!form.signalment_ear_tag.trim())
			errs.signalment_ear_tag = ["Ear tag wajib diisi"];
		if (!form.anamnesa.trim()) errs.anamnesa = ["Anamnesa wajib diisi"];
		if (!form.status_umum.trim()) errs.status_umum = ["Status umum wajib diisi"];
		if (!form.status_mukosa.trim())
			errs.status_mukosa = ["Status mukosa wajib diisi"];
		if (!form.status_suhu.trim()) errs.status_suhu = ["Suhu tubuh wajib diisi"];
		if (!form.simptom.trim()) errs.simptom = ["Simptom wajib diisi"];
		if (!form.diagnosa.trim()) errs.diagnosa = ["Diagnosa wajib diisi"];
		if (!form.pengobatan.trim()) errs.pengobatan = ["Pengobatan wajib diisi"];
		if (!form.prognosis) errs.prognosis = ["Prognosis wajib dipilih"];
		if (!form.tanggal) errs.tanggal = ["Tanggal wajib diisi"];

		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		const payload = {
			id_ticket: form.id_ticket,
			signalment_nama: form.signalment_nama,
			signalment_kelurahan: form.signalment_kelurahan,
			signalment_kecamatan: form.signalment_kecamatan,
			signalment_jenis: form.signalment_jenis,
			signalment_ras: form.signalment_ras,
			signalment_jenisKelamin: form.signalment_jenisKelamin,
			signalment_umur: Number(form.signalment_umur),
			signalment_berat: Number(form.signalment_berat),
			signalment_warna: form.signalment_warna,
			signalment_ear_tag: form.signalment_ear_tag,
			anamnesa: form.anamnesa,
			status_umum: form.status_umum,
			status_mukosa: form.status_mukosa,
			status_suhu: form.status_suhu,
			simptom: form.simptom,
			diagnosa: form.diagnosa,
			pengobatan: form.pengobatan,
			prognosis: form.prognosis,
			tanggal: form.tanggal,
		};

		console.log("Submitting payload:", payload);

		try {
			let response;
			if (isEdit && penyakit) {
				response = await editPenyakit(penyakit.id_penyakit, payload);
				console.log("Edit response:", response);
			} else {
				response = await addPenyakit(payload);
				console.log("Add response:", response);
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			console.error("Submit error:", err);
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit
						? "Gagal mengubah data penyakit"
						: "Gagal menambahkan data penyakit",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && !loading) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			onClick={handleBackdropClick}>
			<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
					<div>
						<h2 className="text-lg font-bold text-gray-800">
							{isEdit ? "Edit Penyakit" : "Tambah Penyakit"}
						</h2>
						{isEdit && penyakit && (
							<p className="text-xs text-gray-400 mt-0.5">{penyakit.id_penyakit}</p>
						)}
					</div>
					<button
						onClick={onClose}
						disabled={loading}
						className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40">
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
					{generalError && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
							{generalError}
						</div>
					)}

					{/* ID Ticket */}
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							ID Ticket <span className="text-red-400">*</span>
						</label>
						<SearchableSelect
							options={ticketOptions}
							value={form.id_ticket}
							onChange={(val) => handleSelectChange("id_ticket", val)}
							onSearchChange={handleTicketSearch}
							placeholder="Cari Ticket..."
							loading={ticketLoading}
							error={errors.id_ticket ? errors.id_ticket[0] : undefined}
						/>
						{errors.id_ticket && (
							<p className="text-red-500 text-xs mt-1">{errors.id_ticket[0]}</p>
						)}
					</div>

					{/* Signalment Section */}
					<div className="border-t border-gray-100 pt-4 mt-2">
						<h3 className="text-md font-semibold text-gray-700 mb-3">
							Data Signalment
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputField
								label="Nama Ternak"
								name="signalment_nama"
								value={form.signalment_nama}
								error={errors.signalment_nama}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Kelurahan"
								name="signalment_kelurahan"
								value={form.signalment_kelurahan}
								error={errors.signalment_kelurahan}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Kecamatan"
								name="signalment_kecamatan"
								value={form.signalment_kecamatan}
								error={errors.signalment_kecamatan}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Jenis Ternak"
								name="signalment_jenis"
								value={form.signalment_jenis}
								error={errors.signalment_jenis}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Ras"
								name="signalment_ras"
								value={form.signalment_ras}
								error={errors.signalment_ras}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<SelectField
								label="Jenis Kelamin"
								name="signalment_jenisKelamin"
								options={JENIS_KELAMIN_OPTIONS}
								value={form.signalment_jenisKelamin}
								error={errors.signalment_jenisKelamin}
								onChange={handleChange}
							/>
							<InputField
								label="Umur (Tahun)"
								name="signalment_umur"
								type="number"
								value={form.signalment_umur}
								error={errors.signalment_umur}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Berat (KG)"
								name="signalment_berat"
								type="number"
								value={form.signalment_berat}
								error={errors.signalment_berat}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Warna"
								name="signalment_warna"
								value={form.signalment_warna}
								error={errors.signalment_warna}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Ear Tag"
								name="signalment_ear_tag"
								value={form.signalment_ear_tag}
								error={errors.signalment_ear_tag}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
						</div>
					</div>

					{/* Clinical Section */}
					<div className="border-t border-gray-100 pt-4 mt-2">
						<h3 className="text-md font-semibold text-gray-700 mb-3">Data Klinis</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputField
								label="Status Umum"
								name="status_umum"
								value={form.status_umum}
								error={errors.status_umum}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Status Mukosa"
								name="status_mukosa"
								value={form.status_mukosa}
								error={errors.status_mukosa}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
							<InputField
								label="Suhu Tubuh"
								name="status_suhu"
								value={form.status_suhu}
								error={errors.status_suhu}
								onChange={handleChange}
								onNumberChange={handleNumberChange}
							/>
						</div>
						<TextAreaField
							label="Anamnesa"
							name="anamnesa"
							value={form.anamnesa}
							error={errors.anamnesa}
							onChange={handleChange}
							rows={2}
						/>
						<TextAreaField
							label="Simptom"
							name="simptom"
							value={form.simptom}
							error={errors.simptom}
							onChange={handleChange}
							rows={2}
						/>
					</div>

					{/* Diagnosis & Treatment Section */}
					<div className="border-t border-gray-100 pt-4 mt-2">
						<h3 className="text-md font-semibold text-gray-700 mb-3">
							Diagnosis & Pengobatan
						</h3>
						<TextAreaField
							label="Diagnosa"
							name="diagnosa"
							value={form.diagnosa}
							error={errors.diagnosa}
							onChange={handleChange}
							rows={2}
						/>
						<TextAreaField
							label="Pengobatan"
							name="pengobatan"
							value={form.pengobatan}
							error={errors.pengobatan}
							onChange={handleChange}
							rows={2}
						/>
						<SelectField
							label="Prognosis"
							name="prognosis"
							options={PROGNOSIS_OPTIONS}
							value={form.prognosis}
							error={errors.prognosis}
							onChange={handleChange}
						/>
					</div>

					{/* Date */}
					<div className="border-t border-gray-100 pt-4 mt-2">
						<InputField
							label="Tanggal"
							name="tanggal"
							type="date"
							value={form.tanggal}
							error={errors.tanggal}
							onChange={handleChange}
							onNumberChange={handleNumberChange}
						/>
					</div>

					{/* Buttons */}
					<div className="flex items-center gap-3 pt-4 border-t border-gray-100">
						<button
							type="button"
							onClick={onClose}
							disabled={loading}
							className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40">
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60">
							{loading ? (
								<>
									<Loader2 size={14} className="animate-spin" />
									{isEdit ? "Menyimpan..." : "Menambahkan..."}
								</>
							) : isEdit ? (
								"Simpan Perubahan"
							) : (
								"Simpan Penyakit"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

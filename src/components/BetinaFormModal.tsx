import { useState, useEffect, useRef } from "react";
import { X, Loader2, Plus } from "lucide-react";
import type {
	BetinaFormPayload,
	BetinaFormErrors,
	BetinaFormModalProps,
} from "../types/Betina";
import { addBetina } from "../service/betinaService";
import { getPeternak,searchPeternak } from "../service/peternakService";
// import type { Peternak } from "../types/Peternak";
import SearchableSelect from "./SearchableSelect";

const EMPTY_FORM: BetinaFormPayload = {
	eartag: "",
	nama: "",
	peternak: "",
	jenis: "",
	tanggal: "",
};
interface PeternakOption {
	value: string;
	label: string;
}

export default function BetinaFormModal({
	open,
	onClose,
	onSuccess,
}: BetinaFormModalProps) {
	const [form, setForm] = useState<BetinaFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<BetinaFormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [peternakOptions, setPeternakOptions] = useState<PeternakOption[]>([]);
	const [initialPeternakOptions, setInitialPeternakOptions] = useState<
		PeternakOption[]
	>([]);
	const [peternakLoading, setPeternakLoading] = useState(false);
	const peternakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const peternakControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();

		// eslint-disable-next-line react-hooks/set-state-in-effect
	setPeternakLoading(true);
		getPeternak({ page: 1 }, controller.signal)
			.then((res) => {
				const opts = res.data.data.map((p) => ({
					value: p.id_peternak,
					label: `${p.id_peternak} - ${p.nama}`,
				}));
				setInitialPeternakOptions(opts);
				setPeternakOptions(opts);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load peternak:", err);
				}
			})
			.finally(() => setPeternakLoading(false));

		setForm(EMPTY_FORM);
		setErrors({});
		setGeneralError(null);

		return () => controller.abort();
	}, [open]);

	if (!open) return null;

	// const peternakOptions = peternakList.map((p) => ({
	// 	value: p.id_peternak,
	// 	label: `${p.id_peternak} - ${p.nama}`,
	// }));
	const handlePeternakSearch = (query: string) => {
			if (peternakTimerRef.current) clearTimeout(peternakTimerRef.current);
	
			if (!query.trim()) {
				setPeternakOptions(initialPeternakOptions);
				return;
			}
	
			peternakTimerRef.current = setTimeout(() => {
				peternakControllerRef.current?.abort();
				const controller = new AbortController();
				peternakControllerRef.current = controller;
				setPeternakLoading(true);
	
				searchPeternak({ q: query.trim() }, controller.signal)
					.then((data) => {
						const list = Array.isArray(data) ? data : [];
						setPeternakOptions(
							list.map((p) => ({
								value: p.id_peternak,
								label: `${p.id_peternak} - ${p.text ?? p.id_peternak}`,
							})),
						);
					})
					.catch((err) => {
						if (err.name !== "AbortError") {
							console.error("Failed to search peternak:", err);
						}
					})
					.finally(() => setPeternakLoading(false));
			}, 300);
		};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handlePeternakChange = (val: string) => {
		setForm((prev) => ({ ...prev, peternak: val, betina: "" }));
		setErrors((prev) => ({ ...prev, peternak: undefined, betina: undefined }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: BetinaFormErrors = {};
		if (!form.eartag.trim()) errs.ear_tag = "Ear Tag wajib diisi";
		if (!form.nama.trim()) errs.nama = "Nama betina wajib diisi";
		if (!form.peternak.trim()) errs.peternak = "Peternak wajib dipilih";
		if (!form.jenis.trim()) errs.jenis = "Jenis sapi wajib diisi";
		if (!form.tanggal.trim()) errs.tanggal = "Tanggal lahir wajib diisi";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			await addBetina(form);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError("Gagal menambahkan data betina");
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
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
					<div>
						<h2 className="text-lg font-bold text-gray-800">Tambah Betina</h2>
						<p className="text-xs text-gray-400 mt-0.5">
							Home / Peternak / Add Betina
						</p>
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

					<FormField label="Ear Tag" required error={errors.ear_tag}>
						<input
							type="text"
							name="eartag"
							value={form.eartag}
							onChange={handleChange}
							placeholder="Contoh: ET-001"
							className={inputClass(errors.ear_tag)}
						/>
					</FormField>

					<FormField label="Nama" required error={errors.nama}>
						<input
							type="text"
							name="nama"
							value={form.nama}
							onChange={handleChange}
							placeholder="Contoh: Sapi Betina 01"
							className={inputClass(errors.nama)}
						/>
					</FormField>

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Id Peternak <span className="text-red-400">*</span>
						</label>
						<SearchableSelect
							options={peternakOptions}
							value={form.peternak}
							onChange={handlePeternakChange}
							onSearchChange={handlePeternakSearch}
							placeholder="Cari ID / Nama Peternak..."
							loading={peternakLoading}
							error={errors.peternak ? errors.peternak[0] : undefined}
						/>
						{errors.peternak && (
							<p className="text-red-500 text-xs mt-1">{errors.peternak[0]}</p>
						)}
					</div>

					<FormField label="Jenis Sapi" required error={errors.jenis}>
						<input
							type="text"
							name="jenis"
							value={form.jenis}
							onChange={handleChange}
							placeholder="Contoh: Limousin"
							className={inputClass(errors.jenis)}
						/>
					</FormField>

					<FormField label="Tanggal Lahir" required error={errors.tanggal}>
						<input
							type="date"
							name="tanggal"
							value={form.tanggal}
							onChange={handleChange}
							className={inputClass(errors.tanggal)}
						/>
					</FormField>

					<div className="flex items-center gap-3 pt-2">
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
									Menambahkan...
								</>
							) : (
								<>
									<Plus size={14} />
									Simpan Betina
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function FormField({
	label,
	required,
	error,
	children,
}: {
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-600 mb-1.5">
				{label} {required && <span className="text-red-400">*</span>}
			</label>
			{children}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}

function inputClass(error?: string) {
	return `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
		error
			? "border-red-400 bg-red-50"
			: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
	}`;
}

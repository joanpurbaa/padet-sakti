import { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import type {
	KejadianFormPayload,
	KejadianFormErrors,
	KejadianFormModalProps,
} from "../types/Kejadian";
import { addKejadian, editKejadian } from "../service/kejadianService";
import { searchPeternak } from "../service/peternakService";
import { searchBetina } from "../service/betinaService";
import type { BetinaSearchItem } from "../service/betinaService";
import SearchableSelect from "./SearchableSelect";

// const STATUS_OPTIONS = [
// 	"Belum Ada Tindakan",
// 	"BOLEH IB",
// 	"Sedang Proses IB",
// 	"Kelahiran Pada IB ke-1",
// 	"Kelahiran Pada IB ke-2",
// 	"Kelahiran Pada IB ke-3",
// ];

const EMPTY_FORM: KejadianFormPayload = {
	betina: "",
	peternak: "",
	status: "Belum Ada Tindakan",
	hasil: "",
	tanggal: "",
};

interface PeternakOption {
	value: string;
	label: string;
}

export default function KejadianFormModal({
	open,
	onClose,
	onSuccess,
	kejadian,
}: KejadianFormModalProps) {
	const isEdit = !!kejadian;

	const [form, setForm] = useState<KejadianFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<KejadianFormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [peternakOptions, setPeternakOptions] = useState<PeternakOption[]>([]);
	const [initialPeternakOptions] = useState<
		PeternakOption[]
	>([]);
	const [peternakLoading, setPeternakLoading] = useState(false);
	const peternakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const peternakControllerRef = useRef<AbortController | null>(null);

	const [betinaList, setBetinaList] = useState<BetinaSearchItem[]>([]);
	const [betinaLoading, setBetinaLoading] = useState(false);

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPeternakLoading(true);
			searchPeternak({ }, controller.signal)
				.then((data) => {
					const list = Array.isArray(data) ? data : [];
					console.log("Peternak search result:", data);
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
		// 	console.log("Kejadian data:", kejadian);
		if (kejadian) {
			setForm({
				betina: kejadian.id_betina ?? "",
				peternak: kejadian.id_peternak ?? "",
				status: kejadian.status ?? "Belum Ada Tindakan",
				hasil: kejadian.hasil ?? "",
				tanggal: kejadian.created_at ? kejadian.created_at.split("T")[0] : "",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setBetinaList([]);
		setErrors({});
		setGeneralError(null);

		return () => {
			controller.abort();
			peternakControllerRef.current?.abort();
			if (peternakTimerRef.current) clearTimeout(peternakTimerRef.current);
		};
	}, [open, kejadian]);

	const fetchBetinaByPeternak = useCallback((idPeternak: string) => {
		if (!idPeternak.trim()) {
			setBetinaList([]);
			return;
		}

		const controller = new AbortController();
		setBetinaLoading(true);

		searchBetina(idPeternak, controller.signal)
			.then((data) => {
				setBetinaList(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to search betina:", err);
				}
			})
			.finally(() => setBetinaLoading(false));
	}, []);

	useEffect(() => {
		if (!open) return;
		if (form.peternak) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchBetinaByPeternak(form.peternak);
		}
	}, [open, form.peternak, fetchBetinaByPeternak]);

	if (!open) return null;

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

	const betinaOptions = betinaList.map((b) => ({
		value: b.ear_tag,
		label: `${b.ear_tag} - ${b.nama}`,
	}));

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const handlePeternakChange = (val: string) => {
		setForm((prev) => ({ ...prev, peternak: val, betina: "" }));
		setErrors((prev) => ({ ...prev, peternak: undefined, betina: undefined }));
		setGeneralError(null);
		setBetinaList([]);
	};

	const handleBetinaChange = (val: string) => {
		setForm((prev) => ({ ...prev, betina: val }));
		setErrors((prev) => ({ ...prev, betina: undefined }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: KejadianFormErrors = {};
		if (!form.peternak.trim()) errs.peternak = ["ID Peternak wajib dipilih"];
		if (!form.betina.trim()) errs.betina = ["ID Betina wajib dipilih"];
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			if (isEdit && kejadian) {
				await editKejadian(kejadian.id_kejadian, form);
			} else {
				await addKejadian(form);
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit ? "Gagal mengubah data kejadian" : "Gagal menambahkan kejadian",
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
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
					<div>
						<h2 className="text-lg font-bold text-gray-800">
							{isEdit ? "Edit Kejadian" : "Tambah Kejadian"}
						</h2>
						{isEdit && kejadian && (
							<p className="text-xs text-gray-400 mt-0.5">{kejadian.id_kejadian}</p>
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

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							ID Betina <span className="text-red-400">*</span>
						</label>
						<SearchableSelect
							options={betinaOptions}
							value={form.betina}
							onChange={handleBetinaChange}
							placeholder={
								form.peternak ? "Cari Betina..." : "Pilih peternak terlebih dahulu"
							}
							loading={betinaLoading}
							disabled={!form.peternak}
							error={errors.betina ? errors.betina[0] : undefined}
						/>
						{errors.betina && (
							<p className="text-red-500 text-xs mt-1">{errors.betina[0]}</p>
						)}
					</div>

					{/* {isEdit && (
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1.5">
								Status <span className="text-red-400">*</span>
							</label>
							<select
								name="status"
								value={form.status}
								onChange={handleChange}
								className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors cursor-pointer ${
									errors.status
										? "border-red-400 bg-red-50"
										: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
								}`}>
								{STATUS_OPTIONS.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
							{errors.status && (
								<p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>
							)}
						</div>
					)} */}

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Tanggal
						</label>
						<input
							type="date"
							name="tanggal"
							value={form.tanggal}
							onChange={handleChange}
							className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-colors"
						/>
					</div>

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
									{isEdit ? "Menyimpan..." : "Menambahkan..."}
								</>
							) : isEdit ? (
								"Simpan Perubahan"
							) : (
								"Simpan Kejadian"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

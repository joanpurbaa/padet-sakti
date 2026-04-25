import { useState, useEffect } from "react";
import { X, Loader2, Plus, AlertTriangle } from "lucide-react";
import { addPeternak, editPeternak } from "../service/peternakService";
import type {
	PeternakFormPayload,
	EditPeternakPayload,
	PeternakModalProps,
} from "../types/Peternak";

const JENIS_OPTIONS = ["SAPI", "KAMBING", "DOMBA", "KERBAU"];

interface FormState {
	name: string;
	address: string;
	jenis: string;
	phone: string;
}

const EMPTY_FORM: FormState = {
	name: "",
	address: "",
	jenis: "",
	phone: "",
};

export default function PeternakFormModal({
	open,
	onClose,
	onSuccess,
	peternak,
}: PeternakModalProps) {
	const isEdit = !!peternak;

	const [form, setForm] = useState<FormState>(EMPTY_FORM);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [serverWarning, setServerWarning] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open) return;

		if (peternak) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setForm({
				name: peternak.nama ?? "",
				address: peternak.alamat ?? "",
				jenis: peternak.jenis_ternak ?? "",
				phone: peternak.no_hp ?? "",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setErrors({});
		setGeneralError(null);
		setServerWarning(false);
	}, [open, peternak]);

	if (!open) return null;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!form.name.trim()) errs.name = "Nama peternak wajib diisi";
		if (!form.address.trim()) errs.address = "Alamat wajib diisi";
		if (isEdit) {
			if (!form.phone.trim()) errs.phone = "Nomor HP wajib diisi";
			else if (form.phone.length > 15)
				errs.phone = "Nomor HP maksimal 15 karakter";
		} else {
			if (!form.jenis.trim()) errs.jenis = "Jenis ternak wajib dipilih";
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);
		setServerWarning(false);

		try {
			if (isEdit && peternak) {
				const editPayload: EditPeternakPayload = {
					name: form.name,
					address: form.address,
					phone: form.phone,
				};
				const result = await editPeternak(peternak.id_peternak, editPayload);
				if (result.serverError) {
					setServerWarning(true);
				}
			} else {
				const addPayload: PeternakFormPayload = {
					name: form.name,
					address: form.address,
					jenis: form.jenis,
				};
				const result = await addPeternak(addPayload);
				if (result.serverError) {
					setServerWarning(true);
				}
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit
						? "Gagal mengubah data peternak"
						: "Gagal menambahkan data peternak",
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
							{isEdit ? "Edit Peternak" : "Tambah Peternak"}
						</h2>
						{isEdit && peternak ? (
							<p className="text-xs text-gray-400 mt-0.5">{peternak.id_peternak}</p>
						) : (
							<p className="text-xs text-gray-400 mt-0.5">Home / Add Peternak</p>
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

					{serverWarning && (
						<div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
							<AlertTriangle size={14} className="shrink-0" />
							<span>
								Data kemungkinan tersimpan, tapi server return error. Silakan cek data.
							</span>
						</div>
					)}

					<FormField label="Nama Peternak" required error={errors.name}>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Contoh: HANI"
							className={inputClass(errors.name)}
						/>
					</FormField>

					<FormField label="Alamat" required error={errors.address}>
						<input
							type="text"
							name="address"
							value={form.address}
							onChange={handleChange}
							placeholder="Contoh: Dusun Pabuaran, RT 5 RW 1"
							className={inputClass(errors.address)}
						/>
					</FormField>

					{isEdit ? (
						<FormField label="Nomor HP" required error={errors.phone}>
							<input
								type="text"
								name="phone"
								value={form.phone}
								onChange={handleChange}
								placeholder="Contoh: 082275338090"
								className={inputClass(errors.phone)}
							/>
						</FormField>
					) : (
						<FormField label="Jenis Ternak" required error={errors.jenis}>
							<select
								name="jenis"
								value={form.jenis}
								onChange={handleChange}
								className={selectClass(errors.jenis)}>
								<option value="">Pilih jenis ternak</option>
								{JENIS_OPTIONS.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
						</FormField>
					)}

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
								<>
									<Plus size={14} />
									Simpan Peternak
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

function selectClass(error?: string) {
	return `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors cursor-pointer ${
		error
			? "border-red-400 bg-red-50"
			: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
	}`;
}

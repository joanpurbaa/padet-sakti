import { useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { addPejantan, editPejantan } from "../service/pejantanService";
import type {
	PejantanFormPayload,
	PejantanModalProps,
} from "../types/Pejantan";

const EMPTY_FORM: PejantanFormPayload = {
	pejantan: "",
	pembuatan: "",
	jenis: "",
	asal: "",
};

export default function PejantanFormModal({
	open,
	onClose,
	onSuccess,
	pejantan,
}: PejantanModalProps) {
	const isEdit = !!pejantan;

	const [form, setForm] = useState<PejantanFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open) return;

		if (pejantan) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setForm({
				pejantan: pejantan.id_pejantan ?? "",
				pembuatan: pejantan.id_pembuatan ?? "",
				jenis: pejantan.jenis_straw ?? "",
				asal: pejantan.asal_straw ?? "",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setErrors({});
		setGeneralError(null);
	}, [open, pejantan]);

	if (!open) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!form.pejantan.trim()) errs.pejantan = "ID Pejantan wajib diisi";
		if (!form.pembuatan.trim()) errs.pembuatan = "ID Pembuatan wajib diisi";
		if (!form.jenis.trim()) errs.jenis = "Jenis Straw wajib diisi";
		if (!form.asal.trim()) errs.asal = "Asal Straw wajib diisi";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			if (isEdit && pejantan) {
				await editPejantan(pejantan.id_pejantan, form);
			} else {
				await addPejantan(form);
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit
						? "Gagal mengubah data pejantan"
						: "Gagal menambahkan data pejantan",
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
							{isEdit ? "Edit Pejantan" : "Tambah Pejantan"}
						</h2>
						{isEdit && pejantan ? (
							<p className="text-xs text-gray-400 mt-0.5">{pejantan.id_pejantan}</p>
						) : (
							<p className="text-xs text-gray-400 mt-0.5">Home / Add Pejantan</p>
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

					<FormField label="ID Pejantan" required error={errors.pejantan}>
						<input
							type="text"
							name="pejantan"
							value={form.pejantan}
							onChange={handleChange}
							placeholder="Contoh: idpejantan-001"
							disabled={isEdit}
							className={isEdit ? disabledClass : inputClass(errors.pejantan)}
						/>
					</FormField>

					<FormField label="ID Pembuatan" required error={errors.pembuatan}>
						<input
							type="text"
							name="pembuatan"
							value={form.pembuatan}
							onChange={handleChange}
							placeholder="Contoh: idpembuatan-001"
							className={inputClass(errors.pembuatan)}
						/>
					</FormField>

					<FormField label="Jenis Straw" required error={errors.jenis}>
						<input
							type="text"
							name="jenis"
							value={form.jenis}
							onChange={handleChange}
							placeholder="Contoh: Limousin"
							className={inputClass(errors.jenis)}
						/>
					</FormField>

					<FormField label="Asal Straw" required error={errors.asal}>
						<input
							type="text"
							name="asal"
							value={form.asal}
							onChange={handleChange}
							placeholder="Contoh: Banjar"
							className={inputClass(errors.asal)}
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
									{isEdit ? "Menyimpan..." : "Menambahkan..."}
								</>
							) : isEdit ? (
								"Simpan Perubahan"
							) : (
								<>
									<Plus size={14} />
									Simpan Pejantan
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

const disabledClass =
	"w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-100 cursor-not-allowed";

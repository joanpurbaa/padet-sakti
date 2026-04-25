import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type {
	StaffFormPayload,
	StaffFormErrors,
	StaffFormModalProps,
} from "../types/Staff";
import { addStaff, editStaff } from "../service/staffService";

const EMPTY_FORM: StaffFormPayload = {
	name: "",
	// izin: "",
	asal: "",
	phone: "",
};

export default function StaffFormModal({
	open,
	onClose,
	onSuccess,
	staff,
}: StaffFormModalProps) {
	const isEdit = !!staff;

	const [form, setForm] = useState<StaffFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<StaffFormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && staff) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setForm({
				name: staff.nama ?? "",
				// izin: staff.surat_izin ?? "",
				asal: staff.asal ?? "",
				phone: staff.no_hp ?? "",
			});
			setErrors({});
			setGeneralError(null);
		} else if (open && !staff) {
			setForm(EMPTY_FORM);
			setErrors({});
			setGeneralError(null);
		}
	}, [open, staff]);

	if (!open) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: StaffFormErrors = {};
		if (!form.name.trim()) errs.name = ["Nama wajib diisi"];
		if (form.name.length > 255) errs.name = ["Nama maksimal 255 karakter"];
		// if (!form.izin.trim()) errs.izin = ["Surat izin wajib diisi"];
		// if (form.izin.length > 255) errs.izin = ["Surat izin maksimal 255 karakter"];
		if (!form.asal.trim()) errs.asal = ["Asal wajib diisi"];
		if (form.asal.length > 255) errs.asal = ["Asal maksimal 255 karakter"];
		if (!form.phone.trim()) errs.phone = ["No. HP wajib diisi"];
		else if (form.phone.length > 15) errs.phone = ["No. HP maksimal 15 karakter"];
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			if (isEdit && staff) {
				await editStaff(staff.id_staff, form);
			} else {
				await addStaff(form);
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit ? "Gagal mengubah data staff" : "Gagal menambahkan staff",
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
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
					<div>
						<h2 className="text-lg font-bold text-gray-800">
							{isEdit ? "Edit Staff" : "Tambah Staff"}
						</h2>
						{isEdit && staff && (
							<p className="text-xs text-gray-400 mt-0.5">{staff.id_staff}</p>
						)}
					</div>
					<button
						onClick={onClose}
						disabled={loading}
						className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40">
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{generalError && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
							{generalError}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Nama <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Nama staff"
							className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
								errors.name
									? "border-red-400 bg-red-50"
									: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
							}`}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							No. HP <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							placeholder="Contoh: 081234567890"
							className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
								errors.phone
									? "border-red-400 bg-red-50"
									: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
							}`}
						/>
						{errors.phone && (
							<p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
						)}
					</div>

					{/* <div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Surat Izin <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							name="izin"
							value={form.izin}
							onChange={handleChange}
							placeholder="Contoh: Sk-1234"
							className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
								errors.izin
									? "border-red-400 bg-red-50"
									: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
							}`}
						/>
						{errors.izin && (
							<p className="text-red-500 text-xs mt-1">{errors.izin[0]}</p>
						)}
					</div> */}

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Asal <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							name="asal"
							value={form.asal}
							onChange={handleChange}
							placeholder="Contoh: Banjar"
							className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
								errors.asal
									? "border-red-400 bg-red-50"
									: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
							}`}
						/>
						{errors.asal && (
							<p className="text-red-500 text-xs mt-1">{errors.asal[0]}</p>
						)}
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
								"Simpan Staff"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { EditBetinaModalProps, BetinaUpdateErrors } from "../types/Betina";
import { updateBetina } from "../service/betinaService";

export default function EditBetinaModal({
	open,
	onClose,
	onSuccess,
	betina,
}: EditBetinaModalProps) {
	const [form, setForm] = useState({
		eartag: "",
		nama: "",
		peternak: "",
		jenis: "",
		tanggal: "",
	});
	const [errors, setErrors] = useState<BetinaUpdateErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	useEffect(() => {
		if (betina) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setForm({
				eartag: betina.ear_tag ?? "",
				nama: betina.nama ?? "",
				peternak: betina.id_peternak ?? "",
				jenis: betina.jenis_sapi ?? "",
				tanggal: betina.tanggal_lahir ?? "",
			});
			setErrors({});
			setServerError(null);
		}
	}, [betina]);

	if (!open || !betina) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		setServerError(null);
		setErrors({});

		try {
			await updateBetina(betina.ear_tag, form);
			onSuccess();
			onClose();
		} catch (err) {
			const status = (err as { status?: number })?.status;
			if (status === 422) {
				setServerError("Data tidak valid. Periksa kembali isian.");
			} else {
				setServerError("Terjadi kesalahan. Coba lagi.");
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative bg-white rounded-xl shadow-xl w-full max-w-md z-10">
				<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h2 className="text-base font-semibold text-gray-800">Edit Sapi Betina</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
						<X size={18} />
					</button>
				</div>

				<div className="px-5 py-4 space-y-4">
					{serverError && (
						<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
							{serverError}
						</p>
					)}

					<Field
						label="Ear Tag"
						name="eartag"
						value={form.eartag}
						onChange={handleChange}
						error={errors.eartag?.[0]}
					/>
					<Field
						label="Nama"
						name="nama"
						value={form.nama}
						onChange={handleChange}
						error={errors.nama?.[0]}
					/>
					<Field
						label="ID Peternak"
						name="peternak"
						value={form.peternak}
						onChange={handleChange}
						error={errors.peternak?.[0]}
					/>
					<Field
						label="Jenis Sapi"
						name="jenis"
						value={form.jenis}
						onChange={handleChange}
						error={errors.jenis?.[0]}
					/>
					<Field
						label="Tanggal Lahir"
						name="tanggal"
						type="date"
						value={form.tanggal}
						onChange={handleChange}
						error={errors.tanggal?.[0]}
					/>
				</div>

				<div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
					<button
						onClick={onClose}
						disabled={submitting}
						className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50">
						Batal
					</button>
					<button
						onClick={handleSubmit}
						disabled={submitting}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
						{submitting && <Loader2 size={14} className="animate-spin" />}
						{submitting ? "Menyimpan..." : "Simpan"}
					</button>
				</div>
			</div>
		</div>
	);
}

interface FieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
	type?: string;
}

function Field({
	label,
	name,
	value,
	onChange,
	error,
	type = "text",
}: FieldProps) {
	return (
		<div className="space-y-1">
			<label className="block text-xs font-medium text-gray-600">{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
					error
						? "border-red-400 focus:border-red-500 bg-red-50"
						: "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
				}`}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}

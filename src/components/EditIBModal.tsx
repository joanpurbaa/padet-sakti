import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { editIB } from "../service/ibService";
import { getStaff } from "../service/staffService";
// import { getTickets } from "../service/ticketService";
import { searchTickets } from "../service/ticketService";
import { getPejantan } from "../service/pejantanService";
import type { Staff } from "../types/Staff";
import type { TicketSearchItem } from "../types/Ticket";
import type { Pejantan } from "../types/Pejantan";
import type { KejadianDetailIB } from "../types/Kejadian";
import SearchableSelect from "./SearchableSelect";

interface EditIBModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	ib: KejadianDetailIB | null;
}

interface IBEditForm {
	staff: string;
	ticket: string;
	pejantan: string;
	status: string;
	tanggal: string;
	keterangan: string;
}

const STATUS_OPTIONS = ["Telah Dilakukan Tindakan", "IB Berhasil", "IB Gagal"];

export default function EditIBModal({
	open,
	onClose,
	onSuccess,
	ib,
}: EditIBModalProps) {
	const [form, setForm] = useState<IBEditForm>({
		staff: "",
		ticket: "",
		pejantan: "",
		status: "Telah Dilakukan Tindakan",
		tanggal: "",
		keterangan: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [staffList, setStaffList] = useState<Staff[]>([]);
	const [staffLoading, setStaffLoading] = useState(false);

	const [ticketList, setTicketList] = useState<TicketSearchItem[]>([]);
	const [ticketLoading, setTicketLoading] = useState(false);

	const [pejantanList, setPejantanList] = useState<Pejantan[]>([]);
	const [pejantanLoading, setPejantanLoading] = useState(false);

	useEffect(() => {
		if (!open || !ib) return;

		const controller = new AbortController();

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStaffLoading(true);
		getStaff({ page: 1 }, controller.signal)
			.then((res) => {
				setStaffList(res.data.data);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load staff:", err);
				}
			})
			.finally(() => setStaffLoading(false));

		setTicketLoading(true);
		searchTickets({ kejadian: ib.id_kejadian, jenis: "IB" }, controller.signal)
			.then((data) => {
				setTicketList(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load tickets:", err);
				}
			})
			.finally(() => setTicketLoading(false));

		setPejantanLoading(true);
		getPejantan({ page: 1 }, controller.signal)
			.then((res) => {
				setPejantanList(res.data.data);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load pejantan:", err);
				}
			})
			.finally(() => setPejantanLoading(false));

		setForm({
			staff: ib.id_staff ?? "",
			ticket: ib.id_ticket ?? "",
			pejantan: ib.pejantan ?? "",
			status: ib.hasil ?? "Telah Dilakukan Tindakan",
			tanggal: ib.created_at ? ib.created_at.split(" ")[0] : "",
			keterangan: ib.keterangan ?? "",
		});
		setErrors({});
		setGeneralError(null);

		return () => controller.abort();
	}, [open, ib]);

	if (!open || !ib) return null;

	const staffOptions = staffList.map((s) => ({
		value: s.id_staff,
		label: `${s.id_staff} - ${s.nama}`,
	}));

	const ticketOptions = ticketList.map((t) => ({
		value: t.id_ticket,
		label: `${t.id_ticket} - ${t.nama ?? t.id_peternak}`,
	}));

	const pejantanOptions = pejantanList.map((p) => ({
		value: p.id_pejantan,
		label: `${p.id_pejantan} - ${p.id_pembuatan} - ${p.jenis_straw}`,
	}));

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
		setGeneralError(null);
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
		setGeneralError(null);
	};

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!form.staff.trim()) errs.staff = "Petugas wajib dipilih";
		if (!form.ticket.trim()) errs.ticket = "Ticket wajib dipilih";
		if (!form.pejantan.trim()) errs.pejantan = "Pejantan wajib dipilih";
		if (!form.status.trim()) errs.status = "Status wajib dipilih";
		if (!form.tanggal.trim()) errs.tanggal = "Tanggal wajib diisi";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			await editIB(ib.id_ib, {
				kejadian: ib.id_kejadian,
				staff: form.staff,
				ticket: form.ticket,
				status: form.status,
				pejantan: form.pejantan,
				tanggal: form.tanggal,
				keterangan: form.keterangan,
			});
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError("Gagal mengubah data inseminasi");
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
			<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
					<div>
						<h2 className="text-lg font-bold text-gray-800">
							Edit Inseminasi Buatan
						</h2>
						<p className="text-xs text-gray-400 mt-0.5">{ib.id_ib}</p>
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

					<FormField label="ID IB">
						<input
							type="text"
							value={ib.id_ib}
							disabled
							className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
						/>
					</FormField>

					<FormField label="Id Kejadian">
						<input
							type="text"
							value={ib.id_kejadian}
							disabled
							className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
						/>
					</FormField>

					<FormField label="Ticket" required error={errors.ticket}>
						<SearchableSelect
							options={ticketOptions}
							value={form.ticket}
							onChange={(val) => handleSelectChange("ticket", val)}
							placeholder="Cari Ticket..."
							loading={ticketLoading}
							error={errors.ticket}
						/>
					</FormField>

					<FormField label="Petugas Penanggung Jawab" required error={errors.staff}>
						<SearchableSelect
							options={staffOptions}
							value={form.staff}
							onChange={(val) => handleSelectChange("staff", val)}
							placeholder="Cari Staff..."
							loading={staffLoading}
							error={errors.staff}
						/>
					</FormField>

					<FormField label="Pejantan (Straw)" required error={errors.pejantan}>
						<SearchableSelect
							options={pejantanOptions}
							value={form.pejantan}
							onChange={(val) => handleSelectChange("pejantan", val)}
							placeholder="Cari Pejantan..."
							loading={pejantanLoading}
							error={errors.pejantan}
						/>
					</FormField>

					<FormField label="Status" required error={errors.status}>
						<select
							name="status"
							value={form.status}
							onChange={handleChange}
							className={selectClass(errors.status)}>
							{STATUS_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					</FormField>

					<FormField label="Keterangan" error={errors.keterangan}>
						<textarea
							name="keterangan"
							value={form.keterangan}
							onChange={handleChange}
							placeholder="Keterangan tambahan (opsional)"
							rows={3}
							className={textareaClass(errors.keterangan)}
						/>
					</FormField>

					<FormField label="Tanggal Diperbarui" required error={errors.tanggal}>
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
									Menyimpan...
								</>
							) : (
								"Simpan Perubahan"
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

function textareaClass(error?: string) {
	return `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors resize-none ${
		error
			? "border-red-400 bg-red-50"
			: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
	}`;
}

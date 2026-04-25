import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { addTicket, editTicket } from "../service/ticketService";
import { getStaff } from "../service/staffService";
import { getPeternak } from "../service/peternakService";
import type { Staff } from "../types/Staff";
import type { Peternak } from "../types/Peternak";
import type { TicketFormPayload, TicketFormErrors, TicketModalProps } from "../types/Ticket";
import SearchableSelect from "./SearchableSelect";

const JENIS_OPTIONS = ["IB", "PKB", "Kelahiran", "Penyakit", "Kebuntingan"];
const STATUS_OPTIONS = ["Pending", "Resolved"];

const EMPTY_FORM: TicketFormPayload = {
	staff: "",
	peternak: "",
	jenis: "",
	status: "Pending",
};

export default function TicketFormModal({
	open,
	onClose,
	onSuccess,
	ticket,
}: TicketModalProps) {
	const isEdit = !!ticket;

	const [form, setForm] = useState<TicketFormPayload>(EMPTY_FORM);
	const [errors, setErrors] = useState<TicketFormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [staffList, setStaffList] = useState<Staff[]>([]);
	const [staffLoading, setStaffLoading] = useState(false);

	const [peternakList, setPeternakList] = useState<Peternak[]>([]);
	const [peternakLoading, setPeternakLoading] = useState(false);

	useEffect(() => {
		if (!open) return;

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

		setPeternakLoading(true);
		getPeternak({ page: 1 }, controller.signal)
			.then((res) => {
				setPeternakList(res.data.data);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load peternak:", err);
				}
			})
			.finally(() => setPeternakLoading(false));

		if (ticket) {
			setForm({
				staff: ticket.id_staff ?? "",
				peternak: ticket.id_peternak ?? "",
				jenis: ticket.jenis_laporan ?? "",
				status: ticket.status ?? "Pending",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setErrors({});
		setGeneralError(null);

		return () => controller.abort();
	}, [open, ticket]);

	if (!open) return null;

	const staffOptions = staffList.map((s) => ({
		value: s.id_staff,
		label: `${s.id_staff} - ${s.nama}`,
	}));

	const peternakOptions = peternakList.map((p) => ({
		value: p.id_peternak,
		label: `${p.id_peternak} - ${p.nama}`,
	}));

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
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

	const validate = (): boolean => {
		const errs: TicketFormErrors = {};
		if (!form.staff.trim()) errs.staff = ["ID Staff wajib dipilih"];
		if (!form.peternak.trim()) errs.peternak = ["ID Peternak wajib dipilih"];
		if (!form.jenis.trim()) errs.jenis = ["Jenis laporan wajib dipilih"];
		if (!form.status.trim()) errs.status = ["Status wajib dipilih"];
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setGeneralError(null);

		try {
			if (isEdit && ticket) {
				await editTicket(ticket.id_ticket, form);
			} else {
				await addTicket(form);
			}
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError(
					isEdit ? "Gagal mengubah ticket" : "Gagal menambahkan ticket",
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
							{isEdit ? "Edit Ticket" : "Tambah Ticket"}
						</h2>
						{isEdit && ticket && (
							<p className="text-xs text-gray-400 mt-0.5">
								{ticket.id_ticket}
								{ticket.created_at && <span> · {ticket.created_at}</span>}
							</p>
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
							ID Staff <span className="text-red-400">*</span>
						</label>
						<SearchableSelect
							options={staffOptions}
							value={form.staff}
							onChange={(val) => handleSelectChange("staff", val)}
							placeholder="Cari Staff..."
							loading={staffLoading}
							error={errors.staff ? errors.staff[0] : undefined}
						/>
						{errors.staff && (
							<p className="text-red-500 text-xs mt-1">{errors.staff[0]}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							ID Peternak <span className="text-red-400">*</span>
						</label>
						<SearchableSelect
							options={peternakOptions}
							value={form.peternak}
							onChange={(val) => handleSelectChange("peternak", val)}
							placeholder="Cari Peternak..."
							loading={peternakLoading}
							error={errors.peternak ? errors.peternak[0] : undefined}
						/>
						{errors.peternak && (
							<p className="text-red-500 text-xs mt-1">{errors.peternak[0]}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-1.5">
							Jenis Laporan <span className="text-red-400">*</span>
						</label>
						<select
							name="jenis"
							value={form.jenis}
							onChange={handleChange}
							className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors cursor-pointer ${
								errors.jenis
									? "border-red-400 bg-red-50"
									: "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
							}`}>
							<option value="">Pilih jenis laporan</option>
							{JENIS_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
						{errors.jenis && (
							<p className="text-red-500 text-xs mt-1">{errors.jenis[0]}</p>
						)}
					</div>

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
							<option value="">Pilih status</option>
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
								"Simpan Ticket"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

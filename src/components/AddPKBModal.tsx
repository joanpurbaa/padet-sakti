import { useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { addPKB } from "../service/pkbService";
import { getStaff } from "../service/staffService";
// import { getTickets } from "../service/ticketService";
import { searchTickets } from "../service/ticketService";
import { searchIB } from "../service/ibService";
// import { getIB } from "../service/ibService";
import type { Staff } from "../types/Staff";
import type { TicketSearchItem } from "../types/Ticket";
import type { IB } from "../types/Ib";
import SearchableSelect from "./SearchableSelect";
import type { AddPKBModalProps, PKBForm } from "../types/PKB";

const STATUS_OPTIONS = ["PKB Berhasil", "PKB Gagal"];

const EMPTY_FORM: PKBForm = {
	ib: "",
	ticket: "",
	kejadian:"",
	staff: "",
	status: "PKB Berhasil",
	tanggal: "",
	keterangan: "",
};

export default function AddPKBModal({
	open,
	onClose,
	onSuccess,
	idKejadian,
}: AddPKBModalProps) {
	// const isEdit = !!pkb;
	const [form, setForm] = useState<PKBForm>(EMPTY_FORM);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [staffList, setStaffList] = useState<Staff[]>([]);
	const [staffLoading, setStaffLoading] = useState(false);

	const [ticketList, setTicketList] = useState<TicketSearchItem[]>([]);
	const [ticketLoading, setTicketLoading] = useState(false);

	const [ibList, setIbList] = useState<IB[]>([]);
	const [ibLoading, setIbLoading] = useState(false);

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

		// setTicketLoading(true);
		setTicketLoading(true);
		searchTickets({ kejadian: idKejadian, jenis: "PKB" }, controller.signal)
			.then((data) => {
				setTicketList(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load tickets:", err);
				}
			})
			.finally(() => setTicketLoading(false));

		setIbLoading(true);
		searchIB({ kejadian: idKejadian},  controller.signal)
			.then((data) => {
				setIbList(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load IB:", err);
				}
			})
			.finally(() => setIbLoading(false));

		// if (pkb) {
		// 	setForm({
		// 		kejadian: pkb.id_kejadian ?? "",
		// 		ib: pkb.id_ib ?? "",
		// 		staff: pkb.id_staff ?? "",
		// 		ticket: pkb.id_ticket ?? "",
		// 		status: pkb.hasil ?? "Telah Dilakukan Tindakan",
		// 		tanggal: pkb.created_at ? pkb.created_at.split(" ")[0] : "",
		// 		keterangan: pkb.keterangan ?? "",
		// 	});
		// } else {
			setForm(EMPTY_FORM);
		// }
		setErrors({});
		setGeneralError(null);

		return () => controller.abort();
	}, [open]);
	useEffect(() => {
			if (!open || !form.kejadian) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setTicketList([]);
				return;
			}
	
			const controller = new AbortController();
			setTicketLoading(true);
	
			searchTickets({ kejadian: form.kejadian, jenis: "IB" }, controller.signal)
				.then((data) => {
					setTicketList(Array.isArray(data) ? data : []);
				})
				.catch((err) => {
					if (err.name !== "AbortError") {
						console.error("Failed to load tickets:", err);
					}
				})
				.finally(() => setTicketLoading(false));
	
			return () => controller.abort();
		}, [open, form.kejadian]);
	
	if (!open) return null;

	const staffOptions = staffList.map((s) => ({
		value: s.id_staff,
		label: `${s.id_staff} - ${s.nama}`,
	}));

	const ticketOptions = ticketList.map((t) => ({
		value: t.id_ticket,
		label: `${t.id_ticket} - ${t.nama ?? t.id_peternak}`,
	}));

	const ibOptions = ibList.map((ib) => ({
		value: ib.id_ib,
		label: `${ib.id_ib}`,
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
		if (!form.ib.trim()) errs.ib = "IB wajib dipilih";
		if (!form.ticket.trim()) errs.ticket = "Ticket wajib dipilih";
		if (!form.staff.trim()) errs.staff = "Petugas wajib dipilih";
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
			await addPKB(idKejadian, {
				kejadian: idKejadian,
				ib: form.ib,
				ticket: form.ticket,
				staff: form.staff,
				status: form.status,
				tanggal: form.tanggal,
				keterangan: form.keterangan || undefined,
			});
			setForm(EMPTY_FORM);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setGeneralError(err.message);
			} else {
				setGeneralError("Gagal menambahkan data PKB");
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
						<h2 className="text-lg font-bold text-gray-800">Tambah PKB</h2>
						<p className="text-xs text-gray-400 mt-0.5">
							Home / Add_pkb / {idKejadian}
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

					<FormField label="Id Kejadian">
						<input
							type="text"
							value={idKejadian}
							disabled
							className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
						/>
					</FormField>

					<FormField label="Id IB" required error={errors.ib}>
						<SearchableSelect
							options={ibOptions}
							value={form.ib}
							onChange={(val) => handleSelectChange("ib", val)}
							placeholder="Cari IB..."
							loading={ibLoading}
							error={errors.ib}
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
							placeholder="Keterangan tambahan..."
							rows={3}
							className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
						/>
					</FormField>

					<FormField label="Tanggal" required error={errors.tanggal}>
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
								<>
									<Plus size={14} />
									Save PKB
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

import { useState, useEffect } from "react";
import {
	X,
	Check,
	LogOut,
	ChevronRight,
	CheckCircle2,
	Loader2,
	AlertCircle,
	FileText,
	Syringe,
	Search,
	Baby,
	Stethoscope,
	type LucideIcon,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { usePelaporan } from "../hooks/usePelaporan";
import type { StaffItem, JenisLaporan } from "../types/Pelaporan";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
	id: string;
	jenis: JenisLaporan;
	Icon: LucideIcon;
	name: string;
	desc: string;
	accentColor: string;
	accentBg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
	{
		id: "laporan-umum",
		jenis: "Admin",
		Icon: FileText,
		name: "Laporan Umum",
		desc: "Pengaduan atau informasi umum seputar kondisi ternak ke admin dinas.",
		accentColor: "#2563EB",
		accentBg: "#EFF6FF",
	},
	{
		id: "permintaan-ib",
		jenis: "IB",
		Icon: Syringe,
		name: "Permintaan IB",
		desc: "Ajukan Inseminasi Buatan untuk ternak Anda oleh petugas terlatih.",
		accentColor: "#7C3AED",
		accentBg: "#F5F3FF",
	},
	{
		id: "pemeriksaan-kebuntingan",
		jenis: "PKB",
		Icon: Search,
		name: "Pemeriksaan Kebuntingan",
		desc: "Pengecekan status kebuntingan pada ternak oleh petugas lapangan.",
		accentColor: "#0891B2",
		accentBg: "#ECFEFF",
	},
	{
		id: "laporan-kelahiran",
		jenis: "Kelahiran",
		Icon: Baby,
		name: "Laporan Kelahiran",
		desc: "Catat kelahiran ternak baru agar data populasi selalu akurat.",
		accentColor: "#059669",
		accentBg: "#ECFDF5",
	},
	{
		id: "pemeriksaan-penyakit",
		jenis: "Penyakit",
		Icon: Stethoscope,
		name: "Pemeriksaan Penyakit",
		desc: "Laporkan gejala penyakit dan minta pemeriksaan ke lokasi ternak.",
		accentColor: "#DC2626",
		accentBg: "#FEF2F2",
	},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

function getDisplayName(staff: StaffItem): string {
	return staff.nama_lengkap?.trim() ? staff.nama_lengkap : staff.nama;
}

function getDisplayRole(staff: StaffItem): string {
	if (staff.nama_lengkap?.startsWith("drh.")) return "Dokter Hewan";
	return "Petugas Lapangan";
}

function Navbar() {
	const { logout } = useAuthContext();
	return (
		<header className="h-16 bg-[#FEFAF6] border-b border-[#E8DDD3] sticky top-0 z-40">
			{/* Container disamakan dengan main content */}
			<div className="max-w-3xl mx-auto h-full flex items-center justify-between px-5 md:px-8">
				<div className="flex items-center gap-3">
					<img src="/icon.png" alt="Logo" className={`object-contain w-12 h-12`} />
					<div>
						<p className="text-[14px] font-bold text-gray-900 leading-none">
							Dinas Pangan
						</p>
						<p className="text-[11px] text-gray-500 mt-0.5">Portal Peternak</p>
					</div>
				</div>

				<button
					onClick={logout}
					className="flex items-center gap-2 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-gray-300 transition-all">
					<LogOut size={14} />
					<span className="hidden sm:inline">Keluar</span>
				</button>
			</div>
		</header>
	);
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
	service,
	onClick,
}: {
	service: Service;
	onClick: () => void;
}) {
	const { Icon, accentColor, accentBg } = service;
	return (
		<button
			onClick={onClick}
			className="group w-full text-left bg-white border border-gray-200/60 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
			<div
				className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
				style={{ background: accentBg }}>
				<Icon size={22} style={{ color: accentColor }} />
			</div>

			<p className="text-[16px] font-bold text-gray-900 mb-2">{service.name}</p>
			<p className="text-[13px] text-gray-500 leading-relaxed mb-6">
				{service.desc}
			</p>

			<div
				className="flex items-center gap-1.5 font-semibold text-[13px]"
				style={{ color: accentColor }}>
				<span>Pilih Layanan</span>
				<ChevronRight
					size={14}
					className="group-hover:translate-x-1 transition-transform"
				/>
			</div>
		</button>
	);
}

// ─── Petugas Item ─────────────────────────────────────────────────────────────

function PetugasItem({
	staff,
	selected,
	onSelect,
	disabled,
}: {
	staff: StaffItem;
	selected: boolean;
	onSelect: () => void;
	disabled?: boolean;
}) {
	const displayName = getDisplayName(staff);
	const displayRole = getDisplayRole(staff);

	return (
		<button
			onClick={onSelect}
			disabled={disabled}
			className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-100 text-left
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${
									selected
										? "border-blue-500 bg-blue-50"
										: "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
								}`}>
			<div
				className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors ${
					selected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
				}`}>
				{getInitials(displayName)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-[13px] font-medium text-gray-900 truncate">
					{displayName}
				</p>
				<p className="text-[11.5px] text-gray-400">{displayRole}</p>
			</div>
			<div
				className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
					selected ? "bg-blue-600 border-blue-600" : "border-gray-300"
				}`}>
				{selected && <Check size={9} className="text-white" strokeWidth={3} />}
			</div>
		</button>
	);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ show, message }: { show: boolean; message: string }) {
	return (
		<div
			className={`fixed bottom-5 left-1/2 z-[200] flex items-center gap-2.5 bg-gray-900 text-white px-4 py-3 rounded-lg text-[13px] font-medium shadow-xl whitespace-nowrap transition-all duration-300 ${
				show
					? "-translate-x-1/2 translate-y-0 opacity-100"
					: "-translate-x-1/2 translate-y-4 opacity-0 pointer-events-none"
			}`}>
			<CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
			{message}
		</div>
	);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ServiceModal({
	open,
	service,
	idPeternak,
	namaPeternak,
	alamat,
	onClose,
	onSuccess,
}: {
	open: boolean;
	service: Service | null;
	idPeternak: string;
	namaPeternak: string;
	alamat: string;
	onClose: () => void;
	onSuccess: (msg: string) => void;
}) {
	const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null);
	const [limitError, setLimitError] = useState<string | null>(null);

	const {
		staffList,
		staffLoading,
		staffError,
		limitLoading,
		submitLoading,
		fetchStaff,
		checkCanSubmit,
		submitTicket,
	} = usePelaporan();

	useEffect(() => {
		if (!open || !service) return;
		setSelectedStaff(null);
		setLimitError(null);
		fetchStaff();
		checkCanSubmit(idPeternak, service.jenis).catch((err: Error) => {
			setLimitError(
				err.message.includes("422") || err.message.includes("403")
					? `Laporan ${service.name} sudah dikirim hari ini.`
					: "Gagal memeriksa status pengiriman.",
			);
		});
	}, [open, service?.id]); // eslint-disable-line react-hooks/exhaustive-deps

	function handleClose() {
		if (submitLoading) return;
		setSelectedStaff(null);
		setLimitError(null);
		onClose();
	}

	async function handleSubmit() {
		if (!selectedStaff || !service || limitError) return;
		try {
			await submitTicket(idPeternak, selectedStaff.id_staff, service.jenis);
			const firstName = getDisplayName(selectedStaff).split(" ")[0];
			onSuccess(`${service.name} berhasil dikirim ke ${firstName}`);
			setSelectedStaff(null);
			onClose();
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "";
			if (msg.includes("422") || msg.includes("403")) {
				setLimitError(`Laporan ${service?.name} sudah dikirim hari ini.`);
			}
		}
	}

	if (!service) return null;

	const { Icon, accentColor, accentBg } = service;
	const isBlocked = !!limitError;
	const isLoading = limitLoading || submitLoading;
	const canSubmit = !!selectedStaff && !isBlocked && !isLoading;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-200 ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={handleClose}
			/>

			{/* Modal */}
			<div
				className={`fixed inset-0 z-[110] flex items-center justify-center px-4 transition-all duration-200 pointer-events-none`}>
				<div
					className={`bg-white rounded-2xl w-full max-w-[440px] shadow-2xl max-h-[90vh] overflow-y-auto transition-all duration-200 pointer-events-auto ${
						open
							? "opacity-100 scale-100 translate-y-0"
							: "opacity-0 scale-[.97] translate-y-2"
					}`}>
					{/* Header */}
					<div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-3">
						<div className="flex items-center gap-3">
							<div
								className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
								style={{ background: accentBg }}>
								<Icon size={17} style={{ color: accentColor }} strokeWidth={1.75} />
							</div>
							<div>
								<p className="text-[15px] font-semibold text-gray-900">
									{service.name}
								</p>
								<p className="text-[11.5px] text-gray-400">
									Pilih petugas yang menangani
								</p>
							</div>
						</div>
						<button
							onClick={handleClose}
							className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer shrink-0 mt-0.5">
							<X size={13} />
						</button>
					</div>

					<div className="px-5 py-4 space-y-4">
						{/* Limit error */}
						{limitError && (
							<div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[12.5px] rounded-lg px-3.5 py-3">
								<AlertCircle size={14} className="shrink-0 mt-0.5" />
								<span>{limitError} Coba lagi besok.</span>
							</div>
						)}

						{/* Peternak info */}
						<div>
							<p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
								Atas nama
							</p>
							<div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5">
								<div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
									{getInitials(namaPeternak || "?")}
								</div>
								<div>
									<p className="text-[13px] font-medium text-gray-900">{namaPeternak}</p>
									<p className="text-[11px] text-gray-400">
										{idPeternak} · {alamat}
									</p>
								</div>
							</div>
						</div>

						{/* Petugas */}
						<div>
							<p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
								Pilih petugas
							</p>
							{staffLoading || limitLoading ? (
								<div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-[13px]">
									<Loader2 size={15} className="animate-spin" />
									Memuat...
								</div>
							) : staffError ? (
								<div className="flex items-center gap-2 text-red-500 text-[12.5px] py-3">
									<AlertCircle size={13} />
									{staffError}
								</div>
							) : (
								<div className="space-y-1.5">
									{staffList.map((staff) => (
										<PetugasItem
											key={staff.id_staff}
											staff={staff}
											selected={selectedStaff?.id_staff === staff.id_staff}
											onSelect={() => setSelectedStaff(staff)}
											disabled={isBlocked}
										/>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="px-5 pb-5">
						<button
							onClick={handleSubmit}
							disabled={!canSubmit}
							className={`w-full py-3 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-all ${
								canSubmit
									? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
									: "bg-gray-100 text-gray-400 cursor-not-allowed"
							}`}>
							{submitLoading ? (
								<>
									<Loader2 size={14} className="animate-spin" />
									Mengirim...
								</>
							) : isBlocked ? (
								"Laporan sudah dikirim hari ini"
							) : selectedStaff ? (
								<>
									Kirim ke {getDisplayName(selectedStaff).split(" ")[0]}
									<ChevronRight size={14} />
								</>
							) : (
								"Pilih petugas dulu"
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PelaporanPeternak() {
	const { user } = useAuthContext();

	const [activeService, setActiveService] = useState<Service | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [toast, setToast] = useState({ show: false, message: "" });

	const idPeternak: string = (user as any)?.id_peternak ?? "";
	const namaPeternak: string = (user as any)?.nama ?? (user as any)?.name ?? "";
	const alamat: string = (user as any)?.alamat ?? "";

	function handleOpenService(service: Service) {
		setActiveService(service);
		setModalOpen(true);
	}

	function handleSuccess(message: string) {
		setToast({ show: true, message });
		setTimeout(() => setToast({ show: false, message: "" }), 3500);
	}

	return (
		<div className="min-h-screen bg-[#FEFAF6]">
			<Navbar />

			<main className="max-w-3xl mx-auto px-5 md:px-8 pt-12">
				<div className="mb-10">
					<h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
						Layanan Peternak
					</h1>
					<p className="text-[14px] text-gray-500">
						Pilih jenis layanan di bawah ini, dan petugas kami akan segera memproses
						permintaan Anda.
					</p>
				</div>

				{/* Menggunakan CSS Grid agar lebih rapi dan responsif */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{SERVICES.map((service) => (
						<ServiceCard
							key={service.id}
							service={service}
							onClick={() => handleOpenService(service)}
						/>
					))}
				</div>
			</main>

			<ServiceModal
				open={modalOpen}
				service={activeService}
				idPeternak={idPeternak}
				namaPeternak={namaPeternak}
				alamat={alamat}
				onClose={() => setModalOpen(false)}
				onSuccess={handleSuccess}
			/>

			<Toast show={toast.show} message={toast.message} />
		</div>
	);
}

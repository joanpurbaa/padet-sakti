// src/pages/PelaporanPeternak.tsx

import { useState, useEffect } from "react";
import {
	X,
	Check,
	ArrowRight,
	LogOut,
	ChevronRight,
	CheckCircle2,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { usePelaporan } from "../hooks/usePelaporan";
import type { StaffItem, JenisLaporan } from "../types/Pelaporan";

// ─── Mapping service → jenis API ─────────────────────────────────────────────

interface Service {
	id: string;
	jenis: JenisLaporan;
	icon: string;
	num: string;
	name: string;
	desc: string;
}

const SERVICES: Service[] = [
	{
		id: "laporan-umum",
		jenis: "Admin",
		icon: "📋",
		num: "01",
		name: "Laporan Umum",
		desc:
			"Laporkan pengaduan atau informasi umum seputar kondisi ternak Anda ke admin dinas.",
	},
	{
		id: "permintaan-ib",
		jenis: "IB",
		icon: "🧬",
		num: "02",
		name: "Permintaan IB",
		desc:
			"Ajukan permintaan Inseminasi Buatan (IB) untuk ternak Anda oleh petugas terlatih.",
	},
	{
		id: "pemeriksaan-kebuntingan",
		jenis: "PKB",
		icon: "🔍",
		num: "03",
		name: "Pemeriksaan Kebuntingan",
		desc:
			"Minta petugas melakukan pengecekan status kebuntingan pada ternak Anda.",
	},
	{
		id: "laporan-kelahiran",
		jenis: "Kelahiran",
		icon: "🐣",
		num: "04",
		name: "Laporan Kelahiran",
		desc:
			"Catat dan laporkan kelahiran ternak baru agar data populasi selalu akurat.",
	},
	{
		id: "pemeriksaan-penyakit",
		jenis: "Penyakit",
		icon: "💊",
		num: "05",
		name: "Pemeriksaan Penyakit",
		desc:
			"Laporkan gejala penyakit dan minta pemeriksaan langsung ke lokasi ternak Anda.",
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

/** Nama tampil: pakai nama_lengkap kalau ada, fallback ke nama */
function getDisplayName(staff: StaffItem): string {
	return staff.nama_lengkap?.trim() ? staff.nama_lengkap : staff.nama;
}

/** Role tampil: deteksi dari nama_lengkap prefix "drh." */
function getDisplayRole(staff: StaffItem): string {
	if (staff.nama_lengkap?.startsWith("drh.")) return "Dokter Hewan";
	return "Petugas Lapangan";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Navbar({ name, id }: { name: string; id: string }) {
	const { logout } = useAuthContext();

	return (
		<nav className="bg-[#FEFAF6] border-b border-[#E8DDD3] px-5 md:px-8 h-[60px] flex items-center justify-between sticky top-0 z-40">
			<div className="flex items-center gap-2.5">
				<div className="w-9 h-9 rounded-full bg-[#3B1A08] flex items-center justify-center text-base">
					🐄
				</div>
				<div>
					<p className="text-[15px] font-semibold text-[#3B1A08] leading-tight">
						Dinas Pangan Kota Banjar
					</p>
					<p className="text-[10px] text-[#9A6B4B] tracking-wide">Portal Peternak</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden sm:block text-right">
					<p className="text-[13px] font-medium text-[#3B1A08]">{name}</p>
					<p className="text-[11px] text-[#9A6B4B]">{id}</p>
				</div>
				<button
					onClick={logout}
					className="flex items-center gap-1.5 text-[12px] text-[#9A6B4B] border border-[#E8DDD3] bg-white px-3 py-1.5 rounded-lg hover:border-[#C4A882] hover:text-[#5C2D0A] transition-colors cursor-pointer">
					<LogOut size={13} />
					<span className="hidden sm:inline">Keluar</span>
				</button>
			</div>
		</nav>
	);
}

function ServiceCard({
	service,
	onClick,
}: {
	service: Service;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="group text-left bg-white border-[1.5px] border-[#E8DDD3] rounded-xl p-5 md:p-6 hover:border-[#C4A882] hover:shadow-lg hover:shadow-[#3B1A08]/8 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer w-full h-full">
			<div className="w-10 h-10 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center text-lg mb-4">
				{service.icon}
			</div>
			<p className="text-[10px] font-bold text-[#C4A882] tracking-[.08em] uppercase mb-1">
				{service.num}
			</p>
			<p className="text-[14px] font-bold text-[#3B1A08] mb-2 leading-snug">
				{service.name}
			</p>
			<p className="text-[12px] text-[#7C6A56] leading-relaxed mb-4">
				{service.desc}
			</p>
			<p className="flex items-center gap-1 text-[12px] font-semibold text-[#D97706] group-hover:gap-2 transition-all">
				Ajukan sekarang
				<ArrowRight size={12} />
			</p>
		</button>
	);
}

function PetugasItem({
	staff,
	selected,
	onSelect,
}: {
	staff: StaffItem;
	selected: boolean;
	onSelect: () => void;
}) {
	const displayName = getDisplayName(staff);
	const displayRole = getDisplayRole(staff);

	return (
		<button
			onClick={onSelect}
			className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[10px] border-[1.5px] transition-all duration-150 cursor-pointer text-left ${
				selected
					? "border-[#D97706] bg-[#FEF3C7]"
					: "border-[#E8DDD3] bg-white hover:border-[#D97706] hover:bg-[#FFFBF5]"
			}`}>
			<div
				className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
					selected ? "bg-[#D97706] text-white" : "bg-[#F0E8DF] text-[#9A6B4B]"
				}`}>
				{getInitials(displayName)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-[13px] font-semibold text-[#3B1A08] truncate">
					{displayName}
				</p>
				<p className="text-[11px] text-[#9A6B4B]">{displayRole}</p>
			</div>
			<div
				className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
					selected ? "bg-[#D97706] border-[#D97706]" : "border-[#E8DDD3]"
				}`}>
				{selected && <Check size={10} className="text-white" strokeWidth={3} />}
			</div>
		</button>
	);
}

function Toast({ show, message }: { show: boolean; message: string }) {
	return (
		<div
			className={`fixed bottom-6 left-1/2 z-[200] flex items-center gap-2.5 bg-[#3B1A08] text-white px-4 py-3 rounded-xl text-[13px] font-semibold shadow-2xl shadow-[#3B1A08]/40 whitespace-nowrap transition-all duration-300 ${
				show
					? "-translate-x-1/2 translate-y-0 opacity-100"
					: "-translate-x-1/2 translate-y-8 opacity-0 pointer-events-none"
			}`}>
			<div className="w-[22px] h-[22px] rounded-full bg-[#D97706] flex items-center justify-center shrink-0">
				<CheckCircle2 size={13} />
			</div>
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

	// Fetch staff + cek limit tiap kali modal dibuka
	useEffect(() => {
		if (!open || !service) return;

		setSelectedStaff(null);
		setLimitError(null);
		fetchStaff();

		checkCanSubmit(idPeternak, service.jenis).catch((err: Error) => {
			setLimitError(
				err.message.includes("422") || err.message.includes("403")
					? `Anda sudah mengirim laporan ${service.name} hari ini. Coba lagi besok.`
					: "Gagal memeriksa limit laporan.",
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
			onSuccess(`${service.name} berhasil dikirim ke ${firstName}!`);
			setSelectedStaff(null);
			onClose();
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "";
			if (msg.includes("422") || msg.includes("403")) {
				setLimitError(
					`Anda sudah mengirim laporan ${service.name} hari ini. Coba lagi besok.`,
				);
			}
		}
	}

	if (!service) return null;

	const isBlocked = !!limitError;
	const isLoading = limitLoading || submitLoading;
	const canSubmit = !!selectedStaff && !isBlocked && !isLoading;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-[#1C1005]/55 z-[100] transition-opacity duration-200 ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={handleClose}
			/>

			{/* Centered modal */}
			<div
				className={`fixed inset-0 z-110 flex items-center justify-center px-4 transition-all duration-200 ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}>
				<div
					className={`bg-white rounded-[20px] w-full max-w-[480px] px-6 pb-8 pt-6 max-h-[90vh] overflow-y-auto transition-all duration-200 ${
						open ? "scale-100 translate-y-0" : "scale-95 translate-y-2"
					}`}>
					{/* Service header */}
					<div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F0E8DF]">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-[8px] bg-[#FEF3C7] flex items-center justify-center text-base">
								{service.icon}
							</div>
							<div>
								<p className="text-[15px] font-bold text-[#3B1A08]">{service.name}</p>
								<p className="text-[11px] text-[#9A6B4B]">
									Pilih petugas yang menangani
								</p>
							</div>
						</div>
						<button
							onClick={handleClose}
							className="w-7 h-7 rounded-full bg-[#F0E8DF] flex items-center justify-center text-[#9A6B4B] hover:bg-[#E8DDD3] transition-colors cursor-pointer">
							<X size={13} />
						</button>
					</div>

					{/* Limit error banner */}
					{limitError && (
						<div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-[10px] px-3.5 py-3 mb-4">
							<AlertCircle size={14} className="shrink-0 mt-0.5" />
							<span>{limitError}</span>
						</div>
					)}

					{/* Peternak info */}
					<p className="text-[10px] font-bold text-[#9A6B4B] tracking-[.07em] uppercase mb-2">
						Data Anda
					</p>
					<div className="bg-[#FDF6EE] border border-[#E8DDD3] rounded-[10px] px-3.5 py-2.5 flex items-center gap-3 mb-5">
						<div className="w-8 h-8 rounded-full bg-[#3B1A08] flex items-center justify-center text-[11px] font-bold text-[#FEF3C7] shrink-0">
							{getInitials(namaPeternak)}
						</div>
						<div>
							<p className="text-[13px] font-semibold text-[#3B1A08]">
								{namaPeternak}
							</p>
							<p className="text-[11px] text-[#9A6B4B]">
								{idPeternak} · {alamat}
							</p>
						</div>
					</div>

					{/* Petugas list */}
					<p className="text-[10px] font-bold text-[#9A6B4B] tracking-[.07em] uppercase mb-2">
						Pilih Petugas
					</p>

					{staffLoading || limitLoading ? (
						<div className="flex items-center justify-center gap-2 py-8 text-[#9A6B4B] text-[13px]">
							<Loader2 size={16} className="animate-spin" />
							Memuat daftar petugas...
						</div>
					) : staffError ? (
						<div className="flex items-center gap-2 text-red-600 text-[12px] py-4">
							<AlertCircle size={14} />
							{staffError}
						</div>
					) : (
						<div className="flex flex-col gap-2 mb-5">
							{staffList.map((staff) => (
								<PetugasItem
									key={staff.id_staff}
									staff={staff}
									selected={selectedStaff?.id_staff === staff.id_staff}
									onSelect={() => !isBlocked && setSelectedStaff(staff)}
								/>
							))}
						</div>
					)}

					{/* Submit */}
					<button
						onClick={handleSubmit}
						disabled={!canSubmit}
						className={`w-full rounded-[10px] py-3.5 text-[14px] font-bold flex items-center justify-center gap-2 transition-all ${
							canSubmit
								? "bg-[#D97706] hover:bg-[#B45309] text-white cursor-pointer"
								: "bg-[#F0E8DF] text-[#C4A882] cursor-not-allowed"
						}`}>
						{submitLoading ? (
							<>
								<Loader2 size={15} className="animate-spin" />
								Mengirim...
							</>
						) : isBlocked ? (
							"Laporan sudah dikirim hari ini"
						) : selectedStaff ? (
							<>
								Kirim ke {getDisplayName(selectedStaff).split(" ")[0]}
								<ChevronRight size={15} />
							</>
						) : (
							"Pilih petugas dulu"
						)}
					</button>
				</div>
			</div>
		</>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PelaporanPeternak() {
	const { user } = useAuthContext();

	const [activeService, setActiveService] = useState<Service | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [toast, setToast] = useState({ show: false, message: "" });

	// Ambil data peternak dari user — sesuaikan field dengan type User kamu
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
		<div
			className="min-h-screen bg-[#FEFAF6]"
			style={{
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			}}>
			<Navbar name={namaPeternak} id={idPeternak} />

			<main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-14">
				<div className="mb-9">
					<span className="inline-block bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold tracking-[.08em] uppercase px-2.5 py-1.5 rounded-[4px] mb-3">
						Layanan Peternakan
					</span>
					<h1 className="text-[24px] md:text-[28px] font-bold text-[#3B1A08] leading-snug mb-2">
						Apa yang perlu kami
						<br />
						bantu hari ini?
					</h1>
					<p className="text-[14px] text-[#7C6A56] leading-relaxed">
						Pilih layanan di bawah dan kami akan segera menugaskan petugas yang tepat
						untuk Anda.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-3.5">
					{SERVICES.map((service) => (
						<div
							key={service.id}
							className="w-full sm:w-[calc(50%-7px)] lg:w-[calc(33.333%-10px)]">
							<ServiceCard
								service={service}
								onClick={() => handleOpenService(service)}
							/>
						</div>
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

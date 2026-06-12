import { useState, useEffect } from "react";

const FEATURES = [
	{
		num: "01",
		title: "Manajemen Tiket",
		desc:
			"Setiap laporan dari peternak masuk, tercatat, dan diteruskan ke petugas yang bertanggung jawab. Status tiket dipantau hingga selesai — tidak ada yang terlewat.",
		featured: true,
	},
	{
		num: "02",
		title: "Monitoring Ternak",
		desc:
			"Data populasi dan kondisi ternak setiap peternak terpantau terpusat, termasuk riwayat inseminasi buatan (IB) dan tingkat keberhasilannya.",
	},
	{
		num: "03",
		title: "Manajemen Penyakit",
		desc:
			"Riwayat penyakit, penanganan, dan obat-obatan tersimpan rapi untuk mendukung pencegahan dan tindakan cepat di lapangan.",
	},
	{
		num: "04",
		title: "Data Peternak",
		desc:
			"Profil lengkap setiap peternak, kepemilikan ternak, dan riwayat interaksi tersentralisasi — mudah dicari dan diperbarui kapan saja.",
	},
	{
		num: "05",
		title: "Manajemen Staff",
		desc:
			"Pengelolaan data petugas lapangan, pembagian tugas, dan pemantauan kinerja yang lebih terstruktur dan transparan.",
	},
	{
		num: "06",
		title: "Kejadian & Pelaporan",
		desc:
			"Insiden di lapangan dicatat, dilaporkan, dan menjadi dasar analisis yang mendukung pengambilan kebijakan dinas.",
	},
];

const BENEFITS = [
	{
		role: "Peternak",
		icon: "🧑‍🌾",
		accent: true,
		points: [
			"Laporan tanpa harus datang ke kantor dinas",
			"Respons petugas lebih cepat dan terkoordinasi",
			"Riwayat ternak tersimpan dan dapat diakses kapan saja",
		],
	},
	{
		role: "Admin Dinas",
		icon: "🏛️",
		points: [
			"Pantau semua aktivitas lapangan dari satu layar",
			"Data akurat sebagai dasar pengambilan kebijakan",
			"Laporan periodik yang terstruktur otomatis",
		],
	},
	{
		role: "Petugas Lapangan",
		icon: "🧭",
		points: [
			"Tugas harian lebih jelas dan terdistribusi merata",
			"Dokumentasi kunjungan lapangan lebih mudah",
			"Akses data riwayat peternak langsung di lapangan",
		],
	},
	{
		role: "Pemerintah & Stakeholder",
		icon: "📋",
		points: [
			"Visibilitas kondisi ternak dan populasi daerah",
			"Basis data terverifikasi yang dapat diaudit",
			"Mendukung program ketahanan pangan daerah",
		],
	},
];

const WORKFLOW = [
	{
		num: "01",
		label: "Laporan Masuk",
		desc: "Peternak atau petugas mencatat kejadian ke sistem",
		first: true,
	},
	{
		num: "02",
		label: "Penugasan",
		desc: "Sistem distribusikan ke petugas yang tepat",
	},
	{
		num: "03",
		label: "Monitoring",
		desc: "Petugas pantau dan kunjungi lapangan",
	},
	{
		num: "04",
		label: "Validasi",
		desc: "Data diverifikasi dan disetujui oleh admin",
	},
	{
		num: "05",
		label: "Arsip Data",
		desc: "Riwayat tersimpan untuk analisis dan laporan",
	},
];

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const BARS = [90, 72, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const NAV_LINKS = [
	["Tentang", "#tentang"],
	["Fitur", "#fitur"],
	["Preview", "#preview"],
	["Manfaat", "#manfaat"],
	["Alur Kerja", "#alurkerja"],
];

function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const fn = () => setScrolled(window.scrollY > 50);
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-10 transition-all duration-300 ${
				scrolled
					? "bg-[#FEFAF6]/95 border-b border-[#E8DDD3] backdrop-blur-md"
					: "bg-transparent border-b border-transparent"
			}`}>
			<div className="max-w-290 mx-auto h-16.5 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<img
						src="/icon.png"
						alt="Padet Sakti"
						className="w-9.5 h-9.5 object-contain rounded-full"
					/>
					<div>
						<div className="font-serif font-semibold text-[17px] text-[#3B1A08] leading-tight">
							Padet Sakti
						</div>
						<div className="text-[10.5px] text-[#7C6A56] tracking-wider">
							Laskar Arta
						</div>
					</div>
				</div>
				<div className="hidden md:flex items-center gap-6">
					{NAV_LINKS.map(([label, href]) => (
						<a
							key={label}
							href={href}
							className="text-[13.5px] text-[#5C2D0A] font-medium no-underline opacity-85 hover:opacity-100 transition-opacity">
							{label}
						</a>
					))}
					<a
						href="/login"
						className="bg-[#D97706] hover:bg-[#B45309] text-white px-4.5 py-2 rounded-[5px] text-[13.5px] font-semibold no-underline transition-colors">
						Masuk Sistem
					</a>
				</div>
				<button
					className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
					onClick={() => setMobileOpen(!mobileOpen)}>
					<span
						className={`block w-5 h-0.5 bg-[#3B1A08] transition-all duration-200 ${
							mobileOpen ? "rotate-45 translate-y-2" : ""
						}`}
					/>
					<span
						className={`block w-5 h-0.5 bg-[#3B1A08] transition-all duration-200 ${
							mobileOpen ? "opacity-0" : ""
						}`}
					/>
					<span
						className={`block w-5 h-0.5 bg-[#3B1A08] transition-all duration-200 ${
							mobileOpen ? "-rotate-45 -translate-y-2" : ""
						}`}
					/>
				</button>
			</div>
			{mobileOpen && (
				<div className="md:hidden bg-[#FEFAF6] border-t border-[#E8DDD3] pb-5">
					{NAV_LINKS.map(([label, href]) => (
						<a
							key={label}
							href={href}
							onClick={() => setMobileOpen(false)}
							className="block py-3.5 text-[14px] text-[#5C2D0A] font-medium no-underline border-b border-[#E8DDD3] last:border-b-0">
							{label}
						</a>
					))}
					<a
						href="#"
						className="block mt-4 bg-[#D97706] text-white py-3 rounded-[5px] text-[13.5px] font-semibold no-underline text-center">
						Masuk Sistem
					</a>
				</div>
			)}
		</nav>
	);
}

function DashboardMockupSidebar({ active }: { active: string }) {
	const items = [
		"Dashboard",
		"Tickets",
		"Staff",
		"Kejadian",
		"Penyakit",
		"Peternak",
		"Pejantan",
	];
	return (
		<div className="bg-[#2D1306] p-3">
			<div className="text-center mb-3">
				<div className="w-8.5 h-8.5 rounded-full bg-[#D97706] mx-auto flex items-center justify-center text-base">
					🐄
				</div>
			</div>
			{items.map((item) => (
				<div
					key={item}
					className={`px-2 py-1.5 rounded text-[11px] mb-0.5 ${
						item === active ? "bg-[#D97706] text-white" : "text-white/40"
					}`}>
					{item}
				</div>
			))}
		</div>
	);
}

function DonutChart() {
	return (
		<div className="bg-white rounded-[5px] p-2.5 flex flex-col items-center justify-center">
			<div className="text-[8.5px] font-semibold text-[#374151] mb-2 self-start">
				Keberhasilan IB
			</div>
			<div className="relative w-15 h-15">
				<svg viewBox="0 0 36 36" className="w-15 h-15 -rotate-90">
					<circle
						cx="18"
						cy="18"
						r="15.9"
						fill="none"
						stroke="#E5E7EB"
						strokeWidth="3.5"
					/>
					<circle
						cx="18"
						cy="18"
						r="15.9"
						fill="none"
						stroke="#10B981"
						strokeWidth="3.5"
						strokeDasharray="76 24"
						strokeLinecap="round"
					/>
					<circle
						cx="18"
						cy="18"
						r="15.9"
						fill="none"
						stroke="#EF4444"
						strokeWidth="3.5"
						strokeDasharray="24 76"
						strokeDashoffset="-76"
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#1F2937]">
					76%
				</div>
			</div>
			<div className="text-[7.5px] text-[#6B7280] mt-1.5 text-center">
				Berhasil 205 · Gagal 65
			</div>
		</div>
	);
}

function BarChart({ height = 52 }: { height?: number }) {
	return (
		<div className="bg-white rounded-[5px] p-2.5">
			<div className="text-[8.5px] font-semibold text-[#374151] mb-2">
				Jumlah Tiket per Bulan · 2026
			</div>
			<div className="flex items-end gap-0.5" style={{ height }}>
				{BARS.map((h, i) => (
					<div
						key={i}
						className="flex-1 rounded-t-[1px]"
						style={{
							background: i < 3 ? "#3B82F6" : "#E5E7EB",
							height: `${Math.max(h, 4)}%`,
						}}
					/>
				))}
			</div>
			<div className="flex mt-0.5">
				{MONTHS.map((m, i) => (
					<div key={i} className="flex-1 text-center text-[6.5px] text-[#9CA3AF]">
						{m}
					</div>
				))}
			</div>
		</div>
	);
}

function StatCards() {
	return (
		<div className="grid grid-cols-4 gap-1.5 mb-2.5">
			{[
				["0", "Hari Ini", "#3B82F6"],
				["745", "Selesai", "#10B981"],
				["202", "Peternak", "#F59E0B"],
				["6", "Petugas", "#8B5CF6"],
			].map(([n, l, c]) => (
				<div
					key={l}
					className="bg-white rounded-[5px] p-2"
					style={{ boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
					<div
						className="w-4 h-4 rounded-[3px] mb-1.5"
						style={{ background: `${c}22` }}
					/>
					<div className="text-[15px] font-bold text-[#1F2937]">{n}</div>
					<div className="text-[7.5px] text-[#9CA3AF] mt-0.5">{l}</div>
				</div>
			))}
		</div>
	);
}

function MockBrowserBar({ url }: { url: string }) {
	return (
		<div className="bg-[#E9E9E9] px-3 py-2 flex gap-1.5 items-center">
			{["#EF4444", "#F59E0B", "#10B981"].map((c) => (
				<div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
			))}
			<div className="flex-1 bg-white rounded-[3px] h-4 ml-2 flex items-center px-2">
				<span className="text-[9px] text-[#9CA3AF] font-mono">{url}</span>
			</div>
		</div>
	);
}

function HeroDashboardMockup() {
	return (
		<div className="relative hidden md:block">
			<div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-[#FEF3C7] -z-10" />
			<div className="absolute -bottom-4 -left-4 w-18 h-18 rounded-full bg-[#E8D5C0] -z-10" />
			<div
				className="relative z-10 rounded-[10px] overflow-hidden border border-[#E8DDD3]"
				style={{ boxShadow: "0 20px 56px rgba(59,26,8,.22)" }}>
				<MockBrowserBar url="padetsakti.banjar.go.id/dashboard" />
				<div className="flex min-h-75">
					<div className="w-35">
						<DashboardMockupSidebar active="Dashboard" />
					</div>
					<div className="flex-1 bg-[#F5F5F4] p-3.5">
						<div className="text-sm font-bold text-[#1F2937] mb-3 tracking-wider">
							DASHBOARD
						</div>
						<StatCards />
						<div className="grid grid-cols-[1.6fr_1fr] gap-2">
							<BarChart height={52} />
							<DonutChart />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Hero() {
	return (
		<section className="bg-[#FEFAF6] pt-24 pb-14 md:pt-32 md:pb-22 px-5 md:px-10">
			<div className="max-w-290 mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
				<div>
					<div className="inline-block bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold px-3 py-1.5 rounded-[3px] tracking-[.07em] uppercase mb-6">
						Dinas Pangan Kota Banjar
					</div>
					<h1 className="font-serif text-[1.9rem] md:text-[2.7rem] font-semibold leading-[1.28] text-[#3B1A08] mb-5">
						Sistem Pengelolaan
						<br />
						Pangan dan Monitoring
						<br />
						<em className="text-[#D97706] not-italic">Ternak Kota Banjar</em>
					</h1>
					<p className="text-[15.5px] leading-[1.8] text-[#5C2D0A] mb-8 max-w-107.5">
						Padet Sakti membantu Dinas Pangan Kota Banjar mencatat laporan peternak,
						memantau kondisi ternak, dan mengelola seluruh aktivitas lapangan secara
						terpusat dan terstruktur.
					</p>
					<div className="flex flex-wrap gap-3 mb-8 md:mb-11">
						<a
							href="#fitur"
							className="bg-[#3B1A08] text-white px-6 py-3 rounded-[5px] text-sm font-semibold no-underline">
							Lihat Fitur
						</a>
						<a
							href="#preview"
							className="border-[1.5px] border-[#D97706] text-[#D97706] px-6 py-3 rounded-[5px] text-sm font-semibold no-underline">
							Lihat Dashboard →
						</a>
					</div>
					<div className="pt-7 border-t border-[#E8DDD3] flex gap-6 md:gap-10">
						{[
							["745+", "Tiket Diselesaikan"],
							["202", "Peternak Terdaftar"],
							["6", "Petugas Aktif"],
						].map(([n, l]) => (
							<div key={l}>
								<div className="font-serif text-[26px] font-bold text-[#3B1A08] leading-none">
									{n}
								</div>
								<div className="text-xs text-[#7C6A56] mt-1">{l}</div>
							</div>
						))}
					</div>
				</div>
				<HeroDashboardMockup />
			</div>
		</section>
	);
}

function About() {
	return (
		<section id="tentang" className="bg-[#3B1A08] py-14 md:py-22 px-5 md:px-10">
			<div className="max-w-290 mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20 items-center">
				<div>
					<div className="text-[11px] font-bold text-[#D97706] tracking-widest uppercase mb-4">
						Tentang Sistem
					</div>
					<h2 className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-[#FEF3C7] leading-[1.35] mb-5">
						Dibangun dari kebutuhan nyata pengelolaan ternak daerah
					</h2>
					<p className="text-[14.5px] leading-[1.85] text-[#FEF3C7]/70 mb-4">
						Padet Sakti lahir dari kebutuhan Dinas Pangan Kota Banjar untuk
						mendigitalisasi proses pengelolaan ternak yang selama ini dilakukan secara
						manual. Data yang tersebar, laporan yang lambat, dan koordinasi yang tidak
						efisien menjadi latar belakang sistem ini.
					</p>
					<p className="text-[14.5px] leading-[1.85] text-[#FEF3C7]/70">
						Dirancang untuk semua kalangan — dari peternak di lapangan hingga
						administrator dinas — dengan antarmuka sederhana yang mengikuti alur kerja
						yang sudah ada sehari-hari.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-3.5">
					{[
						[
							"Terpusat",
							"Data dan laporan seluruh peternak dalam satu platform terintegrasi",
						],
						[
							"Terstruktur",
							"Alur kerja jelas dari laporan masuk hingga kasus diselesaikan",
						],
						[
							"Tertelusur",
							"Riwayat lengkap setiap kasus, ternak, dan aktivitas lapangan",
						],
						[
							"Terpercaya",
							"Data terverifikasi sebagai dasar kebijakan dinas yang akurat",
						],
					].map(([title, desc]) => (
						<div
							key={title}
							className="bg-white/[.07] border border-white/10 rounded-lg p-5">
							<div className="font-serif text-[17px] font-semibold text-[#D97706] mb-2.5">
								{title}
							</div>
							<div className="text-[13px] text-[#FEF3C7]/58 leading-[1.65]">
								{desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Features() {
	return (
		<section id="fitur" className="bg-[#FEFAF6] py-14 md:py-23 px-5 md:px-10">
			<div className="max-w-290 mx-auto">
				<div className="flex flex-col gap-4 mb-10 md:flex-row md:justify-between md:items-end md:mb-13">
					<div>
						<div className="text-[11px] font-bold text-[#D97706] tracking-widest uppercase mb-3">
							Fitur Sistem
						</div>
						<h2 className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-[#3B1A08] leading-[1.3] max-w-110">
							Semua kebutuhan pengelolaan ternak dalam satu platform
						</h2>
					</div>
					<p className="text-sm text-[#7C6A56] max-w-70 md:text-right leading-[1.75]">
						Dari pencatatan laporan harian hingga pemantauan populasi dan tingkat
						keberhasilan inseminasi buatan.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 border border-[#E8DDD3]">
					{FEATURES.map(({ num, title, desc, featured }, i) => (
						<div
							key={num}
							className={[
								"p-6 md:p-8 border-[#E8DDD3]",
								i < 5 ? "border-b" : "",
								i >= 3 ? "md:border-b-0" : "",
								(i + 1) % 3 !== 0 ? "md:border-r" : "",
							]
								.filter(Boolean)
								.join(" ")}
							style={{
								background: featured ? "#3B1A08" : i % 2 === 1 ? "#FDF6EE" : "#FEFAF6",
							}}>
							<div
								className="text-[11px] font-bold tracking-[.06em] uppercase mb-3"
								style={{ color: featured ? "#D97706" : "#9A6B4B" }}>
								{num}
							</div>
							<h3
								className="text-base font-bold mb-3 leading-[1.3]"
								style={{ color: featured ? "#FEF3C7" : "#3B1A08" }}>
								{title}
							</h3>
							<p
								className="text-[13.5px] leading-[1.75]"
								style={{ color: featured ? "rgba(254,243,199,.70)" : "#7C6A56" }}>
								{desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function TicketRow({
	id,
	petugas,
	jenis,
}: {
	id: string;
	petugas: string;
	jenis: string;
}) {
	return (
		<div
			className="grid gap-2.5 px-2.5 py-1.5 border-b border-[#F3F4F6] items-center"
			style={{ gridTemplateColumns: "1.2fr 1fr 0.7fr 0.7fr" }}>
			<div className="text-[8.5px] text-[#3B82F6] font-medium">{id}</div>
			<div className="text-[8.5px] text-[#374151]">{petugas}</div>
			<div className="text-[8px] bg-[#F3F4F6] text-[#6B7280] px-1 py-0.5 rounded-sm">
				{jenis}
			</div>
			<div className="text-[7.5px] bg-[#D1FAE5] text-[#065F46] px-1.5 py-0.5 rounded-sm text-center">
				Resolved
			</div>
		</div>
	);
}

function Preview() {
	return (
		<section
			id="preview"
			className="bg-[#FDF6EE] py-14 md:py-22 px-5 md:px-10 border-t border-[#E8DDD3]">
			<div className="max-w-290 mx-auto">
				<div className="text-center mb-10 md:mb-13">
					<div className="inline-block text-[11px] font-bold text-[#D97706] tracking-widest uppercase mb-3">
						Tampilan Sistem
					</div>
					<h2 className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-[#3B1A08] mb-3">
						Antarmuka yang bersih dan mudah digunakan
					</h2>
					<p className="text-[14.5px] text-[#7C6A56] max-w-115 mx-auto">
						Dirancang agar dapat dioperasikan oleh petugas dari berbagai latar
						belakang teknis.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-[1.3fr_1fr]">
					<div
						className="rounded-[10px] overflow-hidden border border-[#E8DDD3]"
						style={{ boxShadow: "0 4px 24px rgba(59,26,8,.11)" }}>
						<MockBrowserBar url="padetsakti.banjar.go.id/dashboard" />
						<div className="flex min-h-80">
							<div className="w-32">
								<DashboardMockupSidebar active="Dashboard" />
							</div>
							<div className="flex-1 bg-[#F5F5F4] p-3.5">
								<div className="text-sm font-bold text-[#1F2937] mb-2.5 tracking-wider">
									DASHBOARD
								</div>
								<StatCards />
								<div
									className="grid gap-2"
									style={{ gridTemplateColumns: "1.5fr 1fr" }}>
									<BarChart height={56} />
									<DonutChart />
								</div>
							</div>
						</div>
					</div>
					<div
						className="rounded-[10px] overflow-hidden border border-[#E8DDD3]"
						style={{ boxShadow: "0 4px 24px rgba(59,26,8,.11)" }}>
						<MockBrowserBar url="padetsakti.banjar.go.id/tickets" />
						<div className="flex min-h-80">
							<div className="w-24 bg-[#2D1306] p-2.5">
								<div className="text-center mb-3">
									<div className="w-7 h-7 rounded-full bg-[#D97706] mx-auto flex items-center justify-center text-xs">
										🐄
									</div>
								</div>
								{[
									["Dashboard", false],
									["Tickets", true],
									["Staff", false],
									["Peternak", false],
									["Penyakit", false],
								].map(([l, a]) => (
									<div
										key={l as string}
										className={`px-1.5 py-1 rounded text-[10px] mb-0.5 ${a ? "bg-[#D97706] text-white" : "text-white/35"}`}>
										{l}
									</div>
								))}
							</div>
							<div className="flex-1 bg-[#F9FAFB] p-3.5">
								<div className="flex justify-between items-center mb-3">
									<div className="text-[13px] font-bold text-[#1F2937]">
										Daftar Ticket
									</div>
									<div className="bg-[#D97706] text-white text-[9px] font-semibold px-2 py-1 rounded-[3px]">
										+ Add Ticket
									</div>
								</div>
								<div
									className="bg-white rounded-[5px] overflow-hidden"
									style={{ boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
									<div
										className="grid px-2.5 py-1.5 bg-[#F3F4F6] border-b border-[#E5E7EB]"
										style={{ gridTemplateColumns: "1.2fr 1fr 0.7fr 0.7fr" }}>
										{["ID Ticket", "Petugas", "Jenis", "Status"].map((h) => (
											<div
												key={h}
												className="text-[8.5px] font-semibold text-[#6B7280] uppercase">
												{h}
											</div>
										))}
									</div>
									<TicketRow id="Laporan-26.03.5" petugas="Desqi" jenis="IB" />
									<TicketRow id="Laporan-26.03.4" petugas="Desqi" jenis="IB" />
									<TicketRow id="Laporan-26.03.3" petugas="Desqi" jenis="Kelahiran" />
									<TicketRow id="Laporan-26.02.9" petugas="Desqi" jenis="PKB" />
									<TicketRow id="Laporan-26.02.8" petugas="Hanif" jenis="PKB" />
									<TicketRow id="Laporan-26.02.7" petugas="Desqi" jenis="Kelahiran" />
								</div>
								<div className="mt-2 text-[9px] text-[#9CA3AF]">
									Showing 1 to 6 of 745 results
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Benefits() {
	return (
		<section id="manfaat" className="bg-[#FEFAF6] py-14 md:py-23 px-5 md:px-10">
			<div className="max-w-290 mx-auto">
				<div className="text-[11px] font-bold text-[#D97706] tracking-widest uppercase mb-3">
					Manfaat
				</div>
				<h2 className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-[#3B1A08] leading-[1.3] mb-10 md:mb-13">
					Dirasakan langsung oleh semua yang terlibat
				</h2>
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
					{BENEFITS.map(({ role, icon, accent, points }) => (
						<div
							key={role}
							className="pt-6"
							style={{ borderTop: `3px solid ${accent ? "#D97706" : "#E8DDD3"}` }}>
							<div className="text-[26px] mb-3">{icon}</div>
							<div className="text-[15px] font-bold text-[#3B1A08] mb-4.5">{role}</div>
							<ul className="list-none">
								{points.map((p, i) => (
									<li key={i} className="flex gap-2 items-start mb-3">
										<span className="text-[#D97706] text-[13px] font-bold shrink-0 mt-0.5">
											✓
										</span>
										<span className="text-[13.5px] text-[#5C2D0A] leading-[1.65]">
											{p}
										</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Workflow() {
	return (
		<section
			id="alurkerja"
			className="bg-[#FDF6EE] py-14 md:py-23 px-5 md:px-10 border-t border-b border-[#E8DDD3]">
			<div className="max-w-290 mx-auto">
				<div className="text-center mb-10 md:mb-15">
					<div className="inline-block text-[11px] font-bold text-[#D97706] tracking-widest uppercase mb-3">
						Alur Kerja
					</div>
					<h2 className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-[#3B1A08] mb-3">
						Dari laporan hingga arsip — semua tertangani
					</h2>
					<p className="text-[14.5px] text-[#7C6A56] max-w-115 mx-auto">
						Alur operasional yang sederhana memastikan setiap laporan ditangani dengan
						tepat dan terdokumentasi secara lengkap.
					</p>
				</div>
				<div className="relative">
					<div className="absolute top-6.5 left-[10%] right-[10%] h-px bg-[#E8DDD3] hidden md:block" />
					<div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-0 relative z-10">
						{WORKFLOW.map(({ num, label, desc, first }) => (
							<div key={num} className="text-center px-4">
								<div
									className="w-13 h-13 rounded-full mx-auto mb-4 flex items-center justify-center"
									style={{
										background: first ? "#3B1A08" : "#fff",
										border: `2px solid ${first ? "#3B1A08" : "#E8DDD3"}`,
										boxShadow: "0 2px 8px rgba(59,26,8,.07)",
									}}>
									<span
										className="font-serif text-[13.5px] font-bold"
										style={{ color: first ? "#FEF3C7" : "#9A6B4B" }}>
										{num}
									</span>
								</div>
								<div className="text-[13px] font-bold text-[#3B1A08] mb-2">{label}</div>
								<div className="text-[12.5px] text-[#7C6A56] leading-[1.65]">
									{desc}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function CTAStrip() {
	return (
		<section className="bg-[#D97706] py-10 md:py-14 px-5 md:px-10">
			<div className="max-w-290 mx-auto flex flex-col gap-6 md:flex-row md:justify-between md:items-center md:gap-0">
				<div>
					<h2 className="font-serif text-[1.4rem] md:text-[1.9rem] font-semibold text-white mb-2">
						Siap menggunakan Padet Sakti?
					</h2>
					<p className="text-[14.5px] text-white/82">
						Hubungi Dinas Pangan Kota Banjar untuk informasi akses dan penggunaan
						sistem.
					</p>
				</div>
				<a
					href="#"
					className="bg-white text-[#D97706] px-7 py-3.5 rounded-[5px] text-sm font-bold no-underline whitespace-nowrap shrink-0 text-center">
					Masuk ke Sistem →
				</a>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="bg-[#1C0D03] pt-10 md:pt-13 pb-8 px-5 md:px-10">
			<div className="max-w-290 mx-auto">
				<div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-[2fr_1fr_1fr] md:gap-12 md:mb-10">
					<div>
						<div className="flex items-center gap-2.5 mb-4">
							<img src="/icon.png" alt="Logo" className="w-7.5 h-7.5 object-contain" />
							<div>
								<div className="font-serif text-[15px] font-semibold text-[#FEF3C7]">
									Padet Sakti
								</div>
								<div className="text-[10.5px] text-[#7C6A56]">Laskar Arta</div>
							</div>
						</div>
						<p className="text-[13px] text-[#FEF3C7]/45 leading-[1.85] max-w-75">
							Sistem Pengelolaan Pangan dan Monitoring Ternak Dinas Pangan Kota Banjar.
							Dibangun untuk mendukung ketahanan pangan daerah.
						</p>
					</div>
					<div>
						<div className="text-[11px] font-bold text-[#D97706] mb-4 tracking-[.08em] uppercase">
							Navigasi
						</div>
						{[
							"Tentang Sistem",
							"Fitur",
							"Preview Dashboard",
							"Manfaat",
							"Alur Kerja",
						].map((item) => (
							<a
								key={item}
								href="#"
								className="block text-[13px] text-[#FEF3C7]/45 no-underline mb-2.5 hover:text-[#FEF3C7] transition-colors">
								{item}
							</a>
						))}
					</div>
					<div>
						<div className="text-[11px] font-bold text-[#D97706] mb-4 tracking-[.08em] uppercase">
							Pengelola
						</div>
						<div className="text-[13px] text-[#FEF3C7]/45 leading-[1.9]">
							<div>Dinas Pangan Kota Banjar</div>
							<div>Jawa Barat, Indonesia</div>
							<div className="mt-2.5 text-[12px] text-[#FEF3C7]/25">
								Dikembangkan oleh Laskar Arta
							</div>
						</div>
					</div>
				</div>
				<div className="border-t border-white/[.07] pt-5 flex flex-col gap-1 md:flex-row md:justify-between md:gap-0">
					<div className="text-[12px] text-[#FEF3C7]/25">
						© 2026 Padet Sakti — Laskar Arta. Hak cipta dilindungi.
					</div>
					<div className="text-[12px] text-[#FEF3C7]/25">
						Dinas Pangan Kota Banjar
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function Home() {
	return (
		<main
			className="min-h-screen"
			style={{
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
				background: "#FEFAF6",
				color: "#1C1005",
			}}>
			<Navbar />
			<Hero />
			<About />
			<Features />
			<Preview />
			<Benefits />
			<Workflow />
			<CTAStrip />
			<Footer />
		</main>
	);
}

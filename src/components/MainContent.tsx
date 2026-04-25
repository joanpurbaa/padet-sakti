export default function MainContent() {
	return (
		<main className="flex-1 p-6 overflow-auto">
			<div className="bg-white rounded-lg shadow-sm p-8 border border-orange-100">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Selamat Datang di Dashboard
				</h1>
				<p className="text-gray-400 text-sm mb-6">Home / Dashboard</p>
				<p className="text-gray-500 leading-relaxed">
					Ini adalah area konten utama. Silakan ganti bagian ini dengan konten sesuai
					kebutuhan aplikasimu.
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
					{["Total Tickets", "Total Staff", "Total Laporan"].map((title, i) => (
						<div
							key={i}
							className="rounded-lg border border-orange-100 bg-orange-50/40 p-5">
							<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
								{title}
							</p>
							<p className="text-3xl font-bold text-red-800">{(i + 1) * 24}</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}

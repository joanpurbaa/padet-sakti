import {
	RefreshCw,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useKelahiran } from "../../hooks/useKelahiran";
import type { Kelahiran as KelahiranType } from "../../types/Kelahiran";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_kelahiran", label: "ID Kelahiran", align: "left" as const },
	{ key: "nama", label: "Nama", align: "left" as const },
	{ key: "jenis_kelamin", label: "Jenis Kelamin", align: "center" as const },
	{ key: "id_kejadian", label: "ID Kejadian", align: "left" as const },
	{ key: "id_staff", label: "ID Staff", align: "left" as const },
	{ key: "id_ticket", label: "ID Ticket", align: "left" as const },
	{ key: "keunggulan", label: "Keunggulan", align: "left" as const },
	{ key: "no_dokumen", label: "No Dokumen", align: "left" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
];

export default function Kelahiran() {
	const {
		kelahiranList,
		loading,
		error,
		page,
		setPage,
		totalPages,
		total,
		from,
		to,
		refetch,
	} = useKelahiran();

	const paginationPages = buildPaginationPages(page, totalPages);

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Kejadian / Kelahiran</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Data Kelahiran</h1>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div className="flex items-center gap-3">
						<button
							onClick={refetch}
							disabled={loading}
							className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors cursor-pointer">
							<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
						</button>
					</div>
				</div>

				{error && (
					<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
						<AlertCircle size={15} className="shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="bg-gray-50">
								{COLUMNS.map((col) => (
									<th
										key={col.key}
										className={`text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap border-b border-gray-200
											${col.align === "center" ? "text-center" : "text-left"}`}>
										{col.label}
									</th>
								))}
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100">
							{loading ? (
								Array.from({ length: 10 }).map((_, i) => (
									<tr key={i}>
										{COLUMNS.map((col) => (
											<td key={col.key} className="py-3.5 px-4">
												<div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-full max-w-24" />
											</td>
										))}
									</tr>
								))
							) : kelahiranList.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										Tidak ada data kelahiran
									</td>
								</tr>
							) : (
								kelahiranList.map((k: KelahiranType, index: number) => {
									const isJantan = k.jenis_kelamin?.toLowerCase() === "jantan";

									return (
										<tr
											key={k.id_kelahiran}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{from - 1 + index + 1}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">
													{k.id_kelahiran}
												</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-medium text-gray-800">{k.nama}</span>
											</td>
											<td className="py-3.5 px-4 text-center">
												<span
													className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
														isJantan
															? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
															: "bg-pink-50 text-pink-600 ring-1 ring-pink-200"
													}`}>
													<span
														className={`h-1.5 w-1.5 rounded-full ${
															isJantan ? "bg-blue-400" : "bg-pink-400"
														}`}
													/>
													{k.jenis_kelamin}
												</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{k.id_kejadian}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{k.id_staff}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{k.id_ticket ?? <span className="text-gray-300 text-xs">—</span>}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700 text-xs">
												{k.keunggulan ?? <span className="text-gray-300">—</span>}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700 text-xs">
												{(k as KelahiranType & { no_dokumen?: string | null })
													.no_dokumen ?? <span className="text-gray-300">—</span>}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
												{k.created_at}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 pt-2">
					<p className="text-xs text-gray-400">
						{loading
							? "Memuat data..."
							: `Showing ${from} to ${to} of ${total} results`}
					</p>

					<div className="flex items-center gap-1">
						<PaginationBtn
							onClick={() => setPage(page - 1)}
							disabled={page <= 1 || loading}>
							<ChevronLeft size={14} />
						</PaginationBtn>

						{paginationPages.map((p, idx) =>
							p === "..." ? (
								<span
									key={`ellipsis-${idx}`}
									className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
									...
								</span>
							) : (
								<PaginationBtn
									key={p}
									onClick={() => setPage(p as number)}
									disabled={loading}
									active={p === page}>
									{p}
								</PaginationBtn>
							),
						)}

						<PaginationBtn
							onClick={() => setPage(page + 1)}
							disabled={page >= totalPages || loading}>
							<ChevronRight size={14} />
						</PaginationBtn>
					</div>
				</div>
			</div>
		</div>
	);
}

function buildPaginationPages(
	current: number,
	last: number,
): (number | "...")[] {
	if (last <= 7) {
		return Array.from({ length: last }, (_, i) => i + 1);
	}

	const pages: (number | "...")[] = [];

	pages.push(1);

	if (current > 3) {
		pages.push("...");
	}

	const start = Math.max(2, current - 1);
	const end = Math.min(last - 1, current + 1);

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	if (current < last - 2) {
		pages.push("...");
	}

	pages.push(last);

	return pages;
}

interface PaginationBtnProps {
	onClick: () => void;
	disabled?: boolean;
	active?: boolean;
	children: React.ReactNode;
}

function PaginationBtn({
	onClick,
	disabled,
	active,
	children,
}: PaginationBtnProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
				active
					? "bg-blue-600 text-white"
					: "text-gray-500 hover:bg-gray-100 border border-gray-200"
			}`}>
			{children}
		</button>
	);
}

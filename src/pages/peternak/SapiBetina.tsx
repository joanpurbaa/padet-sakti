import { useState } from "react";
import {
	RefreshCw,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	// Image,
	Plus,
} from "lucide-react";
import { useBetina } from "../../hooks/useBetina";
import type { Betina } from "../../types/Betina";
import BetinaFormModal from "../../components/BetinaFormModal";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "ear_tag", label: "Ear Tag", align: "left" as const },
	{ key: "nama", label: "Nama", align: "left" as const },
	{ key: "id_peternak", label: "ID Peternak", align: "left" as const },
	{ key: "jenis_sapi", label: "Jenis Sapi", align: "left" as const },
	// { key: "usia", label: "Usia", align: "center" as const },
	// { key: "status", label: "Status", align: "center" as const },
	// { key: "jumlah_ib", label: "Jumlah IB", align: "center" as const },
	// { key: "riwayat_penyakit", label: "Riwayat Penyakit", align: "left" as const },
	// { key: "tanggal_lahir", label: "Tgl Lahir", align: "left" as const },
	// { key: "created_at", label: "Tanggal", align: "left" as const },
	// { key: "actions", label: "", align: "center" as const },
];

// const BASE_IMAGE_URL = "https://test.dkpppkotabanjar.com/public/";

export default function SapiBetina() {
	const [showFormModal, setShowFormModal] = useState(false);

	const {
		betinaList,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch,
		setPage,
	} = useBetina();

	const paginationPages = buildPaginationPages(currentPage, lastPage);

	const handleAdd = () => {
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Peternak / Sapi Betina</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">
					Data Sapi Betina
				</h1>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div className="flex items-center gap-3">
						<button
							onClick={refetch}
							disabled={loading}
							className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors cursor-pointer">
							<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
						</button>
					</div>

					<button
						onClick={handleAdd}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
						<Plus size={15} />
						Add Betina
					</button>
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
							) : betinaList.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										Tidak ada data sapi betina
									</td>
								</tr>
							) : (
								betinaList.map((b: Betina, index: number) => {
									// const isBolehIB = b.status?.toUpperCase() === "BOLEH IB";

									return (
										<tr
											key={b.ear_tag}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{from - 1 + index + 1}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">{b.ear_tag}</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-medium text-gray-800">{b.nama}</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{b.id_peternak}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{b.jenis_sapi}
											</td>
											{/* <td className="py-3.5 px-4 text-center text-gray-700">{b.usia}</td> */}
											{/* <td className="py-3.5 px-4 text-center">
												<span
													className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
														isBolehIB
															? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
															: "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
													}`}>
													<span
														className={`h-1.5 w-1.5 rounded-full ${
															isBolehIB ? "bg-emerald-400" : "bg-orange-400"
														}`}
													/>
													{b.status}
												</span>
											</td> */}
											{/* <td className="py-3.5 px-4 text-center">
												<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
													{b.jumlah_ib}
												</span>
											</td> */}
											{/* <td className="py-3.5 px-4 whitespace-nowrap text-gray-700 text-xs">
												{b.riwayat_penyakit === "-" ? (
													<span className="text-gray-300">—</span>
												) : (
													b.riwayat_penyakit
												)}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700 text-xs">
												{b.tanggal_lahir}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
												{b.created_at}
											</td> */}
											{/* <td className="py-3.5 px-4">
												<div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													{b.foto ? (
														<a
															href={`${BASE_IMAGE_URL}${b.foto}`}
															target="_blank"
															rel="noopener noreferrer"
															className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
															title="Lihat Foto">
															<Image size={14} />
														</a>
													) : (
														<span
															className="p-1.5 rounded-md text-gray-200 cursor-not-allowed"
															title="Tidak ada foto">
															<Image size={14} />
														</span>
													)}
												</div>
											</td> */}
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between pt-2">
					<p className="text-xs text-gray-400">
						{loading
							? "Memuat data..."
							: `Showing ${from} to ${to} of ${total} results`}
					</p>

					<div className="flex items-center gap-1">
						<PaginationBtn
							onClick={() => setPage(currentPage - 1)}
							disabled={currentPage <= 1 || loading}>
							<ChevronLeft size={14} />
						</PaginationBtn>

						{paginationPages.map((page, idx) =>
							page === "..." ? (
								<span
									key={`ellipsis-${idx}`}
									className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
									...
								</span>
							) : (
								<PaginationBtn
									key={page}
									onClick={() => setPage(page as number)}
									disabled={loading}
									active={page === currentPage}>
									{page}
								</PaginationBtn>
							),
						)}

						<PaginationBtn
							onClick={() => setPage(currentPage + 1)}
							disabled={currentPage >= lastPage || loading}>
							<ChevronRight size={14} />
						</PaginationBtn>
					</div>
				</div>
			</div>

			<BetinaFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
			/>
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

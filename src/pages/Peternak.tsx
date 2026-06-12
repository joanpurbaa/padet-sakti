import { useState, useDeferredValue } from "react";
import {
	Search,
	Plus,
	RefreshCw,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Pencil,
	Trash2,
	X,
} from "lucide-react";
import { usePeternak } from "../hooks/usePeternak";
import type { Peternak as PeternakType } from "../types/Peternak";
import PeternakFormModal from "../components/PeternakFormModal";
import DeletePeternakModal from "../components/DeletePeternakModal";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_peternak", label: "ID Peternak", align: "left" as const },
	{ key: "nama", label: "Nama", align: "left" as const },
	// { key: "alamat", label: "Alamat", align: "left" as const },
	{ key: "kecamatan", label: "Kecamatan", align: "left" as const },
	{ key: "kelurahan", label: "Kelurahan", align: "left" as const },
	{ key: "jenis_ternak", label: "Jenis Ternak", align: "center" as const },
	{ key: "no_hp", label: "No HP", align: "left" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
	{ key: "actions", label: "", align: "center" as const },
];

const SEARCH_COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_peternak", label: "ID Peternak", align: "left" as const },
	{ key: "text", label: "Info", align: "left" as const },
];

export default function Peternak() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingPeternak, setEditingPeternak] = useState<PeternakType | null>(
		null,
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingPeternak, setDeletingPeternak] = useState<PeternakType | null>(
		null,
	);
	const deferredSearch = useDeferredValue(search);

	const [limit, setLimit] = useState(10);

	const {
		peternakList,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch,
		setPage,
		isSearching,
	} = usePeternak({ search: deferredSearch });

	const paginationPages = buildPaginationPages(currentPage, lastPage);

	const activeColumns = isSearching ? SEARCH_COLUMNS : COLUMNS;

	const handleAdd = () => {
		setEditingPeternak(null);
		setShowFormModal(true);
	};

	const handleEdit = (peternak: PeternakType) => {
		setEditingPeternak(peternak);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingPeternak(null);
	};

	const handleDelete = (peternak: PeternakType) => {
		setDeletingPeternak(peternak);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingPeternak(null);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Peternak</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Data Peternak</h1>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
							<Search size={14} className="text-gray-400 shrink-0" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Cari ID peternak, nama..."
								className="text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full sm:w-52"
							/>
							{search && (
								<button
									onClick={() => setSearch("")}
									className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
									<X size={14} />
								</button>
							)}
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-500">
							<select
								value={limit}
								onChange={(e) => {
									setPage(1);
									setLimit(Number(e.target.value));
								}}
								className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
								{[5, 10, 25, 50, 100].map((num) => (
									<option key={num} value={num}>
										{num}
									</option>
								))}
							</select>
						</div>

						<button
							onClick={refetch}
							disabled={loading}
							className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors cursor-pointer">
							<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
						</button>
					</div>

					<button
						onClick={handleAdd}
						className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
						<Plus size={15} />
						Add Peternak
					</button>
				</div>

				{isSearching && !loading && (
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<span>
							Hasil pencarian untuk "
							<strong className="text-gray-700">{deferredSearch}</strong>" — {total}{" "}
							data ditemukan
						</span>
					</div>
				)}

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
								{activeColumns.map((col) => (
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
										{activeColumns.map((col) => (
											<td key={col.key} className="py-3.5 px-4">
												<div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-full max-w-24" />
											</td>
										))}
									</tr>
								))
							) : peternakList.length === 0 ? (
								<tr>
									<td
										colSpan={activeColumns.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data peternak"}
									</td>
								</tr>
							) : isSearching ? (
								peternakList.map((item, index: number) => {
									const searchItem = item as { id_peternak: string; text: string };
									return (
										<tr
											key={searchItem.id_peternak}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{index + 1}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">
													{searchItem.id_peternak}
												</span>
											</td>
											<td className="py-3.5 px-4 text-gray-700">{searchItem.text}</td>
										</tr>
									);
								})
							) : (
								peternakList.map((item, index: number) => {
									const p = item as PeternakType;
									return (
										<tr
											key={p.id_peternak}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{from - 1 + index + 1}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">{p.id_peternak}</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-medium text-gray-800">{p.nama}</span>
											</td>
											{/* <td className="py-3.5 px-4 text-gray-700 max-w-xs truncate">
												{p.alamat}
											</td> */}
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{p.kecamatan ?? <span className="text-gray-300 text-xs">—</span>}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{p.kelurahan ?? <span className="text-gray-300 text-xs">—</span>}
											</td>
											<td className="py-3.5 px-4 text-center">
												<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
													{p.jenis_ternak}
												</span>
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700 text-xs">
												{p.no_hp || <span className="text-gray-300">—</span>}
											</td>
											<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
												{p.created_at === "0000-00-00 00:00:00" ? "—" : p.created_at}
											</td>
											<td className="py-3.5 px-4">
												<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleEdit(p)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDelete(p)}
														className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
														title="Delete">
														<Trash2 size={14} />
													</button>
												</div>
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
							: isSearching
								? `${total} hasil ditemukan`
								: `Showing ${from} to ${to} of ${total} results`}
					</p>

					{!isSearching && (
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
					)}
				</div>
			</div>

			<PeternakFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				peternak={editingPeternak}
			/>

			<DeletePeternakModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				peternak={deletingPeternak}
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

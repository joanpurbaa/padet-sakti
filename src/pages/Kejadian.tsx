import { useState, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import {
	Search,
	Plus,
	RefreshCw,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Eye,
	Pencil,
	Trash2,
	X,
} from "lucide-react";
import { useKejadian } from "../hooks/useKejadian";
import type { Kejadian as KejadianType } from "../types/Kejadian";
import DeleteKejadianModal from "../components/DeleteKejadianModal";
import KejadianFormModal from "../components/KejadianDetailModal";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_kejadian", label: "ID Kejadian", align: "left" as const },
	{ key: "id_betina", label: "ID Betina", align: "left" as const },
	{ key: "id_peternak", label: "ID Peternak", align: "left" as const },
	{ key: "status", label: "Status", align: "left" as const },
	{ key: "hasil", label: "Hasil", align: "center" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
	{ key: "actions", label: "", align: "center" as const },
];

export default function Kejadian() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingKejadian, setEditingKejadian] = useState<KejadianType | null>(
		null,
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingKejadian, setDeletingKejadian] = useState<KejadianType | null>(
		null,
	);
	const deferredSearch = useDeferredValue(search);
	const navigate = useNavigate();

	const {
		kejadianList,
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
	} = useKejadian({ search: deferredSearch });

	const pagination = getPaginationRange(currentPage, lastPage);

	const handleDetail = (kejadian: KejadianType) => {
		navigate(`/kejadian/show/${kejadian.id_kejadian}`, {
			state: { kejadian },
		});
	};

	const handleAdd = () => {
		setEditingKejadian(null);
		setShowFormModal(true);
	};

	const handleEdit = (kejadian: KejadianType) => {
		setEditingKejadian(kejadian);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingKejadian(null);
	};

	const handleDelete = (kejadian: KejadianType) => {
		setDeletingKejadian(kejadian);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingKejadian(null);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Kejadian</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Daftar Kejadian</h1>
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
								placeholder="Cari ID peternak..."
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
						Add Kejadian
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
								Array.from({ length: 5 }).map((_, i) => (
									<tr key={i}>
										{COLUMNS.map((col) => (
											<td key={col.key} className="py-3.5 px-4">
												<div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-full max-w-24" />
											</td>
										))}
									</tr>
								))
							) : kejadianList.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data kejadian"}
									</td>
								</tr>
							) : (
								kejadianList.map((kejadian: KejadianType, index: number) => {
									const isBerhasil = kejadian.hasil?.toLowerCase() === "berhasil";

									return (
										<tr
											key={kejadian.id_kejadian}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{(isSearching ? 0 : from - 1) + index + 1}
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">
													{kejadian.id_kejadian}
												</span>
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
												{kejadian.id_betina}
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="text-gray-700">{kejadian.id_peternak}</span>
											</td>

											<td className="py-3.5 px-4">
												<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
													{kejadian.status}
												</span>
											</td>

											<td className="py-3.5 px-4 text-center">
												<span
													className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
														isBerhasil
															? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
															: "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
													}`}>
													<span
														className={`h-1.5 w-1.5 rounded-full ${
															isBerhasil ? "bg-emerald-400" : "bg-orange-400"
														}`}
													/>
													{kejadian.hasil}
												</span>
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
												{kejadian.created_at}
											</td>

											<td className="py-3.5 px-4">
												<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleDetail(kejadian)}
														className="p-1.5 rounded-md text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
														title="Detail">
														<Eye size={14} />
													</button>
													<button
														onClick={() => handleEdit(kejadian)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDelete(kejadian)}
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

							{pagination.map((item, index) =>
								item === "..." ? (
									<span key={`dots-${index}`} className="px-2 text-gray-400">
										...
									</span>
								) : (
									<PaginationBtn
										key={`page-${item}-${index}`}
										onClick={() => setPage(item as number)}
										disabled={loading}
										active={item === currentPage}>
										{item}
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

			<KejadianFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				kejadian={editingKejadian}
			/>

			<DeleteKejadianModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				kejadian={deletingKejadian}
			/>
		</div>
	);
}

interface PaginationBtnProps {
	onClick: () => void;
	disabled?: boolean;
	active?: boolean;
	children: React.ReactNode;
}

function getPaginationRange(current: number, total: number) {
	const delta = 1;
	const result: (number | string)[] = [];

	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);

	result.push(1);

	if (left > 2) {
		result.push("...");
	}

	for (let i = left; i <= right; i++) {
		result.push(i);
	}

	if (right < total - 1) {
		result.push("...");
	}

	if (total > 1) {
		result.push(total);
	}

	return result;
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

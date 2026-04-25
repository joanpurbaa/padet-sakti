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
import { usePejantan } from "../hooks/usePejantan";
import type { Pejantan as PejantanType } from "../types/Pejantan";
import PejantanFormModal from "../components/PejantanFormModal";
import DeletePejantanModal from "../components/DeletePejantanModal";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_pejantan", label: "ID Pejantan", align: "left" as const },
	{ key: "id_pembuatan", label: "ID Pembuatan", align: "left" as const },
	{ key: "jenis_straw", label: "Jenis Straw", align: "left" as const },
	{ key: "asal_straw", label: "Asal Straw", align: "left" as const },
	{ key: "persentase", label: "Persentase", align: "center" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
	{ key: "actions", label: "", align: "center" as const },
];

export default function Pejantan() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingPejantan, setEditingPejantan] = useState<PejantanType | null>(
		null,
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingPejantan, setDeletingPejantan] = useState<PejantanType | null>(
		null,
	);
	const deferredSearch = useDeferredValue(search);

	const {
		pejantanList,
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
	} = usePejantan({ search: deferredSearch });

	const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

	const handleAdd = () => {
		setEditingPejantan(null);
		setShowFormModal(true);
	};

	const handleEdit = (item: PejantanType) => {
		setEditingPejantan(item);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingPejantan(null);
	};

	const handleDelete = (item: PejantanType) => {
		setDeletingPejantan(item);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingPejantan(null);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Pejantan</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Data Pejantan</h1>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
							<Search size={14} className="text-gray-400 shrink-0" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Cari ID pejantan, jenis straw..."
								className="text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400 w-52"
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
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
						<Plus size={15} />
						Add Pejantan
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
							) : pejantanList.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data pejantan"}
									</td>
								</tr>
							) : (
								pejantanList.map((item: PejantanType, index: number) => (
									<tr
										key={item.id_pejantan}
										className="group hover:bg-blue-50/40 transition-colors">
										<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
											{(isSearching ? 0 : from - 1) + index + 1}
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap">
											<span className="font-semibold text-blue-600">
												{item.id_pejantan}
											</span>
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
											{item.id_pembuatan}
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
											{item.jenis_straw}
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
											{item.asal_straw}
										</td>

										<td className="py-3.5 px-4 text-center">
											<span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
												{item.persentase}%
											</span>
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
											{item.created_at}
										</td>

										<td className="py-3.5 px-4">
											<div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => handleEdit(item)}
													className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
													title="Edit">
													<Pencil size={14} />
												</button>
												<button
													onClick={() => handleDelete(item)}
													className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
													title="Delete">
													<Trash2 size={14} />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between pt-2">
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

							{pages.map((page) => (
								<PaginationBtn
									key={page}
									onClick={() => setPage(page)}
									disabled={loading}
									active={page === currentPage}>
									{page}
								</PaginationBtn>
							))}

							<PaginationBtn
								onClick={() => setPage(currentPage + 1)}
								disabled={currentPage >= lastPage || loading}>
								<ChevronRight size={14} />
							</PaginationBtn>
						</div>
					)}
				</div>
			</div>

			<PejantanFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				pejantan={editingPejantan}
			/>

			<DeletePejantanModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				pejantan={deletingPejantan}
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

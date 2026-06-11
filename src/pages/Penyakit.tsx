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
	Printer,
} from "lucide-react";
import { usePenyakit } from "../hooks/usePenyakit";
import type { Penyakit } from "../types/Penyakit";
import PenyakitFormModal from "../components/PenyakitFormModal";
import DeletePenyakitModal from "../components/DeletePenyakitModal";
import { printPenyakit } from "../service/penyakitService";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_penyakit", label: "ID Penyakit", align: "left" as const },
	{ key: "id_ticket", label: "ID Ticket", align: "left" as const },
	{ key: "signalment_nama", label: "Nama Ternak", align: "left" as const },
	{ key: "signalment_jenis", label: "Jenis", align: "left" as const },
	{ key: "diagnosa", label: "Diagnosa", align: "left" as const },
	{ key: "prognosis", label: "Prognosis", align: "center" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
	{ key: "actions", label: "", align: "center" as const },
];

export default function Penyakit() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingPenyakit, setEditingPenyakit] = useState<Penyakit | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingPenyakit, setDeletingPenyakit] = useState<Penyakit | null>(
		null,
	);
	const [printingId, setPrintingId] = useState<string | null>(null);
	const deferredSearch = useDeferredValue(search);

	const [limit, setLimit] = useState(10);

	const {
		penyakit,
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
	} = usePenyakit({ search: deferredSearch, limit });

	const pagination = getPaginationRange(currentPage, lastPage);

	const handleAdd = () => {
		setEditingPenyakit(null);
		setShowFormModal(true);
	};

	const handleEdit = (penyakit: Penyakit) => {
		setEditingPenyakit(penyakit);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingPenyakit(null);
	};

	const handleDelete = (penyakit: Penyakit) => {
		setDeletingPenyakit(penyakit);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingPenyakit(null);
	};

	const handlePrint = async (id: string) => {
		setPrintingId(id);
		try {
			const blob = await printPenyakit(id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `BA_Penyakit_${id}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch {
			// silent fail
		} finally {
			setPrintingId(null);
		}
	};

	const getPrognosisBadge = (prognosis: string) => {
		const prognosisLower = prognosis?.toLowerCase();
		let className = "";
		if (prognosisLower === "fausta") {
			className = "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200";
		} else if (prognosisLower === "dubius") {
			className = "bg-amber-50 text-amber-600 ring-1 ring-amber-200";
		} else if (prognosisLower === "infausta") {
			className = "bg-red-50 text-red-600 ring-1 ring-red-200";
		} else {
			className = "bg-gray-50 text-gray-600 ring-1 ring-gray-200";
		}
		return className;
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Penyakit</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Daftar Penyakit</h1>
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
								placeholder="Cari ID, nama, diagnosa..."
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
						Add Penyakit
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
								Array.from({ length: limit }).map((_, i) => (
									<tr key={i}>
										{COLUMNS.map((col) => (
											<td key={col.key} className="py-3.5 px-4">
												<div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-full max-w-24" />
											</td>
										))}
									</tr>
								))
							) : penyakit.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data penyakit"}
									</td>
								</tr>
							) : (
								penyakit.map((item: Penyakit, index: number) => (
									<tr
										key={item.id_penyakit}
										className="group hover:bg-blue-50/40 transition-colors">
										<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
											{index + 1}
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap">
											<span className="font-semibold text-blue-600">
												{item.id_penyakit}
											</span>
										</td>

										<td className="py-3.5 px-4">
											<span className="text-gray-600 text-xs font-mono">
												{item.id_ticket}
											</span>
										</td>

										<td className="py-3.5 px-4">
											<div className="leading-tight">
												<p className="font-medium text-gray-800">{item.signalment_nama}</p>
												<p className="text-[11px] text-gray-400 mt-0.5">
													{item.signalment_jenisKelamin} · {item.signalment_umur} thn
												</p>
											</div>
										</td>

										<td className="py-3.5 px-4">
											<span className="text-gray-600">
												{item.signalment_jenis} - {item.signalment_ras}
											</span>
										</td>

										<td className="py-3.5 px-4">
											<span className="text-gray-600 max-w-xs block truncate">
												{item.diagnosa}
											</span>
										</td>

										<td className="py-3.5 px-4 text-center">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPrognosisBadge(
													item.prognosis,
												)}`}>
												{item.prognosis}
											</span>
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
											{item.created_at}
										</td>

										<td className="py-3.5 px-4">
											<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => handlePrint(item.id_penyakit)}
													disabled={printingId === item.id_penyakit}
													className="p-1.5 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-40"
													title="Print">
													<Printer size={14} />
												</button>
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

			<PenyakitFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				penyakit={editingPenyakit}
			/>

			<DeletePenyakitModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				penyakit={deletingPenyakit}
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

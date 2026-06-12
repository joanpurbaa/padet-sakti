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
import { useStaff } from "../hooks/useStaff";
import type { Staff as StaffType } from "../types/Staff";
import StaffFormModal from "../components/StaffFormModal";
import DeleteStaffModal from "../components/DeleteStaffModal";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_staff", label: "ID Staff", align: "left" as const },
	{ key: "nama", label: "Nama", align: "left" as const },
	{ key: "no_hp", label: "No. HP", align: "left" as const },
	// { key: "surat_izin", label: "Surat Izin", align: "left" as const },
	{ key: "asal", label: "Asal", align: "left" as const },
	{ key: "actions", label: "", align: "center" as const },
];

export default function Staff() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingStaff, setDeletingStaff] = useState<StaffType | null>(null);
	const deferredSearch = useDeferredValue(search);

	const [limit, setLimit] = useState(10);

	const {
		staffs,
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
	} = useStaff({ search: deferredSearch });

	const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

	const handleAdd = () => {
		setEditingStaff(null);
		setShowFormModal(true);
	};

	const handleEdit = (staff: StaffType) => {
		setEditingStaff(staff);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingStaff(null);
	};

	const handleDelete = (staff: StaffType) => {
		setDeletingStaff(staff);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingStaff(null);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Staff</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Daftar Staff</h1>
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
								placeholder="Cari nama, ID..."
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
						Add Staff
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
							) : staffs.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data staff"}
									</td>
								</tr>
							) : (
								staffs.map((staff: StaffType, index: number) => (
									<tr
										key={staff.id_staff}
										className="group hover:bg-blue-50/40 transition-colors">
										<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
											{(isSearching ? 0 : from - 1) + index + 1}
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap">
											<span className="font-semibold text-blue-600">{staff.id_staff}</span>
										</td>

										<td className="py-3.5 px-4">
											<p className="font-medium text-gray-800">{staff.nama}</p>
										</td>

										<td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
											{staff.no_hp}
										</td>

										{/* <td className="py-3.5 px-4">
											<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
												{staff.surat_izin}
											</span>
										</td> */}

										<td className="py-3.5 px-4 text-gray-600">{staff.asal}</td>

										<td className="py-3.5 px-4">
											<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => handleEdit(staff)}
													className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
													title="Edit">
													<Pencil size={14} />
												</button>
												<button
													onClick={() => handleDelete(staff)}
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

			<StaffFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				staff={editingStaff}
			/>

			<DeleteStaffModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				staff={deletingStaff}
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

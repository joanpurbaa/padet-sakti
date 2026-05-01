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
	Play,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { useTickets } from "../hooks/useTickets";
import type { DisplayTicket } from "../types/Ticket";
import TicketFormModal from "../components/TicketFormModal";
import DeleteTicketModal from "../components/DeleteTicketModal";
import { updateTicketStatus } from "../service/ticketService";

const COLUMNS = [
	{ key: "no", label: "#", align: "center" as const },
	{ key: "id_ticket", label: "ID Ticket", align: "left" as const },
	{ key: "petugas", label: "Petugas", align: "left" as const },
	{ key: "pelapor", label: "Pelapor", align: "left" as const },
	{ key: "created_at", label: "Tanggal", align: "left" as const },
	{ key: "jenis_laporan", label: "Jenis Laporan", align: "left" as const },
	{ key: "status", label: "Status", align: "center" as const },
	{ key: "actions", label: "", align: "center" as const },
];

export default function Tickets() {
	const [search, setSearch] = useState<string>("");
	const [showFormModal, setShowFormModal] = useState(false);
	const [editingTicket, setEditingTicket] = useState<DisplayTicket | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingTicket, setDeletingTicket] = useState<DisplayTicket | null>(
		null,
	);
	const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
	const deferredSearch = useDeferredValue(search);

	const [limit, setLimit] = useState(10);

	const {
		tickets,
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
	} = useTickets({ search: deferredSearch, limit });

	const pagination = getPaginationRange(currentPage, lastPage);

	const handleAdd = () => {
		setEditingTicket(null);
		setShowFormModal(true);
	};

	const handleEdit = (ticket: DisplayTicket) => {
		setEditingTicket(ticket);
		setShowFormModal(true);
	};

	const handleCloseFormModal = () => {
		setShowFormModal(false);
		setEditingTicket(null);
	};

	const handleDelete = (ticket: DisplayTicket) => {
		setDeletingTicket(ticket);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingTicket(null);
	};

	const handleUpdateStatus = async (ticket: DisplayTicket) => {
		const statusLower = ticket.status?.toLowerCase();
		let newStatus = "";

		if (statusLower === "pending") {
			newStatus = "In Progress";
		} else if (statusLower === "in progress") {
			newStatus = "Resolved";
		} else {
			return;
		}

		setUpdatingStatusId(ticket.id_ticket);
		try {
			await updateTicketStatus(ticket.id_ticket, newStatus);
			refetch();
		} catch {
			// silent fail
		} finally {
			setUpdatingStatusId(null);
		}
	};

	const getStatusButton = (ticket: DisplayTicket) => {
		const statusLower = ticket.status?.toLowerCase();
		const isUpdating = updatingStatusId === ticket.id_ticket;

		if (statusLower === "pending") {
			return (
				<button
					onClick={() => handleUpdateStatus(ticket)}
					disabled={isUpdating}
					className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-40"
					title="Accept">
					{isUpdating ? (
						<Loader2 size={14} className="animate-spin" />
					) : (
						<Play size={14} />
					)}
				</button>
			);
		}

		if (statusLower === "in progress") {
			return (
				<button
					onClick={() => handleUpdateStatus(ticket)}
					disabled={isUpdating}
					className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-40"
					title="Done">
					{isUpdating ? (
						<Loader2 size={14} className="animate-spin" />
					) : (
						<CheckCircle2 size={14} />
					)}
				</button>
			);
		}

		return null;
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-400">Home / Ticket</p>
				<h1 className="text-2xl font-bold text-gray-800 mt-0.5">Daftar Ticket</h1>
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
								placeholder="Cari nama, ID..."
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
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
						<Plus size={15} />
						Add Ticket
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
								Array.from({ length: 10 }).map((_, i) => (
									<tr key={i}>
										{COLUMNS.map((col) => (
											<td key={col.key} className="py-3.5 px-4">
												<div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-full max-w-24" />
											</td>
										))}
									</tr>
								))
							) : tickets.length === 0 ? (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className="text-center text-gray-400 text-sm py-16">
										{isSearching
											? "Tidak ada data yang cocok dengan pencarian"
											: "Tidak ada data tiket"}
									</td>
								</tr>
							) : (
								tickets.map((ticket: DisplayTicket, index: number) => {
									const statusLower = ticket.status?.toLowerCase();
									const isPending = statusLower === "pending";
									const isInProgress = statusLower === "in progress";
									const isResolved = statusLower === "resolved";
									const hasStatus = ticket.status !== null;

									return (
										<tr
											key={ticket.id_ticket ?? index}
											className="group hover:bg-blue-50/40 transition-colors">
											<td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
												{(isSearching ? 0 : from - 1) + index + 1}
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap">
												<span className="font-semibold text-blue-600">
													{ticket.id_ticket}
												</span>
											</td>

											<td className="py-3.5 px-4">
												{ticket.petugas ? (
													<div className="leading-tight">
														<p className="font-medium text-gray-800">{ticket.petugas}</p>
														<p className="text-[11px] text-gray-400 mt-0.5">
															{ticket.id_staff}
														</p>
													</div>
												) : (
													<span className="text-gray-300 text-xs">—</span>
												)}
											</td>

											<td className="py-3.5 px-4">
												<div className="leading-tight">
													<p className="font-medium text-gray-800">{ticket.pelapor}</p>
													<p className="text-[11px] text-gray-400 mt-0.5">
														{ticket.id_peternak}
													</p>
													{ticket.alamat && (
														<p className="text-[11px] text-gray-400">{ticket.alamat}</p>
													)}
												</div>
											</td>

											<td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
												{ticket.created_at}
											</td>

											<td className="py-3.5 px-4">
												{ticket.jenis_laporan ? (
													<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
														{ticket.jenis_laporan}
													</span>
												) : (
													<span className="text-gray-300 text-xs">—</span>
												)}
											</td>

											<td className="py-3.5 px-4 text-center">
												{hasStatus ? (
													<span
														className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
															${
																isPending
																	? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
																	: isInProgress
																		? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
																		: isResolved
																			? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
																			: "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
															}`}>
														<span
															className={`h-1.5 w-1.5 rounded-full ${
																isPending
																	? "bg-orange-400"
																	: isInProgress
																		? "bg-blue-400"
																		: isResolved
																			? "bg-emerald-400"
																			: "bg-gray-400"
															}`}
														/>
														{ticket.status}
													</span>
												) : (
													<span className="text-gray-300 text-xs">—</span>
												)}
											</td>

											<td className="py-3.5 px-4">
												<div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													{getStatusButton(ticket)}
													<button
														onClick={() => handleEdit(ticket)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDelete(ticket)}
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

			<TicketFormModal
				open={showFormModal}
				onClose={handleCloseFormModal}
				onSuccess={refetch}
				ticket={editingTicket}
			/>

			<DeleteTicketModal
				open={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onSuccess={refetch}
				ticket={deletingTicket}
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

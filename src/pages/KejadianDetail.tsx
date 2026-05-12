import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	RefreshCw,
	AlertCircle,
	FileText,
	Plus,
	Pencil,
	Trash2,
} from "lucide-react";
import { useKejadianDetail } from "../hooks/useKejadianDetail";
import { printPdf } from "../service/kejadianService";
import type {
	KejadianDetailIB,
	KejadianDetailKelahiran,
	KejadianDetailPKB,
} from "../types/Kejadian";
import AddInseminasiModal from "../components/AddInseminasiModal";
import EditIBModal from "../components/EditIBModal";
import DeleteIBModal from "../components/DeleteIBModal";
import AddPKBModal from "../components/AddPKBModal";
import AddKelahiranModal from "../components/AddKelahiranModal";
import EditPKBModal from "../components/EditPKBModal";
import DeletePKBModal from "../components/DeletePKBModal";
import EditKelahiranModal from "../components/EditKelahiranModal";
import DeleteKelahiranModal from "../components/DeleteKelahiranModal";

export default function KejadianDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { detail, loading, error, refetch } = useKejadianDetail(id ?? "");

	const [showIBModal, setShowIBModal] = useState(false);
	const [showPKBModal, setShowPKBModal] = useState(false);
	const [showKelahiranModal, setShowKelahiranModal] = useState(false);

	const [editingIB, setEditingIB] = useState<KejadianDetailIB | null>(null);
	const [showEditIBModal, setShowEditIBModal] = useState(false);
	const [deletingIB, setDeletingIB] = useState<KejadianDetailIB | null>(null);
	const [showDeleteIBModal, setShowDeleteIBModal] = useState(false);

	const handleEditIB = (item: KejadianDetailIB) => {
		setEditingIB(item);
		setShowEditIBModal(true);
	};

	const handleCloseEditIB = () => {
		setShowEditIBModal(false);
		setEditingIB(null);
	};

	const handleDeleteIB = (item: KejadianDetailIB) => {
		setDeletingIB(item);
		setShowDeleteIBModal(true);
	};

	const handleCloseDeleteIB = () => {
		setShowDeleteIBModal(false);
		setDeletingIB(null);
	};

	const [editingPKB, setEditingPKB] = useState<KejadianDetailPKB | null>(null);
	const [showEditPKBModal, setShowEditPKBModal] = useState(false);
	const [deletingPKB, setDeletingPKB] = useState<KejadianDetailPKB | null>(null);
	const [showDeletePKBModal, setShowDeletePKBModal] = useState(false);

	const handleEditPKB = (item: KejadianDetailPKB) => {
		setEditingPKB(item);
		setShowEditPKBModal(true);
	};

	const handleCloseEditPKB = () => {
		setShowEditPKBModal(false);
		setEditingPKB(null);
	};

	const handleDeletePKB = (item: KejadianDetailPKB) => {
		setDeletingPKB(item);
		setShowDeletePKBModal(true);
	};

	const handleCloseDeletePKB = () => {
		setShowDeletePKBModal(false);
		setDeletingPKB(null);
	};

	const [editingKelahiran, setEditingKelahiran] =
		useState<KejadianDetailKelahiran | null>(null);
	const [showEditKelahiranModal, setShowEditKelahiranModal] = useState(false);
	const [deletingKelahiran, setDeletingKelahiran] =
		useState<KejadianDetailKelahiran | null>(null);
	const [showDeleteKelahiranModal, setShowDeleteKelahiranModal] =
		useState(false);

	const handleEditKelahiran = (item: KejadianDetailKelahiran) => {
		setEditingKelahiran(item);
		setShowEditKelahiranModal(true);
	};

	const handleCloseEditKelahiran = () => {
		setShowEditKelahiranModal(false);
		setEditingKelahiran(null);
	};

	const handleDeleteKelahiran = (item: KejadianDetailKelahiran) => {
		setDeletingKelahiran(item);
		setShowDeleteKelahiranModal(true);
	};

	const handleCloseDeleteKelahiran = () => {
		setShowDeleteKelahiranModal(false);
		setDeletingKelahiran(null);
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<div>
					<p className="text-xs text-gray-400">Home / Kejadian / Show</p>
					<div className="h-7 w-72 bg-gray-100 rounded-md animate-pulse mt-1" />
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="space-y-3">
							<div className="h-5 w-40 bg-gray-100 rounded-md animate-pulse" />
							<div className="h-4 w-full max-w-md bg-gray-50 rounded-md animate-pulse" />
							<div className="h-4 w-full max-w-sm bg-gray-50 rounded-md animate-pulse" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-4">
				<div>
					<p className="text-xs text-gray-400">Home / Kejadian / Show</p>
					<h1 className="text-2xl font-bold text-gray-800 mt-0.5">
						Detail Kejadian
					</h1>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
						<AlertCircle size={15} className="shrink-0" />
						<span>{error}</span>
					</div>
					<div className="flex items-center gap-3 mt-4">
						<button
							onClick={() => navigate("/kejadian")}
							className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
							<ArrowLeft size={14} />
							Kembali
						</button>
						<button
							onClick={refetch}
							className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
							<RefreshCw size={14} />
							Coba Lagi
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!detail) return null;

	const kejadian = detail.data;
	const peternak = detail.peternak;
	const betina = detail.betina;
	const ibList = detail.ib ?? [];
	const pkbList = detail.pkb ?? [];
	const kelahiranList = detail.kelahiran ?? [];

	return (
		<div className="space-y-4">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs text-gray-400">
						Home / Kejadian / Show / Kejadian {kejadian.id_kejadian}
					</p>
					<h1 className="text-2xl font-bold text-gray-800 mt-0.5">
						Data Kejadian {kejadian.id_kejadian}
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => navigate("/kejadian")}
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-2 rounded-lg transition-colors cursor-pointer">
						<ArrowLeft size={14} />
						Kembali
					</button>
					<button
						onClick={() => printPdf(kejadian.id_kejadian)}
						className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
						<FileText size={14} />
						Print PDF
					</button>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
				<section>
					<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
						Data Kejadian
					</h2>
					<div className="grid grid-cols-1 gap-2 text-sm">
						<DetailRow label="Id Peternak" value={kejadian.id_peternak} />
						<DetailRow label="Id Betina" value={kejadian.id_betina} />
						<DetailRow label="Status" value={kejadian.status} />
						<DetailRow label="Tanggal Dibuat" value={kejadian.created_at} />
						<DetailRow label="Tanggal Diperbarui" value={kejadian.updated_at} />
					</div>
				</section>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<section>
						<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
							Data Peternak
						</h2>
						<div className="grid grid-cols-1 gap-2 text-sm">
							<DetailRow label="Id Peternak" value={peternak?.id_peternak} />
							<DetailRow label="Nama" value={peternak?.nama} />
							<DetailRow label="Alamat" value={peternak?.alamat} />
							<DetailRow label="NO HP" value={peternak?.no_hp} />
						</div>
					</section>

					<section>
						<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
							Data Sapi
						</h2>
						<div className="grid grid-cols-1 gap-2 text-sm">
							<DetailRow label="Ear Tag" value={betina?.ear_tag} />
							<DetailRow label="Nama Sapi" value={betina?.nama} />
							<DetailRow label="Tanggal Lahir" value={betina?.tanggal_lahir} />
						</div>
					</section>
				</div>

				<section>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 flex-1">
							Data Inseminasi Buatan
						</h2>
						<button
							onClick={() => setShowIBModal(true)}
							className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-4">
							<Plus size={14} />
							Add Inseminasi
						</button>
					</div>
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<Th align="center">#</Th>
									<Th>ID IB</Th>
									<Th>Petugas</Th>
									<Th>Pejantan (Straw)</Th>
									<Th>No Dokumen</Th>
									<Th>Hasil</Th>
									<Th>Status Tindakan</Th>
									<Th>Tanggal Dibuat</Th>
									<Th>Tanggal Diperbarui</Th>
									<Th align="center" children={undefined}></Th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{ibList.length > 0 ? (
									ibList.map((item, index) => (
										<tr
											key={item.id_ib ?? index}
											className="group hover:bg-blue-50/40 transition-colors">
											<Td center>{index + 1}</Td>
											<Td>{item.id_ib}</Td>
											<Td>{item.id_staff}</Td>
											<Td>{item.pejantan}</Td>
											<Td>{item.no_dokumen}</Td>
											<Td>
												<StatusBadge value={item.hasil} />
											</Td>
											<Td>{item.status_tindakan}</Td>
											<Td muted>{item.created_at}</Td>
											<Td muted>{item.updated_at}</Td>
											<td className="py-3 px-4">
												<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleEditIB(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDeleteIB(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
														title="Delete">
														<Trash2 size={14} />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<EmptyRow colSpan={10} />
								)}
							</tbody>
						</table>
					</div>
				</section>

				<section>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 flex-1">
							Data Pengecekan Kebuntingan
						</h2>
						<button
							onClick={() => setShowPKBModal(true)}
							className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-4">
							<Plus size={14} />
							Add PKB
						</button>
					</div>
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<Th align="center">#</Th>
									<Th>ID PKB</Th>
									<Th>Petugas</Th>
									<Th>ID IB</Th>
									<Th>No Dokumen</Th>
									<Th>Hasil</Th>
									<Th>Keterangan</Th>
									<Th>Tanggal Dibuat</Th>
									<Th>Tanggal Diperbarui</Th>
									<Th align="center" children={undefined}></Th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{pkbList.length > 0 ? (
									pkbList.map((item, index) => (
										<tr
											key={item.id_pkb ?? index}
											className="group hover:bg-blue-50/40 transition-colors">
											<Td center>{index + 1}</Td>
											<Td>{item.id_pkb}</Td>
											<Td>{item.id_staff}</Td>
											<Td>{item.id_ib}</Td>
											<Td>{item.no_dokumen}</Td>
											<Td>
												<StatusBadge value={item.hasil} />
											</Td>
											<Td>{item.keterangan}</Td>
											<Td muted>{item.created_at}</Td>
											<Td muted>{item.updated_at}</Td>
											<td className="py-3 px-4">
												<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleEditPKB(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDeletePKB(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
														title="Delete">
														<Trash2 size={14} />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<EmptyRow colSpan={10} />
								)}
							</tbody>
						</table>
					</div>
				</section>

				<section>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 flex-1">
							Data Kelahiran
						</h2>
						<button
							onClick={() => setShowKelahiranModal(true)}
							className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-4">
							<Plus size={14} />
							Add Kelahiran
						</button>
					</div>
					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<Th align="center">#</Th>
									<Th>ID Kelahiran</Th>
									<Th>Nama</Th>
									<Th>Petugas</Th>
									<Th>Jenis Kelamin</Th>
									<Th>Keunggulan</Th>
									<Th>Tanggal Dibuat</Th>
									<Th>Tanggal Diperbarui</Th>
									<Th align="center" children={undefined}></Th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{kelahiranList.length > 0 ? (
									kelahiranList.map((item, index) => (
										<tr
											key={item.id_kelahiran ?? index}
											className="group hover:bg-blue-50/40 transition-colors">
											<Td center>{index + 1}</Td>
											<Td>{item.id_kelahiran}</Td>
											<Td>{item.nama}</Td>
											<Td>{item.id_staff}</Td>
											<Td>
												<StatusBadge value={item.jenis_kelamin} />
											</Td>
											<Td>{item.keunggulan}</Td>
											<Td muted>{item.created_at}</Td>
											<Td muted>{item.updated_at}</Td>
											<td className="py-3 px-4">
												<div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition-opacity">
													<button
														onClick={() => handleEditKelahiran(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
														title="Edit">
														<Pencil size={14} />
													</button>
													<button
														onClick={() => handleDeleteKelahiran(item)}
														className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
														title="Delete">
														<Trash2 size={14} />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<EmptyRow colSpan={9} />
								)}
							</tbody>
						</table>
					</div>
				</section>
			</div>

			<AddInseminasiModal
				open={showIBModal}
				onClose={() => setShowIBModal(false)}
				onSuccess={refetch}
				idKejadian={kejadian.id_kejadian}
			/>

			<EditIBModal
				open={showEditIBModal}
				onClose={handleCloseEditIB}
				onSuccess={refetch}
				ib={editingIB}
			/>

			<DeleteIBModal
				open={showDeleteIBModal}
				onClose={handleCloseDeleteIB}
				onSuccess={refetch}
				ib={deletingIB}
			/>

			<AddPKBModal
				open={showPKBModal}
				onClose={() => setShowPKBModal(false)}
				onSuccess={refetch}
				idKejadian={kejadian.id_kejadian}
			/>

			<AddKelahiranModal
				open={showKelahiranModal}
				onClose={() => setShowKelahiranModal(false)}
				onSuccess={refetch}
				idKejadian={kejadian.id_kejadian}
			/>

			<EditPKBModal
				open={showEditPKBModal}
				onClose={handleCloseEditPKB}
				onSuccess={refetch}
				pkb={editingPKB}
			/>

			<DeletePKBModal
				open={showDeletePKBModal}
				onClose={handleCloseDeletePKB}
				onSuccess={refetch}
				pkb={deletingPKB}
			/>

			<EditKelahiranModal
				open={showEditKelahiranModal}
				onClose={handleCloseEditKelahiran}
				onSuccess={refetch}
				kelahiran={editingKelahiran}
			/>

			<DeleteKelahiranModal
				open={showDeleteKelahiranModal}
				onClose={handleCloseDeleteKelahiran}
				onSuccess={refetch}
				kelahiran={deletingKelahiran}
			/>
		</div>
	);
}

interface DetailRowProps {
	label: string;
	value?: string | null;
	children?: React.ReactNode;
}

function DetailRow({ label, value, children }: DetailRowProps) {
	return (
		<div className="flex items-start">
			<span className="w-44 shrink-0 text-gray-500">{label}</span>
			<span className="text-gray-400 mr-2">:</span>
			{children ?? (
				<span className="text-gray-800 font-medium">{value ?? "—"}</span>
			)}
		</div>
	);
}

function Th({
	children,
	align,
}: {
	children: React.ReactNode;
	align?: "center" | "left";
}) {
	return (
		<th
			className={`text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap border-b border-gray-200 ${
				align === "center" ? "text-center" : "text-left"
			}`}>
			{children}
		</th>
	);
}

function Td({
	children,
	center,
	muted,
}: {
	children: React.ReactNode;
	center?: boolean;
	muted?: boolean;
}) {
	return (
		<td
			className={`py-3 px-4 ${center ? "text-center text-gray-400 font-mono text-xs" : ""} ${
				muted ? "text-gray-500 text-xs" : "text-gray-700"
			}`}>
			{children ?? "—"}
		</td>
	);
}

function StatusBadge({ value }: { value: string | null }) {
	if (!value) return <span className="text-gray-300">—</span>;
	return (
		<span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
			{value}
		</span>
	);
}

function EmptyRow({ colSpan }: { colSpan: number }) {
	return (
		<tr>
			<td colSpan={colSpan} className="text-center text-gray-400 text-sm py-8">
				Tidak ada data
			</td>
		</tr>
	);
}

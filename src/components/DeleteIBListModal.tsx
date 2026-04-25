import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { deleteIB } from "../service/ibService";
import type { IB } from "../types/Ib";

interface DeleteIBListModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	ib: IB | null;
}

export default function DeleteIBListModal({
	open,
	onClose,
	onSuccess,
	ib,
}: DeleteIBListModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open || !ib) return null;

	const handleDelete = async () => {
		setLoading(true);
		setError(null);

		try {
			await deleteIB(ib.id_ib);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Gagal menghapus data inseminasi buatan");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && !loading) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			onClick={handleBackdropClick}>
			<div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-800">Hapus IB</h2>
					<button
						onClick={onClose}
						disabled={loading}
						className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40">
						<X size={18} />
					</button>
				</div>

				<div className="p-6 space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
							{error}
						</div>
					)}

					<div className="flex items-start gap-3">
						<div className="p-2 bg-red-50 rounded-lg shrink-0">
							<AlertTriangle size={20} className="text-red-500" />
						</div>
						<div>
							<p className="text-sm text-gray-700">
								Apakah kamu yakin ingin menghapus data inseminasi buatan ini?
							</p>
							<p className="text-sm font-semibold text-gray-900 mt-1">{ib.id_ib}</p>
							<p className="text-xs text-gray-400 mt-0.5">
								Kejadian: {ib.id_kejadian} · Pejantan: {ib.pejantan} · Staff:{" "}
								{ib.id_staff}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							disabled={loading}
							className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40">
							Batal
						</button>
						<button
							type="button"
							onClick={handleDelete}
							disabled={loading}
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60">
							{loading ? (
								<>
									<Loader2 size={14} className="animate-spin" />
									Menghapus...
								</>
							) : (
								"Hapus IB"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

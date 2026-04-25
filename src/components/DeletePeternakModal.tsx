import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { deletePeternak } from "../service/peternakService";
import type { DeletePeternakModalProps } from "../types/Peternak";

export default function DeletePeternakModal({
	open,
	onClose,
	onSuccess,
	peternak,
}: DeletePeternakModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open || !peternak) return null;

	const handleDelete = async () => {
		setLoading(true);
		setError(null);

		try {
			await deletePeternak(peternak.id_peternak);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Gagal menghapus peternak");
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
					<h2 className="text-lg font-bold text-gray-800">Hapus Peternak</h2>
					<button
						onClick={onClose}
						disabled={loading}
						className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40">
						<X size={18} />
					</button>
				</div>

				<div className="p-6 space-y-4">
					<div className="flex gap-3">
						<div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
							<AlertTriangle size={20} className="text-red-500" />
						</div>
						<div>
							<p className="text-sm text-gray-700">
								Apakah Anda yakin ingin menghapus peternak ini?
							</p>
							<p className="text-sm font-semibold text-gray-900 mt-1">
								{peternak.id_peternak}
							</p>
							<p className="text-xs text-gray-400 mt-0.5">
								{peternak.nama} · {peternak.alamat}
							</p>
							<p className="text-xs text-red-400 mt-2">
								Tindakan ini tidak dapat dibatalkan.
							</p>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
							{error}
						</div>
					)}

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
								"Hapus Peternak"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

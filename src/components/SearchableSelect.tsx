import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import type { SearchableSelectProps } from "../types/SearchSelect";

export default function SearchableSelect({
	options,
	value,
	onChange,
	placeholder = "Pilih...",
	error,
	loading,
	disabled,
	onSearchChange,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const ref = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const selected = options.find((o) => o.value === value);

	const filtered = onSearchChange
		? options
		: options.filter(
				(o) =>
					o.label.toLowerCase().includes(search.toLowerCase()) ||
					o.value.toLowerCase().includes(search.toLowerCase()),
			);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
				setSearch("");
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus();
		}
	}, [open]);

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearch(val);
		onSearchChange?.(val);
	};

	const handleSelect = (val: string) => {
		onChange(val);
		setOpen(false);
		setSearch("");
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange("");
		setSearch("");
	};

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => !disabled && setOpen(!open)}
				disabled={disabled}
				className={`w-full flex items-center justify-between border rounded-lg px-4 py-2.5 text-sm text-left outline-none transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
					error
						? "border-red-400 bg-red-50"
						: open
							? "border-blue-500 bg-white"
							: "border-gray-200 bg-gray-50 hover:border-gray-300"
				}`}>
				<span className={selected ? "text-gray-800" : "text-gray-400"}>
					{loading ? "Memuat..." : selected ? selected.label : placeholder}
				</span>
				<div className="flex items-center gap-1">
					{value && !disabled && (
						<span
							onClick={handleClear}
							className="p-0.5 rounded hover:bg-gray-200 transition-colors">
							<X size={12} className="text-gray-400" />
						</span>
					)}
					<ChevronDown
						size={14}
						className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
					/>
				</div>
			</button>

			{open && (
				<div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
					<div className="p-2 border-b border-gray-100">
						<input
							ref={inputRef}
							type="text"
							value={search}
							onChange={handleSearchInput}
							placeholder="Cari..."
							className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
						/>
					</div>
					<div className="max-h-48 overflow-y-auto">
						{filtered.length === 0 ? (
							<div className="px-4 py-3 text-sm text-gray-400 text-center">
								{loading ? "Mencari..." : "Tidak ditemukan"}
							</div>
						) : (
							filtered.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => handleSelect(opt.value)}
									className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
										opt.value === value
											? "bg-blue-50 text-blue-700 font-medium"
											: "text-gray-700 hover:bg-gray-50"
									}`}>
									{opt.label}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}

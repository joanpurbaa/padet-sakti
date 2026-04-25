import { useState, useRef, useEffect } from "react";
import { Bell, UserCircle, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
	const [open, setOpen] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { handleLogout } = useAuth();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const onLogout = async () => {
		setLoggingOut(true);
		try {
			await handleLogout();
		} finally {
			setLoggingOut(false);
		}
	};

	return (
		<header className="bg-white h-14 flex items-center justify-end px-6 shadow-sm border-b border-orange-100 shrink-0">
			<div className="flex items-center gap-5">
				<div className="relative cursor-pointer">
					<Bell
						size={20}
						className="text-gray-500 hover:text-orange-600 transition-colors"
					/>
					<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
						2
					</span>
				</div>

				<div className="h-6 w-px bg-orange-200" />

				<div className="relative" ref={dropdownRef}>
					<button
						onClick={() => setOpen((prev) => !prev)}
						className="flex items-center gap-2 cursor-pointer">
						<span className="text-sm text-gray-700 font-medium">Douglas McGee</span>
						<div className="w-9 h-9 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border border-orange-200">
							<UserCircle size={28} className="text-orange-500" />
						</div>
					</button>

					{open && (
						<div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
							<button
								onClick={onLogout}
								disabled={loggingOut}
								className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50">
								{loggingOut ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<LogOut size={16} />
								)}
								{loggingOut ? "Logging out..." : "Logout"}
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

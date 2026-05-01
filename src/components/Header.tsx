import { useState, useRef, useEffect } from "react";
import { Bell, UserCircle, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../service/api";

interface PendingTicket {
	id: number;
	title?: string;
	subject?: string;
	status?: string;
	[key: string]: unknown;
}

export default function Header() {
	const [open, setOpen] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const [tickets, setTickets] = useState<PendingTicket[]>([]);
	const [loadingTickets, setLoadingTickets] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const notifRef = useRef<HTMLDivElement>(null);

	const { handleLogout } = useAuth();
	const { user } = useAuthContext();

	const userName =
		(user?.name as string) ??
		(user?.username as string) ??
		(user?.full_name as string) ??
		"User";

	const fetchTickets = async () => {
		setLoadingTickets(true);
		try {
			const data = await apiFetch<PendingTicket[]>("/ticket/pending");
			setTickets(Array.isArray(data) ? data : []);
		} catch {
			setTickets([]);
		} finally {
			setLoadingTickets(false);
		}
	};

	const handleNotifToggle = () => {
		if (!notifOpen) fetchTickets();
		setNotifOpen((prev) => !prev);
		setOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
			if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
				setNotifOpen(false);
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
				<div className="relative" ref={notifRef}>
					<button onClick={handleNotifToggle} className="relative cursor-pointer">
						<Bell
							size={20}
							className="text-gray-500 hover:text-orange-600 transition-colors"
						/>
						{tickets.length > 0 && (
							<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
								{tickets.length > 9 ? "9+" : tickets.length}
							</span>
						)}
					</button>

					{notifOpen && (
						<div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
							<div className="bg-blue-500 px-4 py-2.5">
								<span className="text-white text-xs font-bold tracking-widest uppercase">
									Alerts Center
								</span>
							</div>
							<div className="max-h-64 overflow-y-auto">
								{loadingTickets ? (
									<div className="flex items-center justify-center py-6">
										<Loader2 size={18} className="animate-spin text-gray-400" />
									</div>
								) : tickets.length === 0 ? (
									<p className="text-sm text-gray-400 text-center py-6">
										Tidak ada notifikasi
									</p>
								) : (
									tickets.map((ticket) => (
										<div
											key={ticket.id}
											className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
											<p className="text-sm text-gray-700 font-medium truncate">
												{(ticket.title as string) ??
													(ticket.subject as string) ??
													`Tiket #${ticket.id}`}
											</p>
											{ticket.status && (
												<span className="text-xs text-orange-500 font-medium capitalize">
													{ticket.status as string}
												</span>
											)}
										</div>
									))
								)}
							</div>
						</div>
					)}
				</div>

				<div className="h-6 w-px bg-orange-200" />

				<div className="relative" ref={dropdownRef}>
					<button
						onClick={() => {
							setOpen((prev) => !prev);
							setNotifOpen(false);
						}}
						className="flex items-center gap-2 cursor-pointer">
						<span className="text-sm text-gray-700 font-medium">{userName}</span>
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

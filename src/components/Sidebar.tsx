import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Ticket,
	Users,
	CalendarDays,
	Activity,
	ChevronDown,
	ChevronRight,
	ChevronLeft,
	CircleDot,
} from "lucide-react";
import type { KejadianSubItem, SideNavItemProps } from "../types/Sidebar";

const SIDEBAR_BG = "bg-[#3b1f0e]";
const SUBMENU_BG = "bg-[#4d2a14]";

export default function Sidebar() {
	const location = useLocation();
	const navigate = useNavigate();

	const isKejadianActive = location.pathname.startsWith("/kejadian");
	const isPeternakActive = location.pathname.startsWith("/peternak");

	const [kejadianOpen, setKejadianOpen] = useState<boolean>(isKejadianActive);
	const [peternakOpen, setPeternakOpen] = useState<boolean>(isPeternakActive);
	const [collapsed, setCollapsed] = useState<boolean>(false);

	const kejadianSubItems: KejadianSubItem[] = [
		{ label: "IB", to: "/kejadian/ib" },
		{ label: "PKB", to: "/kejadian/pkb" },
		{ label: "Kelahiran", to: "/kejadian/kelahiran" },
	];

	return (
		<div
			className={`${collapsed ? "w-16" : "w-64"} min-h-screen ${SIDEBAR_BG} flex flex-col transition-all duration-300 shrink-0 p-2`}>
			<div className="flex items-center justify-center px-3 py-5 border-b border-[#5a3a1e]">
				<img
					src="/icon.png"
					alt="Logo"
					className={`object-contain ${collapsed ? "w-8 h-8" : "w-24 h-24"}`}
				/>
			</div>

			<nav className="flex-1 py-3 flex flex-col gap-1 overflow-y-auto">
				<div className="px-2">
					<NavLink
						to="/dashboard"
						className={({ isActive }) =>
							`flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-colors ${
								isActive
									? "bg-[#e68c23] text-white font-semibold"
									: "text-gray-300 hover:bg-[#4d2a14]"
							}`
						}>
						<LayoutDashboard size={16} className="shrink-0" />
						{!collapsed && <span className="text-sm font-semibold">Dashboard</span>}
					</NavLink>
				</div>

				<Divider />

				<SideNavItem
					to="/tickets"
					icon={<Ticket size={16} />}
					label="Tickets"
					collapsed={collapsed}
				/>

				<Divider />

				<SideNavItem
					to="/staff"
					icon={<Users size={16} />}
					label="Staff"
					collapsed={collapsed}
				/>

				<Divider />

				<div className="px-2">
					<div
						className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
							isKejadianActive && location.pathname === "/kejadian"
								? "bg-[#e68c23] text-white font-semibold"
								: isKejadianActive
									? "bg-[#4d2a14]"
									: "hover:bg-[#4d2a14]"
						}`}>
						<div
							className="flex items-center gap-2 flex-1 cursor-pointer"
							onClick={() => navigate("/kejadian")}>
							<CalendarDays
								size={16}
								className={`shrink-0 ${
									isKejadianActive && location.pathname === "/kejadian"
										? "text-white"
										: "text-gray-300"
								}`}
							/>
							{!collapsed && (
								<span
									className={`text-sm ${
										isKejadianActive && location.pathname === "/kejadian"
											? "text-white font-semibold"
											: "text-gray-300"
									}`}>
									Kejadian
								</span>
							)}
						</div>
						{!collapsed && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setKejadianOpen(!kejadianOpen);
								}}
								className="p-0.5 rounded hover:bg-[#5a3a1e] transition-colors cursor-pointer">
								{kejadianOpen ? (
									<ChevronDown size={14} className="text-gray-400" />
								) : (
									<ChevronRight size={14} className="text-gray-400" />
								)}
							</button>
						)}
					</div>

					{kejadianOpen && !collapsed && (
						<div className={`${SUBMENU_BG} rounded-md mt-1 mx-1 p-2`}>
							{kejadianSubItems.map(({ label, to }: KejadianSubItem) => (
								<NavLink
									key={label}
									to={to}
									className={({ isActive }) =>
										`block text-sm px-3 py-1.5 rounded cursor-pointer transition-colors ${
											isActive
												? "bg-[#e68c23] text-white font-semibold"
												: "text-gray-300 hover:bg-[#5a3a1e]"
										}`
									}>
									{label}
								</NavLink>
							))}
						</div>
					)}
				</div>

				<Divider />

				<SideNavItem
					to="/penyakit"
					icon={<Activity size={16} />}
					label="Penyakit"
					collapsed={collapsed}
				/>

				<Divider />

				<div className="px-2">
					<div
						className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
							isPeternakActive && location.pathname === "/peternak"
								? "bg-[#e68c23] text-white font-semibold"
								: isPeternakActive
									? "bg-[#4d2a14]"
									: "hover:bg-[#4d2a14]"
						}`}>
						<div
							className="flex items-center gap-2 flex-1 cursor-pointer"
							onClick={() => navigate("/peternak")}>
							<Users
								size={16}
								className={`shrink-0 ${
									isPeternakActive && location.pathname === "/peternak"
										? "text-white"
										: "text-gray-300"
								}`}
							/>
							{!collapsed && (
								<span
									className={`text-sm ${
										isPeternakActive && location.pathname === "/peternak"
											? "text-white font-semibold"
											: "text-gray-300"
									}`}>
									Peternak
								</span>
							)}
						</div>
						{!collapsed && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setPeternakOpen(!peternakOpen);
								}}
								className="p-0.5 rounded hover:bg-[#5a3a1e] transition-colors cursor-pointer">
								{peternakOpen ? (
									<ChevronDown size={14} className="text-gray-400" />
								) : (
									<ChevronRight size={14} className="text-gray-400" />
								)}
							</button>
						)}
					</div>

					{peternakOpen && !collapsed && (
						<div className={`${SUBMENU_BG} rounded-md mt-1 mx-1 p-2`}>
							<NavLink
								to="/peternak/sapi-betina"
								className={({ isActive }) =>
									`block text-sm px-3 py-1.5 rounded cursor-pointer transition-colors ${
										isActive
											? "bg-[#e68c23] text-white font-semibold"
											: "text-gray-300 hover:bg-[#5a3a1e]"
									}`
								}>
								Sapi Betina
							</NavLink>
						</div>
					)}
				</div>

				<Divider />

				<SideNavItem
					to="/pejantan"
					icon={<CircleDot size={16} />}
					label="Pejantan"
					collapsed={collapsed}
				/>
			</nav>

			<div
				className={`p-2 flex items-center ${
					collapsed ? "justify-center" : "justify-end border-t border-[#5a3a1e]"
				}`}>
				<button
					onClick={() => setCollapsed(!collapsed)}
					className={`flex items-center justify-center bg-[#4d2a14] hover:bg-[#e68c23] hover:text-white text-gray-300 transition-colors cursor-pointer ${
						collapsed
							? "w-8 h-8 rounded-full"
							: "w-8 h-8 rounded-md border border-[#5a3a1e]"
					}`}>
					{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>
			</div>
		</div>
	);
}

function SideNavItem({ to, icon, label, collapsed }: SideNavItemProps) {
	return (
		<div className="px-2">
			<NavLink
				to={to}
				className={({ isActive }) =>
					`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
						isActive
							? "bg-[#e68c23] text-white font-semibold"
							: "text-gray-300 hover:bg-[#4d2a14]"
					}`
				}>
				<span className="shrink-0">{icon}</span>
				{!collapsed && <span className="text-sm">{label}</span>}
			</NavLink>
		</div>
	);
}

function Divider() {
	return <hr className="border-[#5a3a1e] mx-4 my-0.5" />;
}

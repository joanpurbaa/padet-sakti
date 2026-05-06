import {
	CalendarDays,
	CheckCircle,
	AlertCircle,
	RefreshCw,
	Users,
	UserCog,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import { useDashboardStats } from "../hooks/useDashboardStats";

type IconKey = "calendar" | "check" | "peternak" | "petugas";

interface StatCardConfig {
	title: string;
	valueKey: "today" | "selesai" | "peternak" | "petugas";
	icon: IconKey;
	bg: string;
	iconColor: string;
	valueColor: string;
}

const STAT_CARDS: StatCardConfig[] = [
	{
		title: "Tickets Hari Ini",
		valueKey: "today",
		icon: "calendar",
		bg: "bg-blue-50",
		iconColor: "text-blue-500",
		valueColor: "text-blue-900",
	},
	{
		title: "Total Tickets Selesai",
		valueKey: "selesai",
		icon: "check",
		bg: "bg-green-50",
		iconColor: "text-green-500",
		valueColor: "text-green-900",
	},
	{
		title: "Total Peternak",
		valueKey: "peternak",
		icon: "peternak",
		bg: "bg-yellow-50",
		iconColor: "text-yellow-500",
		valueColor: "text-yellow-900",
	},
	{
		title: "Total Petugas",
		valueKey: "petugas",
		icon: "petugas",
		bg: "bg-purple-50",
		iconColor: "text-purple-500",
		valueColor: "text-purple-900",
	},
];

const ICON_MAP: Record<IconKey, React.ReactNode> = {
	calendar: <CalendarDays size={26} />,
	check: <CheckCircle size={26} />,
	peternak: <Users size={26} />,
	petugas: <UserCog size={26} />,
};

const PIE_COLORS: Record<string, string> = {
	berhasil: "#22c55e",
	gagal: "#ef4444",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [2023, 2024, 2025, CURRENT_YEAR];

export default function Dashboard() {
	const {
		stats,
		kejadianStats,
		loading,
		error,
		refetch,
		selectedYear,
		setSelectedYear,
		chartData, // ← pakai chartData dari hook (sudah terfilter tahun)
	} = useDashboardStats();

	const total = (kejadianStats?.berhasil ?? 0) + (kejadianStats?.gagal ?? 0);
	const pieData = kejadianStats
		? [
				{
					name: `Berhasil (${kejadianStats.berhasil}) ${
						total > 0 ? Math.round((kejadianStats.berhasil / total) * 100) : 0
					}%`,
					value: kejadianStats.berhasil,
					color: PIE_COLORS.berhasil,
				},
				{
					name: `Gagal (${kejadianStats.gagal}) ${
						total > 0 ? Math.round((kejadianStats.gagal / total) * 100) : 0
					}%`,
					value: kejadianStats.gagal,
					color: PIE_COLORS.gagal,
				},
			].filter((d) => d.value > 0)
		: [];

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs text-gray-400 mb-0.5">Home</p>
					<h1 className="text-2xl font-bold text-gray-800 tracking-wide">
						DASHBOARD
					</h1>
				</div>

				<button
					onClick={refetch}
					disabled={loading}
					className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors cursor-pointer mt-1">
					<RefreshCw size={15} className={loading ? "animate-spin" : ""} />
					Refresh
				</button>
			</div>

			{error && (
				<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
					<AlertCircle size={16} className="shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{STAT_CARDS.map((card) => (
					<StatCard
						key={card.valueKey}
						card={card}
						value={stats ? stats[card.valueKey] : null}
						loading={loading}
					/>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-sm font-semibold text-gray-600">
							Jumlah Tiket per Bulan
						</h2>
						<select
							value={selectedYear}
							onChange={(e) => setSelectedYear(Number(e.target.value))}
							className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
							{YEAR_OPTIONS.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>

					{loading ? (
						<div className="h-56 flex items-end gap-2 px-2">
							{Array.from({ length: 12 }).map((_, i) => (
								<div
									key={i}
									className="flex-1 bg-gray-200 rounded animate-pulse"
									style={{ height: `${30 + (i % 5) * 12}%` }}
								/>
							))}
						</div>
					) : (
						<ResponsiveContainer width="100%" height={220}>
							<BarChart data={chartData} barSize={24}>
								<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
								<XAxis
									dataKey="month"
									tick={{ fontSize: 11, fill: "#9ca3af" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11, fill: "#9ca3af" }}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "8px",
										border: "1px solid #e5e7eb",
										fontSize: "12px",
									}}
								/>
								<Bar
									dataKey="tiket"
									fill="#3b82f6"
									radius={[4, 4, 0, 0]}
									name="Jumlah Tiket"
								/>
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
					<h2 className="text-sm font-semibold text-gray-600 mb-4">
						Success Rate Kejadian
					</h2>

					{loading ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
						</div>
					) : pieData.length === 0 ? (
						<div className="flex-1 flex items-center justify-center text-sm text-gray-400">
							Tidak ada data kejadian (Berhasil/Gagal)
						</div>
					) : (
						<div className="flex-1 flex flex-col justify-between">
							<ResponsiveContainer width="100%" height={200}>
								<PieChart>
									<Pie
										data={pieData}
										cx="50%"
										cy="45%"
										innerRadius={52}
										outerRadius={78}
										paddingAngle={3}
										dataKey="value">
										{pieData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											borderRadius: "8px",
											border: "1px solid #e5e7eb",
											fontSize: "12px",
										}}
									/>
									<Legend
										iconType="circle"
										iconSize={8}
										formatter={(value) => (
											<span style={{ fontSize: "11px", color: "#6b7280" }}>{value}</span>
										)}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

interface StatCardProps {
	card: StatCardConfig;
	value: number | null;
	loading: boolean;
}

function StatCard({ card, value, loading }: StatCardProps) {
	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
				<div className="h-3 bg-gray-200 rounded w-2/3 mb-5" />
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-gray-200 rounded-xl" />
					<div className="h-8 bg-gray-200 rounded w-1/4" />
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
			<p className="text-sm text-gray-500 font-medium mb-4">{card.title}</p>
			<div className="flex items-center gap-4">
				<div className={`${card.bg} ${card.iconColor} p-3 rounded-xl`}>
					{ICON_MAP[card.icon]}
				</div>
				<span className={`text-4xl font-bold ${card.valueColor}`}>
					{value ?? "-"}
				</span>
			</div>
		</div>
	);
}

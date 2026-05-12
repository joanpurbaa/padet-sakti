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
	valueKey: "today" | "selesai" | "peternak" | "staff";
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
		valueKey: "staff",
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
	"IB Berhasil": "#22c55e",
	"IB Gagal": "#ef4444",
	"Telah dilakukan Inseminasi Buatan": "#f59e0b",
};

// GANTI DENGAN URL TABLEAU ASLI
const DETAILING_URL = "https://your-tableau-dashboard-url.com";

export default function Dashboard() {
	const {
		stats,
		ibStats,
		loading,
		error,
		refetch,
		selectedYear,
		setSelectedYear,
		chartData,
		availableYears,
	} = useDashboardStats();

	// Siapkan data untuk pie chart (hanya Berhasil dan Gagal)
	const pieData = ibStats
		? [
				{
					name: `IB Berhasil (${ibStats.data[0]})`,
					value: ibStats.data[0],
					color: PIE_COLORS["IB Berhasil"],
				},
				{
					name: `IB Gagal (${ibStats.data[1]})`,
					value: ibStats.data[1],
					color: PIE_COLORS["IB Gagal"],
				},
			].filter((d) => d.value > 0)
		: [];

	const total = (ibStats?.data[0] ?? 0) + (ibStats?.data[1] ?? 0);
	const berhasilPercent =
		total > 0 ? Math.round(((ibStats?.data[0] ?? 0) / total) * 100) : 0;
	const gagalPercent =
		total > 0 ? Math.round(((ibStats?.data[1] ?? 0) / total) * 100) : 0;

	return (
		<div className="space-y-6">
			{/* Header */}
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

			{/* 4 Stat Cards */}
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

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				{/* Bar Chart - Jumlah Tiket per Bulan */}
				<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-sm font-semibold text-gray-600">
							Jumlah Tiket per Bulan
						</h2>
						<select
							value={selectedYear}
							onChange={(e) => setSelectedYear(e.target.value)}
							className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
							{availableYears.map((year) => (
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

				{/* Pie Chart - Success Rate IB */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
					<h2 className="text-sm font-semibold text-gray-600 mb-4">
						Persentase Keberhasilan IB
					</h2>

					{loading ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
						</div>
					) : pieData.length === 0 ? (
						<div className="flex-1 flex items-center justify-center text-sm text-gray-400">
							Tidak ada data IB
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
										dataKey="value"
										label={({ name, percent }) => {
											const value = name?.match(/\d+/)?.[0];
											return `${value || ""} (${(Number(percent) * 100).toFixed(0)}%)`;
										}}
										labelLine={false}>
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
										formatter={(value, name) => [
											`${value} kejadian`,
											name?.split("(")[0].trim(),
										]}
									/>
									<Legend
										iconType="circle"
										iconSize={8}
										formatter={(value) => {
											const match = value.match(/IB (\w+)/);
											const status = match ? match[1] : value;
											const count = value.match(/\d+/)?.[0];
											const percent =
												status === "Berhasil" ? berhasilPercent : gagalPercent;
											return (
												<span style={{ fontSize: "11px", color: "#6b7280" }}>
													{status} ({count}) {percent}%
												</span>
											);
										}}
										layout="horizontal"
										verticalAlign="bottom"
										align="center"
									/>
								</PieChart>
							</ResponsiveContainer>

							{/* Detailing Link */}
							<div className="flex justify-end pt-2 border-t border-gray-50 mt-2">
								<a
									href={DETAILING_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">
									Detailing →
								</a>
							</div>
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

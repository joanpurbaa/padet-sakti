import {
	CalendarDays,
	Ticket,
	CheckCircle,
	AlertCircle,
	RefreshCw,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useDashboardStats } from "../hooks/useDashboardStats";

type IconKey = "calendar" | "ticket" | "check";

interface StatCardConfig {
	title: string;
	valueKey: "today" | "count" | "selesai";
	icon: IconKey;
	bg: string;
	iconColor: string;
	valueColor: string;
}

const STAT_CARDS: StatCardConfig[] = [
	{
		title: "Total Tickets Hari Ini",
		valueKey: "today",
		icon: "calendar",
		bg: "bg-blue-50",
		iconColor: "text-blue-500",
		valueColor: "text-blue-900",
	},
	{
		title: "Total Tickets",
		valueKey: "count",
		icon: "ticket",
		bg: "bg-yellow-50",
		iconColor: "text-yellow-500",
		valueColor: "text-yellow-900",
	},
	{
		title: "Total Tickets Selesai",
		valueKey: "selesai",
		icon: "check",
		bg: "bg-green-50",
		iconColor: "text-green-500",
		valueColor: "text-green-900",
	},
];

const ICON_MAP: Record<IconKey, React.ReactNode> = {
	calendar: <CalendarDays size={26} />,
	ticket: <Ticket size={26} />,
	check: <CheckCircle size={26} />,
};

export default function Dashboard() {
	const { stats, loading, error, refetch } = useDashboardStats();

	const chartData =
		stats?.labels.map((label, i) => ({
			month: label,
			tiket: stats.data[i] ?? 0,
		})) ?? [];

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

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
				{STAT_CARDS.map((card) => (
					<StatCard
						key={card.valueKey}
						card={card}
						value={stats ? stats[card.valueKey] : null}
						loading={loading}
					/>
				))}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h2 className="text-sm font-semibold text-gray-600 mb-6">
					Jumlah Tiket per Bulan
				</h2>

				{loading ? (
					<div className="h-56 flex items-end gap-2 px-2">
						{Array.from({ length: 12 }).map((_, i) => (
							<div
								key={i}
								className="flex-1 bg-gray-200 rounded animate-pulse"
								// eslint-disable-next-line react-hooks/purity
								style={{ height: `${20 + Math.random() * 60}%` }}
							/>
						))}
					</div>
				) : (
					<ResponsiveContainer width="100%" height={220}>
						<LineChart data={chartData}>
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
							<Line
								type="monotone"
								dataKey="tiket"
								stroke="#3b82f6"
								strokeWidth={2.5}
								dot={{ fill: "#3b82f6", r: 4 }}
								activeDot={{ r: 6 }}
								name="Jumlah Tiket"
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
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

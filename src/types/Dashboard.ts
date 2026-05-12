export interface TicketStatistics {
	today: number;
	count: number;
	selesai: number;
	peternak: number;
	staff: number;
	labels: string[];
	data: number[];
}

export interface TicketYearlyResponse {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
	}[];
}

export interface IBStatisticsResponse {
	labels: string[];
	data: number[];
}

export interface KejadianStatistics {
	berhasil: number;
	gagal: number;
}

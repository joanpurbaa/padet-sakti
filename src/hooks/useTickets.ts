import { useState, useEffect, useCallback, useRef } from "react";
import { getTickets, searchTickets } from "../service/ticketService";
import type {
	DisplayTicket,
	Ticket,
	TicketSearchItem,
	UseTicketsOptions,
} from "../types/Ticket";

function mapSearchToDisplay(item: TicketSearchItem): DisplayTicket {
	return {
		id_ticket: item.id_ticket,
		id_peternak: item.id_peternak,
		id_staff: null,
		jenis_laporan: item.jenis_ternak,
		pelapor: item.nama,
		petugas: null,
		status: null,
		created_at: item.created_at,
		alamat: item.alamat,
		no_hp: item.no_hp,
	};
}

function mapTicketToDisplay(ticket: Ticket): DisplayTicket {
	return {
		id_ticket: ticket.id_ticket,
		id_peternak: ticket.id_peternak,
		id_staff: ticket.id_staff,
		jenis_laporan: ticket.jenis_laporan,
		pelapor: ticket.pelapor,
		petugas: ticket.petugas,
		status: ticket.status,
		created_at: ticket.created_at,
	};
}

export function useTickets(options?: UseTicketsOptions) {
	const search = options?.search ?? "";

	const [tickets, setTickets] = useState<DisplayTicket[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const abortRef = useRef<AbortController | null>(null);
	const isSearching = search.trim().length > 0;

  const limit = options?.limit;

	const fetchTickets = useCallback(async () => {
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setLoading(true);
		setError(null);

		try {
			if (isSearching) {
				const res = await searchTickets({ q: search.trim() }, controller.signal);

				const data = (Array.isArray(res) ? res : []).map(mapSearchToDisplay);
				setTickets(data);
				setTotal(data.length);
				setCurrentPage(1);
				setLastPage(1);
				setFrom(data.length > 0 ? 1 : 0);
				setTo(data.length);
			} else {
				const res = await getTickets({ page: currentPage, limit }, controller.signal);

				const pagination = res.data;
				setTickets(pagination.data.map(mapTicketToDisplay));
				setTotal(pagination.total);
				setCurrentPage(pagination.current_page);
				setLastPage(pagination.last_page);
				setFrom(pagination.from);
				setTo(pagination.to);
			}
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Gagal memuat data");
		} finally {
			setLoading(false);
		}
	}, [currentPage, isSearching, limit, search]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchTickets();
		return () => abortRef.current?.abort();
	}, [fetchTickets]);

	useEffect(() => {
		if (isSearching) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCurrentPage(1);
		}
	}, [search, isSearching]);

	const setPage = (page: number) => {
		if (page >= 1 && page <= lastPage) {
			setCurrentPage(page);
		}
	};

	return {
		tickets,
		total,
		currentPage,
		lastPage,
		from,
		to,
		loading,
		error,
		refetch: fetchTickets,
		setPage,
		isSearching,
	};
}

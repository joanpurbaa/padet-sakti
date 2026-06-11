import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Staff from "./pages/Staff";
import Penyakit from "./pages/Penyakit";
import Pejantan from "./pages/Pejantan";
import IB from "./pages/kejadian/IB";
import PKB from "./pages/kejadian/PKB";
import Kelahiran from "./pages/kejadian/Kelahiran";
import SapiBetina from "./pages/peternak/SapiBetina";
import Kejadian from "./pages/Kejadian";
import KejadianDetail from "./pages/KejadianDetail";
import Peternak from "./pages/Peternak";
import Home from "./pages/Home";
import PelaporanPeternak from "./pages/PelaporanPeternak";

function MainLayout() {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-100">
			<Sidebar
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>
			<div className="flex flex-col flex-1 overflow-hidden">
				<Header onMenuClick={() => setMobileOpen(true)} />
				<main className="flex-1 p-4 md:p-6 overflow-auto">
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/tickets" element={<Tickets />} />
						<Route path="/staff" element={<Staff />} />
						<Route path="/penyakit" element={<Penyakit />} />
						<Route path="/pejantan" element={<Pejantan />} />
						<Route path="/peternak" element={<Peternak />} />
						<Route path="/kejadian" element={<Kejadian />} />
						<Route path="/kejadian/show/:id" element={<KejadianDetail />} />
						<Route path="/kejadian/ib" element={<IB />} />
						<Route path="/kejadian/pkb" element={<PKB />} />
						<Route path="/kejadian/kelahiran" element={<Kelahiran />} />
						<Route path="/peternak/sapi-betina" element={<SapiBetina />} />
						<Route path="/pelaporan-peternak" element={<PelaporanPeternak />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

					<Route
						path="/pelaporan-peternak"
						element={
							<ProtectedRoute>
								<PelaporanPeternak />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/*"
						element={
							<ProtectedRoute>
								<MainLayout />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

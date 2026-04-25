import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { LoginForm } from "../types/Auth";

export default function Login() {
	const navigate = useNavigate();
	const { loading, errors, handleLogin } = useAuth();

	const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [localErrors, setLocalErrors] = useState<{
		username?: string;
		password?: string;
	}>({});

	const validate = (): boolean => {
		const errs: { username?: string; password?: string } = {};
		if (!form.username.trim()) errs.username = "Username wajib diisi";
		if (!form.password.trim()) errs.password = "Password wajib diisi";
		setLocalErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setLocalErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		const success = await handleLogin(form);
		if (success) navigate("/dashboard");
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-[#fef3e2] via-white to-[#fff7ed] flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
				<div className="bg-linear-to-br from-[#3b1f0e] to-[#5a3a1e] px-8 py-10 flex flex-col items-center gap-3">
					<img src="/icon.png" alt="Logo" className="w-20 h-20 object-contain" />
					<p className="text-[#d4a574] text-sm">Sistem Manajemen Admin</p>
				</div>

				<div className="px-8 py-8">
					<h2 className="text-gray-800 font-bold text-xl mb-1">Selamat Datang</h2>
					<p className="text-gray-400 text-sm mb-7">Masuk ke akun admin Anda</p>

					{errors.general && (
						<div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-lg px-4 py-3 mb-5">
							{errors.general}
						</div>
					)}

					<form onSubmit={handleSubmit} noValidate className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1.5">
								Username
							</label>
							<div
								className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
									localErrors.username
										? "border-orange-400 bg-orange-50"
										: "border-gray-200 bg-gray-50 focus-within:border-[#e68c23] focus-within:bg-white"
								}`}>
								<User size={16} className="text-gray-400 shrink-0" />
								<input
									type="text"
									name="username"
									value={form.username}
									onChange={handleChange}
									placeholder="Masukkan username"
									autoComplete="username"
									className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
								/>
							</div>
							{localErrors.username && (
								<p className="text-orange-600 text-xs mt-1.5">{localErrors.username}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1.5">
								Password
							</label>
							<div
								className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
									localErrors.password
										? "border-orange-400 bg-orange-50"
										: "border-gray-200 bg-gray-50 focus-within:border-[#e68c23] focus-within:bg-white"
								}`}>
								<Lock size={16} className="text-gray-400 shrink-0" />
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={form.password}
									onChange={handleChange}
									placeholder="Masukkan password"
									autoComplete="current-password"
									className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
							{localErrors.password && (
								<p className="text-orange-600 text-xs mt-1.5">{localErrors.password}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 bg-[#e68c23] hover:bg-[#c97a1e] disabled:opacity-60 text-white font-semibold text-sm rounded-xl py-3.5 transition-colors cursor-pointer mt-2">
							{loading ? (
								<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							) : (
								<>
									<span>Masuk Sekarang</span>
									<ChevronRight size={16} />
								</>
							)}
						</button>
					</form>
				</div>

				<div className="border-t border-gray-100 px-8 py-4 text-center">
					<p className="text-gray-400 text-xs">
						© {new Date().getFullYear()} Sistem Pangan — Admin Only
					</p>
				</div>
			</div>
		</div>
	);
}

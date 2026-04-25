import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import type { LoginForm, LoginError } from "../types/Auth";
import { loginApi, logoutApi } from "../service/authService";

interface UseAuthReturn {
	loading: boolean;
	errors: LoginError;
	handleLogin: (form: LoginForm) => Promise<boolean>;
	handleLogout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
	const { login, logout } = useAuthContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<LoginError>({});

	const handleLogin = async (form: LoginForm): Promise<boolean> => {
		try {
			setLoading(true);
			setErrors({});

			const data = await loginApi(form);
			login(data.token, data.user);
			return true;
		} catch (err) {
			if (err instanceof Error) {
				if (err.message.includes("401")) {
					setErrors({ general: "Username atau password salah." });
				} else if (err.message.includes("422")) {
					setErrors({ general: "Data yang dimasukkan tidak valid." });
				} else {
					setErrors({ general: "Terjadi kesalahan. Coba lagi." });
				}
			}
			return false;
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async (): Promise<void> => {
		try {
			await logoutApi();
		} catch { /* empty */ } finally {
			logout();
		}
	};

	return { loading, errors, handleLogin, handleLogout };
}

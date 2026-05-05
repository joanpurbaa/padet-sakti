import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import type { LoginForm, LoginError, User } from "../types/Auth";
import { loginApi } from "../service/authService";

interface UseAuthReturn {
	loading: boolean;
	errors: LoginError;
	handleLogin: (form: LoginForm) => Promise<User | null>;
	handleLogout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
	const { refreshUser, logout } = useAuthContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<LoginError>({});

	const handleLogin = async (form: LoginForm): Promise<User | null> => {
		try {
			setLoading(true);
			setErrors({});

			const user = await loginApi(form);

			// tetap refresh context agar state auth tersinkron
			await refreshUser();

			return user;
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
			return null;
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async (): Promise<void> => {
		await logout();
	};

	return { loading, errors, handleLogin, handleLogout };
}
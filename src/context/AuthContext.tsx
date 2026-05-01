import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthState } from "../types/Auth";

interface AuthContextType extends AuthState {
	isLoading: boolean;
	login: (token: string, user: User) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [auth, setAuth] = useState<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
	});

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userRaw = localStorage.getItem("user");

		if (token && userRaw) {
			try {
				const user = JSON.parse(userRaw) as User;
				setAuth({ token, user, isAuthenticated: true });
			} catch {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		setIsLoading(false);
	}, []);

	const login = (token: string, user: User) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		setAuth({ token, user, isAuthenticated: true });
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setAuth({ token: null, user: null, isAuthenticated: false });
	};

	return (
		<AuthContext.Provider value={{ ...auth, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
	return ctx;
}
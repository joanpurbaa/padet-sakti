import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/Auth";
import { getCurrentUser, logoutApi } from "../service/authService";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	refreshUser: () => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshUser = async () => {
		try {
			const userData = await getCurrentUser();
			setUser(userData);
		} catch {
			setUser(null);
		}
	};

	const logout = async () => {
		try {
			await logoutApi();
		} catch {
			// ignore
		} finally {
			setUser(null);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		refreshUser().finally(() => setIsLoading(false));
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				refreshUser,
				logout,
			}}
		>
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
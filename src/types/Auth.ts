export interface LoginForm {
	username: string;
	password: string;
}

export interface LoginError {
	username?: string;
	password?: string;
	general?: string;
}

export interface User {
	[key: string]: unknown;
}

export interface LoginResponse {
	message: string;
	token: string;
	user: User;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

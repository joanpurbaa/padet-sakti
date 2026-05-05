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
	
	id?: number;
	username?: string;
	role?: string;
	[key: string]: unknown;

}

export interface LoginResponse {
	message: string;
	token: string;
	user: User;
	role: string;
}

export interface AuthState {
	user: User | null;
	// token: string | null;
	isAuthenticated: boolean;
}

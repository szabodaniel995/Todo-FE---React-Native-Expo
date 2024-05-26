import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface AuthProps {
	authState?: { token: string | null; authenticated: boolean | null };
	onRegister?: (email: string, password: string) => Promise<any>;
	onLogin?: (email: string, password: string) => Promise<any>;
	onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://172.22.176.1:3000";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean | null;
	}>({
		token: null,
		authenticated: null
	});

	useEffect(() => {
		const loadToken = async () => {
			const token =
				Platform.OS !== "web"
					? await SecureStore.getItemAsync(TOKEN_KEY)
					: localStorage.getItem(TOKEN_KEY);

			if (token) {
				setAuthState({
					token: token,
					authenticated: true
				});

				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			}
		};

		loadToken();
	}, []);

	const register = async (email: string, password: string) => {
		try {
			if (!email || !password) {
				throw new Error("No credentials provided");
			}
			const encryptedPassword = await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.SHA256,
				password
			);

			await axios.post(`${API_URL}/auth/signup`, {
				email,
				password: encryptedPassword
			});
		} catch (e: any) {
			throw new Error(
				(e as { response: { data: { message: string } } })?.response?.data?.message || e
			);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			if (!email || !password) {
				throw new Error("No credentials provided");
			}
			const encryptedPassword = await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.SHA256,
				password
			);

			const loginResult = await axios.post(`${API_URL}/auth/login`, {
				email,
				password: encryptedPassword
			});

			if (loginResult.status === 500 || !loginResult.data.token) {
				throw new Error(loginResult.data.msg);
			}

			setAuthState({
				token: loginResult.data.token,
				authenticated: true
			});

			axios.defaults.headers.common["Authorization"] = `Bearer ${loginResult.data.token}`;

			Platform.OS !== "web"
				? await SecureStore.setItemAsync(TOKEN_KEY, loginResult.data.token)
				: localStorage.setItem(TOKEN_KEY, loginResult.data.token);

			return loginResult;
		} catch (e: any) {
			throw new Error(
				(e as { response: { data: { message: string } } })?.response?.data?.message || e
			);
		}
	};

	const logout = async () => {
		try {
			await SecureStore.deleteItemAsync(TOKEN_KEY);
			Platform.OS !== "web"
				? await SecureStore.deleteItemAsync(TOKEN_KEY)
				: localStorage.removeItem(TOKEN_KEY);

			axios.defaults.headers.common["Authorization"] = "";

			setAuthState({
				token: null,
				authenticated: false
			});
		} catch (e: any) {
			throw new Error(
				(e as { response: { data: { message: string } } })?.response?.data?.message || e
			);
		}
	};

	const value = {
		onRegister: register,
		onLogin: login,
		onLogout: logout,
		authState
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

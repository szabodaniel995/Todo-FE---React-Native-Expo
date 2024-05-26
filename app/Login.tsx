import {
	View,
	StyleSheet,
	TextInput,
	Button,
	Text,
	KeyboardAvoidingView,
	Platform
} from "react-native";
import React, { useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";

type FormData = { email: string; password: string };

const Login = () => {
	const { onLogin, onRegister } = useAuth();

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const navigation = useNavigation();

	const signIn = useCallback(async (formData: FormData) => {
		try {
			await onLogin!(formData.email, formData.password);

			navigation.dispatch({
				...StackActions.replace("Tasks"),
				source: undefined,
				target: navigation.getState()?.key
			});
		} catch (e) {
			alert((e as { response: { data: { message: string } } })?.response?.data?.message || e);
		}
	}, []);

	const signUp = useCallback(async (formData: FormData) => {
		try {
			await onRegister!(formData.email, formData.password);
			return signIn(formData);
		} catch (e) {
			alert(e);
		}
	}, []);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.innerContainer}>
				<View style={styles.form}>
					<Controller
						control={control}
						rules={{
							required: true,
							pattern: /\S+@\S+\.\S+/
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								placeholder="Email"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								style={styles.input}
							/>
						)}
						name="email"
					/>
					{errors.email && (
						<Text style={styles.errorText}>Please provide a valid e-mail address.</Text>
					)}

					<Controller
						control={control}
						rules={{
							required: true,
							minLength: 6
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								placeholder="Password"
								secureTextEntry={true}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								style={styles.input}
							/>
						)}
						name="password"
					/>
					{errors.password && (
						<Text style={styles.errorText}>
							Please provide a password, which is at least 6 characters long.
						</Text>
					)}

					<Button onPress={handleSubmit(signIn)} title="Sign in" />
					<Button onPress={handleSubmit(signUp)} title="Create Account" />
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	form: {
		gap: 10,
		width: "60%"
	},
	input: {
		height: 44,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		backgroundColor: "#fff"
	},
	container: {
		flex: 1
	},
	innerContainer: {
		alignItems: "center",
		width: "100%",
		height: "100%",
		justifyContent: "space-around"
	},
	errorText: {
		color: "red"
	}
});

export default Login;

import {
	View,
	StyleSheet,
	TextInput,
	Text,
	Button,
	KeyboardAvoidingView,
	Platform
} from "react-native";
import axios from "axios";
import { API_URL, useAuth } from "./context/AuthContext";
import { Controller, useForm } from "react-hook-form";

export type DetailsFormData = {
	title: string;
	description: string;
	creator: string;
	id: number;
};

export default function DetailsScreen({ route, navigation }: any) {
	const { onLogout } = useAuth();

	const {
		title: incTitle,
		description: incDescription,
		creator,
		id
	}: DetailsFormData = route.params;

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<DetailsFormData>({
		defaultValues: {
			title: incTitle,
			description: incDescription
		}
	});

	const create = async (formData: DetailsFormData) => {
		try {
			await axios.post(`${API_URL}/tasks`, {
				title: formData.title,
				description: formData.description
			});
			navigation.navigate("Tasks");
		} catch (e) {
			alert((e as { response: { data: { message: string } } })?.response?.data?.message || e);
			await redirectToLogin(e);
		}
	};

	const update = async (formData: DetailsFormData) => {
		try {
			await axios.put(`${API_URL}/tasks/${id}`, {
				title: formData.title,
				description: formData.description
			});
			navigation.navigate("Tasks");
		} catch (e) {
			alert((e as { response: { data: { message: string } } })?.response?.data?.message || e);
			await redirectToLogin(e);
		}
	};

	const remove = async () => {
		try {
			await axios.delete(`${API_URL}/tasks/${id}`);
			navigation.navigate("Tasks");
		} catch (e) {
			alert((e as { response: { data: { message: string } } })?.response?.data?.message || e);
			await redirectToLogin(e);
		}
	};

	const redirectToLogin = async (e: any) => {
		if (
			(
				e as {
					response: { data: { message: string }; status: number };
				}
			).response?.status === 401
		) {
			await onLogout!();

			navigation.reset({
				index: 0,
				routes: [{ name: "Login" }]
			});
		}
	};

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
							required: true
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								placeholder="Title"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								style={styles.input}
							/>
						)}
						name="title"
					/>
					{errors.title && <Text style={styles.errorText}>Please provide a Title.</Text>}

					<Controller
						control={control}
						rules={{
							required: true
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								placeholder="Description"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								style={styles.input}
							/>
						)}
						name="description"
					/>
					{errors.description && (
						<Text style={styles.errorText}>Please provide a Description.</Text>
					)}

					{id && <Text>Creator: {creator}</Text>}

					{id ? (
						<Button onPress={handleSubmit(update)} title="Update Task" />
					) : (
						<Button onPress={handleSubmit(create)} title="Create Task" />
					)}

					{id ? <Button onPress={remove} title="Delete Task" /> : <Text></Text>}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

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

import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL } from "./context/AuthContext";
import axios from "axios";
import CircleButton from "./components/CircleButton";
import { useIsFocused } from "@react-navigation/native";

export type Tasks = { title: string; description: string; creator: string; id: number };

export type StackParamList = {
	Details: Tasks | undefined;
};

const Tasks = ({ navigation }: any) => {
	const [tasks, setTasks] = useState<Tasks[]>([]);

	const focus = useIsFocused();

	const loadTasks = async () => {
		try {
			const result = await axios.get(`${API_URL}/tasks`);
			setTasks(result.data.tasks);
		} catch (e: any) {
			alert(e?.message);
		}
	};

	useEffect(() => {
		if (focus == true) {
			loadTasks();
		}
	}, [focus]);

	const toTaskManager = async (
		title?: string,
		description?: string,
		creator?: string,
		id?: number
	) => {
		navigation.navigate("Details", {
			title,
			description,
			creator,
			id
		});
	};

	return (
		<>
			<ScrollView>
				{tasks.map((task, index) => (
					<Pressable
						style={styles.contentContainer}
						onPress={() => toTaskManager(task.title, task.description, task.creator, task.id)}
						key={index}
					>
						<Text>{task.title}</Text>
					</Pressable>
				))}
			</ScrollView>
			<View style={styles.optionsContainer}>
				<View style={styles.optionsRow}>
					<CircleButton onPress={() => toTaskManager()} />
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	optionsContainer: {
		position: "absolute",
		width: "100%",
		bottom: 80
	},
	optionsRow: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row"
	},
	contentContainer: {
		paddingVertical: 20,
		paddingLeft: 20,
		borderBottomColor: "black",
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	outerContainer: {
		backgroundColor: "white"
	}
});

export default Tasks;

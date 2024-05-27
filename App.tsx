import { Button } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Login from "./app/Login";
import Tasks from "./app/Tasks";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import DetailsScreen from "./app/Details";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<AuthProvider>
				<Layout></Layout>
			</AuthProvider>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

export const Layout = () => {
	const { authState, onLogout } = useAuth();

	return (
		<Stack.Navigator initialRouteName={authState?.authenticated ? "Tasks" : "Login"}>
			<Stack.Screen name="Login" component={Login}></Stack.Screen>

			<Stack.Screen
				name="Tasks"
				component={Tasks}
				options={({ route, navigation }) => ({
					headerRight: () => (
						<Button
							onPress={async () => {
								try {
									await onLogout!();

									navigation.dispatch({
										...StackActions.replace("Login"),
										source: undefined,
										target: navigation.getState()?.key
									});
								} catch (e) {
									alert(e);
								}
							}}
							title="Sign Out"
						/>
					)
				})}
			></Stack.Screen>

			<Stack.Screen name="Details" component={DetailsScreen}></Stack.Screen>
		</Stack.Navigator>
	);
};

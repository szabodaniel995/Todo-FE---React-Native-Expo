import { Button } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Login from "./app/Login";
import Tasks from "./app/Tasks";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import DetailsScreen from "./app/Details";

// Todo

// Alábbiak már off. Küldjem el az angular projectet a repoval együtt, abban benne van ez normálisan....

// 1
// autoLogin normálisan

// 2
// Ha ez megvan, akkor még azt kell megoldani, hogy az update/delete gomb legyen disabled hogyha az email !== de mivel is
// Ehhez hogy ezt a FE tudja lehet vmit még mókolni kell. De lehet maga a backend responseban kellene h benne legyen egy true-false
// Hogy adott taskot adott user editálhatja -e
// De ez ilyen legeslegutolsó dolog legyen, mert ők a BE -n kíváncsiak hogy le tudom-e ezt kezelni..!
// Jó lesz másképp simán így alertekkel, hogy Can't update, only creators can update/delete...
// Amúgy ezeknél az alerteknél bármi jobb úgyhogy ... Nem kell szerintem ennyire gyagyásan
// Bár annyiból jó mégis így h nem kell vele tovább xarakodnom & látják hogy a backenden ez le van validálva
// Fejezzem be a többi functiont és aztán meglátom hogy marad -e időm / akarásom ....

// A backenden a tesztekből fog kiderülni hogy nem engedi ha nem adott user csinálta
// A frontendre vmi adatot fel kell küldeni aztán csá. FE -n nincs tudomásom a saját email címről, mert az access token
// Le van titkosítva -> kell valami extra. Legyen h a backend felküldi az usernek bemappolva ezt és csá..

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

// export const ContextWrapper = () => {
// 	return (

// 	);
// };

{
	/* <Layout></Layout> */
}

// 1
// Need a redirection - if user is logged in, redirect to Tasks. If not, always redirect to login
// Is this really necessary? App open up will decide this
// On auto logout at token expiration, theres hould be a re-navigate to Login, and thats all
// But how? Navigation doesn't work there .................
// Well, guess in subcomponent catcherrors.. It works there. Gg

// console.log("01: ", authState);
// console.log("02: ", authState?.authenticated);
// console.log("03: ", onLogout);

// <AuthProvider>

// console.log("1: ", authState);
// console.log("2: ", authState?.authenticated);
// console.log("3: ", onLogout);

// console.log("21: ", authState);
// console.log("22: ", authState?.authenticated);
// console.log("23: ", onLogout);

// </AuthProvider>

//
//
//
//
//

// export default function App() {
// 	return (
// 		// Authproviderbe burkolva minden -> mindenhonnan elérhető
// 		<AuthProvider>
// 			<Layout></Layout>
// 			<StatusBar style="auto" />
// 		</AuthProvider>
// 	);
// }

// export const Layout = () => {
// 	// This is a child of App, that is why we can make the authentication work
// 	const { authState, onLogout } = useAuth();

// 	return (
// 		// NaviContainerbe burkolva -> ez határozza meg a navigációs útvonalakat. Itt vannak a componentek meghatározva. Lehet navigálni
// 		// {authState?.authenticated ? () : ()}
// 		// {authState?.authenticated ? "Tasks" : "Login"}
// 		<NavigationContainer>
// 			<Stack.Navigator initialRouteName={"Login"}>
// 				<Stack.Screen
// 					name="Tasks"
// 					component={Tasks}
// 					options={{
// 						headerRight: () => <Button onPress={onLogout} title="Sign Out" />
// 					}}
// 				></Stack.Screen>

// 				<Stack.Screen name="Login" component={Login}></Stack.Screen>

// 				<Stack.Screen name="Details" component={DetailsScreen}></Stack.Screen>
// 			</Stack.Navigator>
// 			{/* <Stack.Navigator>
// 			</Stack.Navigator> */}
// 		</NavigationContainer>
// 	);
// };

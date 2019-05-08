import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Vibration
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

var STORAGE_KEY = "id_token";
var STORAGE_USER = "username";

class Nav extends React.Component {

    async userLogout() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem(STORAGE_USER);
            Alert.alert("Logout Success! ✅");
            Vibration.vibrate();
            this.props.navigation.push("Login")
        } catch (error) {
            console.log("AsyncStorage error: " + error.message);
        }
    }

    render() {
        return (
            <View>
                <Card borderRadius={15}>
                    <View>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Home") }}>
                            <Text style={styles.homeButtonText}>Go Home 🏠</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.communityButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Communities") }}>
                            <Text style={styles.communityButtonText}>View Communites 👥</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("MyCommunities") }}>
                            <Text style={styles.joinButtonText}>
                                My Communities 👤
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.joinedCommunitiesButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("JoinedCommunities") }}>
                            <Text style={styles.joinedCommunitiesButtonText}>
                                Joined Communities 👤➡️👥
                         </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.growButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("GrowCommunities") }}>
                            <Text style={styles.growButtonText}>Growing Communities 👤🌻</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.newButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("New") }}>
                            <Text style={styles.newButtonText}>New Community ➕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.myCommunitiesButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Profile") }}>
                            <Text style={styles.myCommunitiesButtonText}>Profile 👤</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Search") }}>
                            <Text style={styles.searchButtonText}>Search 🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Map") }}>
                            <Text style={styles.mapButtonText}>Map 🗺</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.userLogout() }}>
                            <Text style={styles.logoutButtonText}>Logout ➡🚪</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        )
    }
}

export default Nav;

const styles = StyleSheet.create({
    joinButton: {
        borderWidth: 1,
        borderColor: "#3D7E9A",
        backgroundColor: "#3D7E9A",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    joinButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    communityButton: {
        borderWidth: 1,
        borderColor: "#007BFF",
        backgroundColor: "#007BFF",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    editButton: {
        borderWidth: 1,
        borderColor: "#FFD517",
        backgroundColor: "#FFD517",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    searchButton: {
        borderWidth: 1,
        borderColor: "#752794",
        backgroundColor: "#752794",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    searchButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    myCommunitiesButton: {
        borderWidth: 1,
        borderColor: "#FF8300",
        backgroundColor: "#FF8300",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    myCommunitiesButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    homeButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    homeButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    joinedCommunitiesButton: {
        borderWidth: 1,
        borderColor: "#E0118A",
        backgroundColor: "#E0118A",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    joinedCommunitiesButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: "#FFE713",
        backgroundColor: "#FFE713",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    loginButton: {
        borderWidth: 1,
        borderColor: "#E0118A",
        backgroundColor: "#E0118A",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    newButton: {
        borderWidth: 1,
        borderColor: "#D33C8C",
        backgroundColor: "#D33C8C",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    newButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    mapButton: {
        borderWidth: 1,
        borderColor: "#B8E35D",
        backgroundColor: "#B8E35D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    mapButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    growButton: {
        borderWidth: 1,
        borderColor: "#00B6B6",
        backgroundColor: "#00B6B6",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    growButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    }
});
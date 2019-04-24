import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { Card } from "react-native-elements";


class Nav extends React.Component {

    render() {
        return (
            <View>
                <Card borderRadius={15}>
                    <View>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("Home") }}
                        >
                            <Text style={styles.homeButtonText}>Go Home 🏠</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.communityButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("Communities") }}
                        >
                            <Text style={styles.communityButtonText}>View Communites 👥</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("MyCommunities") }}
                        >
                            <Text style={styles.joinButtonText}>
                                My Communities 👤
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.joinedCommunitiesButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("JoinedCommunities") }}
                        >
                            <Text style={styles.joinedCommunitiesButtonText}>
                                Joined Communities 👤➡️👥
                         </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.newButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("New") }}
                        >
                            <Text style={styles.newButtonText}>New Community ➕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.myCommunitiesButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("Profile") }}
                        >
                            <Text style={styles.myCommunitiesButtonText}>Profile 👤</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("Search") }}
                        >
                            <Text style={styles.searchButtonText}>Search 🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.meetButton}
                            onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.navigate("Login") }}
                        >
                            <Text style={styles.meetButtonText}>Login 🔑</Text>
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
    meetButton: {
        borderWidth: 1,
        borderColor: "#752794",
        backgroundColor: "#752794",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    meetButtonText: {
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
    searchButton: {
        borderWidth: 1,
        borderColor: "#FFE713",
        backgroundColor: "#FFE713",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    searchButtonText: {
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
    }
});
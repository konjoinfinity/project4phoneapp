import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Vibration
} from "react-native";
import { Card } from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import { AlertHelper } from './AlertHelper';
import SInfo from 'react-native-sensitive-info';

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_KEY = "id_token";
var STORAGE_USER = "username";

class Nav extends React.Component {

    async userLogout() {
        try {
            await SInfo.deleteItem(STORAGE_KEY, {});
            await SInfo.deleteItem(STORAGE_USER, {});
            AlertHelper.show('info', 'Info', 'You have logged out.');
            Vibration.vibrate();
            this.props.navigation.push("Login")
        } catch (error) {
            console.log("SensitiveInfoStorage error: " + error.message);
        }
    }

    render() {
        return (
            <View>
                <Card borderRadius={15}>
                    <View>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={10}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.homeButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Home") }}>
                                <Text style={styles.buttonText}>Go Home 🏠</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={30}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.communityButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Communities") }}>
                                <Text style={styles.buttonText}>View Communites 👥</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={50}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.joinButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("MyCommunities") }}>
                                <Text style={styles.buttonText}>My Communities 👤</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={70}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.joinedCommunitiesButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("JoinedCommunities") }}>
                                <Text style={styles.buttonText}>Joined Communities 👤➡️👥</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={90}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.growButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("GrowCommunities") }}>
                                <Text style={styles.buttonText}>Growing Communities 👤🌻</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={110}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.newButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("New") }}>
                                <Text style={styles.buttonText}>New Community ➕</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={130}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.myCommunitiesButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Profile") }}>
                                <Text style={styles.buttonText}>Profile 👤</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={150}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Search") }}>
                                <Text style={styles.buttonText}>Search 🔍</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={170}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.mapButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.props.navigation.push("Map") }}>
                                <Text style={styles.buttonText}>Map 🗺</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                        <AnimatableView
                            animation="bounceInRight"
                            delay={190}
                            duration={1500}>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => { this.props.navigation.getParam('openCloseNav'); this.userLogout() }}>
                                <Text style={styles.buttonText}>Logout ➡🚪</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                    </View>
                </Card>
            </View>
        )
    }
}

export default Nav;

const styles = StyleSheet.create({
    joinButton: {
        borderColor: "#3D7E9A",
        backgroundColor: "#3D7E9A",
        borderWidth: 1,
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    buttonText: {
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
    searchButton: {
        borderWidth: 1,
        borderColor: "#752794",
        backgroundColor: "#752794",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    myCommunitiesButton: {
        borderWidth: 1,
        borderColor: "#FF8300",
        backgroundColor: "#FF8300",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    homeButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    joinedCommunitiesButton: {
        borderWidth: 1,
        borderColor: "#E0118A",
        backgroundColor: "#E0118A",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: "#FFE713",
        backgroundColor: "#FFE713",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    newButton: {
        borderWidth: 1,
        borderColor: "#D33C8C",
        backgroundColor: "#D33C8C",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    mapButton: {
        borderWidth: 1,
        borderColor: "#B8E35D",
        backgroundColor: "#B8E35D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    growButton: {
        borderWidth: 1,
        borderColor: "#00B6B6",
        backgroundColor: "#00B6B6",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
});
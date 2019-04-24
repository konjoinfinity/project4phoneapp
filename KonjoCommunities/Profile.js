import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Vibration,
    ScrollView
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

var STORAGE_USER = "username";

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: "",
            creator: ""
        };
    }

    async getUsername() {
        var username = await AsyncStorage.getItem(STORAGE_USER);
        console.log(username);
        this.setState({ creator: username });
    }

    componentDidMount() {
        fetch("https://konjomeet.herokuapp.com/community")
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        Vibration.vibrate();
        this.getUsername();
    }

    goHome() {
        Vibration.vibrate();
        this.props.navigation.navigate("Home");
    }

    render() {
        const created =
            this.state.communities &&
            this.state.communities.filter(
                community => community.creator === this.state.creator
            );

        let joined;
        this.state.communities &&
            (joined = this.state.communities.filter(community =>
                community.members.some(member => member.name === this.state.creator)
            ));

        return (
            <ScrollView>
                <View style={{
                    borderBottomWidth: 1,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    padding: 15,
                    borderColor: "#DAD5D5"
                }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 20
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Image
                                source={require("./logo.png")}
                                style={{ width: 60, height: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>
                    Profile
        </Text>
                <Card borderRadius={15}>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>👤 {this.state.creator && this.state.creator}</Text>
                    <TouchableOpacity
                        style={styles.myCommunitiesButton}
                        onPress={() => this.props.navigation.navigate("MyCommunities")}
                    >
                        <Text style={styles.myCommunitiesButtonText}>My Communities 👤</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, textAlign: "center", padding: 15 }}> Communities I've Created: {created && created.length}</Text>
                    <TouchableOpacity
                        style={styles.joinedCommunitiesButton}
                        onPress={() => this.props.navigation.navigate("JoinedCommunities")}
                    >
                        <Text style={styles.joinedCommunitiesButtonText}>
                            Joined Communities 👤➡️👥
          </Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, textAlign: "center", padding: 15 }}>Communities I've Joined: {joined && joined.length}</Text>
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => this.goHome()}
                    >
                        <Text style={styles.homeButtonText}>Go Home 🏠</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>

        );
    }
}
export default ProfileScreen;

const styles = StyleSheet.create({
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
    }
})
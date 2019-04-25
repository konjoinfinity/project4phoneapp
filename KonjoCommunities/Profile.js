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
import Nav from "./Nav"

var STORAGE_USER = "username";

class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require("./logo.png")}
                style={{ width: 60, height: 30 }}
            />
        );
    }
}

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: "",
            creator: "",
            nav: false
        };
        this.openCloseNav = this.openCloseNav.bind(this);
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
        this.props.navigation.setParams({
            openCloseNav: this.openCloseNav
        });
    }

    openCloseNav() {
        if (this.state.nav === false) {
            this.setState({ nav: true });
        } else {
            this.setState({ nav: false });
        }
    }

    goHome() {
        Vibration.vibrate();
        this.props.navigation.navigate("Home");
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<TouchableOpacity
                onPress={navigation.getParam('openCloseNav')}>
                <View>
                    <Image
                        source={require("./menu.png")}
                        style={{ width: 30, height: 30, marginLeft: 10 }} />
                </View>
            </TouchableOpacity>
            )
        };
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

        let mycommunities;
        this.state.communities &&
            (mycommunities = this.state.communities.filter(
                community => community.creator === this.state.creator
            ));
        let mine;
        this.state.communities &&
            (mine = mycommunities.map((community, id) => {
                return (
                    <TouchableOpacity
                        key={id}
                        style={styles.communityButton}
                        onPress={() =>
                            this.props.navigation.navigate("Community", {
                                communityId: `${community._id}`
                            })
                        }
                    >
                        <Text style={styles.communityButtonText}>{community.name}</Text>
                    </TouchableOpacity>
                );
            }));
        let joinedcommunities;
        this.state.communities &&
            (joinedcommunities = this.state.communities.filter(community =>
                community.members.some(member => member.name === this.state.creator)
            ));
        let joinedcom;
        this.state.communities &&
            (joinedcom = joinedcommunities.map((community, id) => {
                return (
                    <TouchableOpacity
                        key={id}
                        style={styles.communityButton}
                        onPress={() =>
                            this.props.navigation.navigate("Community", {
                                communityId: `${community._id}`
                            })
                        }
                    >
                        <Text style={styles.communityButtonText}>{community.name}</Text>
                    </TouchableOpacity>
                );
            }));

        return (
            <ScrollView>
                {this.state.nav === true && <Nav navigation={this.props.navigation} />}
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

                    <Card borderRadius={15}>
                        <View>
                            <Text style={{ fontSize: 25, textAlign: "center", padding: 15 }}> Communities I've Created: {created && created.length}</Text>
                            {mine}
                        </View>
                    </Card>
                    <TouchableOpacity
                        style={styles.joinedCommunitiesButton}
                        onPress={() => this.props.navigation.navigate("JoinedCommunities")}
                    >
                        <Text style={styles.joinedCommunitiesButtonText}>
                            Joined Communities 👤➡️👥
          </Text>
                    </TouchableOpacity>
                    <Card borderRadius={15}>
                        <View>
                            <Text style={{ fontSize: 25, textAlign: "center", padding: 15 }}>Communities I've Joined: {joined && joined.length}</Text>
                            {joinedcom}
                        </View>
                    </Card>
                </Card>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => this.goHome()}
                >
                    <Text style={styles.homeButtonText}>Go Home 🏠</Text>
                </TouchableOpacity>
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
    },
    communityButton: {
        borderWidth: 1,
        borderColor: "#007BFF",
        backgroundColor: "#007BFF",
        padding: 10,
        margin: 5,
        borderRadius: 15
    },
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        textAlign: "center"
    }
})
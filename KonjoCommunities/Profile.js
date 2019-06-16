import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Vibration,
    ScrollView,
    Alert,
    Button,
    TextInput
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import * as Animatable from 'react-native-animatable';

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_USER = "username";
var STORAGE_KEY = "id_token";

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
            userToken: "",
            commcreated: false,
            commjoined: false,
            changepass: false,
            password: "",
            newpassword: "",
            confirmnewpassword: ""
        };
        this.openCloseCommCreated = this.openCloseCommCreated.bind(this);
        this.openCloseCommJoined = this.openCloseCommJoined.bind(this);
        this.openCloseChangePass = this.openCloseChangePass.bind(this);
    }

    async getUsername() {
        var username = await AsyncStorage.getItem(STORAGE_USER);
        this.setState({ creator: username });
    }

    async getToken() {
        var token = await AsyncStorage.getItem(STORAGE_KEY);
        this.setState({ userToken: token });
    }

    async componentDidMount() {
        Vibration.vibrate();
        await this.getToken();
        await fetch("https://konjomeet.herokuapp.com/community", {
            method: "GET",
            headers: {
                "user-token": `${this.state.userToken}`
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        this.getUsername();
    }

    openCloseCommCreated() {
        this.setState(prevState => ({
            commcreated: !prevState.commcreated
        }));
        Vibration.vibrate();
    }

    openCloseCommJoined() {
        this.setState(prevState => ({
            commjoined: !prevState.commjoined
        }));
        Vibration.vibrate();
    }

    openCloseChangePass() {
        if (this.state.changepass === false) {
            this.setState({ changepass: true })
            Vibration.vibrate();
        } else {
            this.setState({ changepass: false })
            Vibration.vibrate();
        }
    }



    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("NewHome")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🏠</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Search")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🔎</Text>
                    </View>
                </TouchableOpacity>
            </View>
            ),
            headerRight: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("New")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>➕</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Login")}>
                    <View>
                        <Image
                            source={require("./logout.png")}
                            style={{ width: 20, height: 20 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
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
                        style={{
                            borderWidth: 1,
                            borderColor: "#FFFFFF",
                            backgroundColor: "#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6),
                            padding: 10,
                            margin: 5,
                            borderRadius: 15
                        }}
                        onPress={() =>
                            this.props.navigation.push("Community", {
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
                        style={{
                            borderWidth: 1,
                            borderColor: "#FFFFFF",
                            backgroundColor: "#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6),
                            padding: 10,
                            margin: 5,
                            borderRadius: 15
                        }}
                        onPress={() =>
                            this.props.navigation.push("Community", {
                                communityId: `${community._id}`
                            })
                        }
                    >
                        <Text style={styles.communityButtonText}>{community.name}</Text>
                    </TouchableOpacity>
                );
            }));
        return (
            <ScrollView ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollToEnd({ animated: true });
                }}>
                <AnimatableView
                    animation="bounceInUp"
                    delay={10}
                    duration={1800}>
                    <Card title="Profile" titleStyle={{ fontSize: 30, textAlign: "center", padding: 10, fontFamily: 'system font', color: "#000000" }} borderRadius={15}>
                        <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>👤 {this.state.creator && this.state.creator}</Text>
                        <Card borderRadius={15} containerStyle={{ backgroundColor: "#FF8300" }}>
                            <View>
                                <Text style={{ fontSize: 25, textAlign: "center", padding: 15, color: "#FFFFFF" }}> Communities I've Created: {created && created.length}</Text>
                                {this.state.commcreated === false &&
                                    <Button onPress={() => this.openCloseCommCreated()}
                                        title="Show"
                                        color="#2A87A6" />}
                                {this.state.commcreated === true &&
                                    <Button onPress={() => this.openCloseCommCreated()}
                                        title="Hide"
                                        color="#2A87A6" />}
                                {this.state.commcreated === true && <Card borderRadius={15}>
                                    <AnimatableView animation={this.state.commcreated === true ? "bounceInUp" : undefined}
                                        delay={10}
                                        duration={1500}>
                                        {this.state.commcreated === true && mine}
                                    </AnimatableView>
                                </Card>}
                            </View>
                        </Card>
                        <Card borderRadius={15} containerStyle={{ backgroundColor: "#E0118A" }}>
                            <View>
                                <Text style={{ fontSize: 25, textAlign: "center", padding: 15, color: "#FFFFFF" }}>Communities I've Joined: {joined && joined.length}</Text>
                                {this.state.commjoined === false &&
                                    <Button onPress={() => this.openCloseCommJoined()}
                                        title="Show"
                                        color="#A3F100" />}
                                {this.state.commjoined === true &&
                                    <Button onPress={() => this.openCloseCommJoined()}
                                        title="Hide"
                                        color="#A3F100" />}
                                <AnimatableView animation={this.state.commjoined === true ? "bounceInUp" : undefined}
                                    delay={10}
                                    duration={1500}>
                                    {this.state.commjoined === true && joinedcom}

                                </AnimatableView>
                            </View>
                        </Card>
                        <Card borderRadius={15}>
                            <TouchableOpacity
                                style={styles.changePassButton}
                                onPress={() => this.props.navigation.push("ChangePass")}>
                                <Text style={styles.changePassButtonText}>Change Password ⌨️</Text>
                            </TouchableOpacity>
                        </Card>
                    </Card>
                </AnimatableView>
            </ScrollView>
        );
    }
}
export default ProfileScreen;

const styles = StyleSheet.create({
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
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        textAlign: "center"
    },
    headerButton: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    },
    inputContainer: {
        paddingTop: 15
    },
    textInput: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 15,
        textAlign: "center"
    },
    changePassButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 15,
        borderRadius: 15
    },
    changePassButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    }
})
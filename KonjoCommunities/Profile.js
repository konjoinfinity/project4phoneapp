import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Vibration,
    ScrollView,
    Button
} from "react-native";
import { Card } from "react-native-elements";
import { AlertHelper } from './AlertHelper';
import * as Animatable from 'react-native-animatable';
import LogoTitle from "./LogoTitle"
import SInfo from 'react-native-sensitive-info';
import konjoUrl from "./Urls";
import ReactNativeHaptic from 'react-native-haptic';

AnimatableView = Animatable.createAnimatableComponent(View);

const STORAGE_USER = "username";
const STORAGE_KEY = "id_token";

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: "",
            creator: "",
            userToken: "",
            commcreated: false,
            commjoined: false,
        };
        this.openCloseCommCreated = this.openCloseCommCreated.bind(this);
        this.openCloseCommJoined = this.openCloseCommJoined.bind(this);
    }

    async getToken() {
        const token = await SInfo.getItem(STORAGE_KEY, {});
        this.setState({ userToken: token });
        const username = await SInfo.getItem(STORAGE_USER, {});
        this.setState({ creator: username });
    }

    async componentDidMount() {
        // ReactNativeHaptic.generate('selection');
        await this.getToken();
        await fetch(konjoUrl + "community", {
            method: "GET",
            headers: {
                "user-token": `${this.state.userToken}`
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            })
            .catch(error => {
                AlertHelper.show('warn', 'Error', `${error.message}!`);
            });
    }

    openCloseCommCreated() {
        this.setState(prevState => ({
            commcreated: !prevState.commcreated
        }));
        // ReactNativeHaptic.generate('selection');
    }

    openCloseCommJoined() {
        this.setState(prevState => ({
            commjoined: !prevState.commjoined
        }));
        // ReactNativeHaptic.generate('selection');
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <AnimatableView
                    animation="bounceInLeft"
                    delay={10}
                    duration={2000}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.push("Home")}>
                        <View>
                            <Text
                                style={{ fontSize: 25 }}>🏠</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatableView>
                <AnimatableView
                    animation="bounceInLeft"
                    delay={10}
                    duration={2000}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.push("Communities")}>
                        <View>
                            <Text
                                style={{ fontSize: 25 }}>👥</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatableView>
            </View>
            ),
            headerRight: (<View style={{ flexDirection: "row" }}>
                <AnimatableView
                    animation="bounceInRight"
                    delay={10}
                    duration={2000}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.push("New")}>
                        <View>
                            <Text
                                style={{ fontSize: 25 }}>➕</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatableView>
                <AnimatableView
                    animation="bounceInRight"
                    delay={10}
                    duration={2000}>
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
                </AnimatableView>
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
                            })}>
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
                            })}>
                        <Text style={styles.communityButtonText}>{community.name}</Text>
                    </TouchableOpacity>
                );
            }));
        return (
            <ScrollView ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollTo({ y: 200, animated: true });
                }}>
                <AnimatableView
                    animation="bounceInUp"
                    delay={10}
                    duration={1800}>
                    <Card title="Profile" titleStyle={{ fontSize: 30, textAlign: "center", padding: 10, fontFamily: 'system font', color: "#000000" }} borderRadius={15}>
                        <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>👤 {this.state.creator && this.state.creator}</Text>
                        <Card borderRadius={15} containerStyle={{ backgroundColor: "#12C16D" }}>
                            <View>
                                <Text style={{ fontSize: 25, textAlign: "center", padding: 15, color: "#FFFFFF" }}> Communities I've Created: {created && created.length}</Text>
                                {this.state.commcreated === false &&
                                    <Button onPress={() => this.openCloseCommCreated()}
                                        title="Show" />}
                                {this.state.commcreated === true &&
                                    <Button onPress={() => this.openCloseCommCreated()}
                                        title="Hide" />}
                                <AnimatableView animation={this.state.commcreated === true ? "bounceInUp" : undefined}
                                    delay={10}
                                    duration={1500}>
                                    {this.state.commcreated === true && mine}
                                </AnimatableView>
                            </View>
                        </Card>
                        <Card borderRadius={15} containerStyle={{ backgroundColor: "#007BFF" }}>
                            <View>
                                <Text style={{ fontSize: 25, textAlign: "center", padding: 15, color: "#FFFFFF" }}>Communities I've Joined: {joined && joined.length}</Text>
                                {this.state.commjoined === false &&
                                    <Button onPress={() => this.openCloseCommJoined()}
                                        title="Show"
                                        color="#FF9900" />}
                                {this.state.commjoined === true &&
                                    <Button onPress={() => this.openCloseCommJoined()}
                                        title="Hide"
                                        color="#FF9900" />}
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
        borderColor: "#752794",
        backgroundColor: "#752794",
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
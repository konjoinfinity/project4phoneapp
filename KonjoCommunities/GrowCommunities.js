import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Vibration
} from "react-native";
import { Card } from "react-native-elements";
import Nav from "./Nav"
import * as Animatable from 'react-native-animatable';
import LogoTitle from "./LogoTitle"
import { AlertHelper } from './AlertHelper';
import SInfo from 'react-native-sensitive-info';
import konjoUrl from "./Urls";
import ReactNativeHaptic from 'react-native-haptic';

AnimatableView = Animatable.createAnimatableComponent(View);

const STORAGE_USER = "username";
const STORAGE_KEY = "id_token";

class GrowCommunitiesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: "",
            creator: "",
            nav: false,
            userToken: ""
        };
        this.openCloseNav = this.openCloseNav.bind(this);
    }

    async getToken() {
        const token = await SInfo.getItem(STORAGE_KEY, {});
        this.setState({ userToken: token });
        const username = await SInfo.getItem(STORAGE_USER, {});
        this.setState({ creator: username });
    }

    async componentDidMount() {
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
            }).catch(error => {
                AlertHelper.show('warn', 'Error', `${error.message}!`);
            });
        ReactNativeHaptic.generate('selection');
        this.props.navigation.setParams({
            openCloseNav: this.openCloseNav
        });
    }

    openCloseNav() {
        this.setState(prevState => ({ nav: !prevState.nav }));
        this.scrolltop.scrollTo({ x: 0, y: 0, animated: true })
        ReactNativeHaptic.generate('selection');
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
        let growcommunities;
        this.state.communities &&
            (growcommunities = this.state.communities.filter(
                community => community.numberOfMembers < 3
            ));
        let growing;
        this.state.communities &&
            (growing = growcommunities.map((community, id) => {
                return (
                    <Card borderRadius={15} key={id}>
                        <TouchableOpacity
                            style={styles.communityButton}
                            onPress={() =>
                                this.props.navigation.push("Community", {
                                    communityId: `${community._id}`
                                })}>
                            <Text style={styles.communityButtonText}>{community.name}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
                            {community.description}
                        </Text>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
                            Members: {community.numberOfMembers}
                        </Text>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
                            Creator: {community.creator}
                        </Text>
                    </Card>
                );
            }));
        return (
            <View style={styles.communities}>
                <ScrollView ref={(ref) => { this.scrolltop = ref; }}>
                    {this.state.nav === true && <Nav navigation={this.props.navigation} />}
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
                        Growing Communities
          </Text>
                    <AnimatableView
                        animation="bounceInUp"
                        delay={10}
                        duration={1800}>
                        {growing}
                    </AnimatableView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    communityButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    communities: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default GrowCommunitiesScreen;

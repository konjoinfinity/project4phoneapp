import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Vibration,
    KeyboardAvoidingView
} from "react-native";
import { Card } from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import DropdownAlert from 'react-native-dropdownalert';

AnimatableView = Animatable.createAnimatableComponent(View);

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

class NewHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: "",
            search: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // this.setState({ dropdown: this.props.navigation.state.params.initialLogin });
        fetch("https://konjomeet.herokuapp.com/community/search")
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        Vibration.vibrate();
        const initlogin = this.props.navigation.getParam('initlogin', 'false');
        if (initlogin === true) {
            this.dropdown.alertWithType('success', 'Success', 'Login Successful, Welcome to Konjo!');
        }
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
                        onPress={() => navigation.push("Profile")}>
                        <View>
                            <Text
                                style={{ fontSize: 25 }}>👤</Text>
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
                        onPress={() => navigation.push("Map")}>
                        <View>
                            <Text
                                style={{ fontSize: 25 }}>🗺</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatableView>
            </View>
            )
        };
    }

    handleChange(search) {
        this.setState({ search });
    }

    render() {
        let communitySearch;
        this.state.communities && (communitySearch = this.state.communities);
        let search;
        this.state.communities && (
            (search = this.state.search.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "").toLowerCase()))

        this.state.communities && console.log(search);

        this.state.communities &&
            search.length > 0 && (
                (communitySearch = communitySearch.filter(function (community) {
                    return community.name.toLowerCase().match(search);
                }))
            )

        let results;
        this.state.communities &&
            (results = communitySearch.map((community, id) => {
                return (
                    this.state.search !== "" && (
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
                    )
                );
            }));
        let newsearch;
        this.state.communities && (
            newsearch =
            this.state.search !== "" &&
            (results.length === 0 && (
                <Card borderRadius={15}>
                    <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
                        Create a New Community
          </Text>
                    <TouchableOpacity
                        style={styles.newButton}
                        onPress={() =>
                            this.props.navigation.push("SearchNew", {
                                newName: this.state.search
                            })
                        }
                    >
                        <Text style={styles.newButtonText}>➕ {this.state.search}</Text>
                    </TouchableOpacity>
                </Card>
            )));
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView>
                    <View>
                        <AnimatableView
                            animation="bounceInUp"
                            delay={10}
                            duration={1800}>
                            <Card borderRadius={15}>
                                <Text style={styles.header}>What would you like to do?</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Verb, Activity"
                                        name="search"
                                        id="search"
                                        onBlur={Keyboard.dismiss}
                                        onChangeText={this.handleChange}
                                        autoFocus={true}
                                    />
                                </View>
                            </Card>
                        </AnimatableView>
                    </View>
                    <AnimatableView
                        animation="bounceInUp"
                        delay={10}
                        duration={1800}>
                        {this.state.search === "" &&
                            <Card borderRadius={15}>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image source={require("./commicon.png")}
                                        style={{ width: 180, height: 180 }}
                                    />
                                </View>
                            </Card>}
                    </AnimatableView>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        {results}
                    </View>
                    {newsearch}
                </ScrollView>
                <DropdownAlert closeInterval={2000} ref={ref => this.dropdown = ref} />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    header: {
        fontSize: 26,
        textAlign: "center",
        margin: 5
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
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        textAlign: "center"
    },
    communities: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    newButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    newButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
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
    }
});

export default NewHomeScreen;

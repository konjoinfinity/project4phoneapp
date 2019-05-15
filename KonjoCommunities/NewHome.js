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
import Nav from "./Nav"

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
            search: "",
            nav: false
        };
        this.openCloseNav = this.openCloseNav.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("https://konjomeet.herokuapp.com/community/search")
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        Vibration.vibrate();
    }

    openCloseNav() {
        if (this.state.nav === false) {
            this.setState({ nav: true });
            Vibration.vibrate();
        } else {
            this.setState({ nav: false });
            Vibration.vibrate();
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Home")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🏠</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Profile")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>👤</Text>
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
                    onPress={() => navigation.push("Map")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🗺</Text>
                    </View>
                </TouchableOpacity>
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
            (search = this.state.search.trim().toLowerCase()))

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
                            style={styles.communityButton}
                            onPress={() =>
                                this.props.navigation.push("Community", {
                                    communityId: `${community._id}`
                                })
                            }
                        >
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
                        <Text style={styles.newButtonText}>{this.state.search} ➕</Text>
                    </TouchableOpacity>
                </Card>
            )));
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView>
                    {this.state.nav === true && <Nav navigation={this.props.navigation} />}
                    <View>
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
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        {results}
                    </View>
                    {newsearch}
                </ScrollView>
                <View style={{ height: 60 }} />
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
        fontSize: 20,
        textAlign: "center",
        margin: 5,
        fontWeight: "bold"
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
        borderRadius: 15
    },
    communityButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 10,
        margin: 5,
        borderRadius: 15
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
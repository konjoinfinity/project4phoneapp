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
    KeyboardAvoidingView,
    Button
} from "react-native";
import { Card } from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import { AlertHelper } from './AlertHelper';
import Modal from "react-native-modal";

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
            search: "",
            modal1: null,
            modal2: null,
            modal3: null,
            modal4: null,
            modal5: null,
            modal6: null,
            modal7: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        fetch("https://konjomeet.herokuapp.com/community/search")
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        const initlogin = this.props.navigation.getParam('initlogin', false);
        if (initlogin !== false) {
            AlertHelper.show('success', 'Success', `Login Successful - Welcome to Konjo, ${initlogin}!`);
        }
        const name = this.props.navigation.getParam('name', 'false');
        const delcomm = this.props.navigation.getParam('delcomm', false);
        if (delcomm !== false) {
            AlertHelper.show('info', 'Info', `You've have deleted ${name}!`);
        }
        const email = this.props.navigation.getParam('email', 'false');
        const signup = this.props.navigation.getParam('signup', false);
        if (signup !== false) {
            AlertHelper.show('info', 'Info', `You've signed up! Welcome to Konjo, ${email}!`);
        }
        if (initlogin !== false || signup !== false) {
            setTimeout(() => {
                this.setState({ modal1: true })
                Vibration.vibrate();
            }, 3000)
        } else {
            this.textInput.focus();
            Vibration.vibrate();
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

    modal1 = () =>
        (
            <View style={styles.modal1}>
                <Text style={styles.modalText}>Welcome to</Text>
                <Image
                    source={require("./logo.png")}
                    style={{ width: 200, height: 100 }}
                />
                <Text style={styles.modalText}>Swipe to continue</Text>
            </View>
        );

    modal2 = () =>
        (
            <View style={styles.modal2}>
                <Text style={styles.modalText}>Tap the 👤 icon to visit your profile</Text>
            </View>
        );

    modal3 = () =>
        (
            <View style={styles.modal1}>
                <Text style={styles.modalText}>👥 shows a list of all communities</Text>
            </View>
        );

    modal4 = () =>
        (
            <View style={styles.modal2}>
                <Text style={styles.modalText}>To create a new community tap ➕</Text>
            </View>
        );

    modal5 = () =>
        (
            <View style={styles.modal1}>
                <Text style={styles.modalText}>To see a map of all communities, tap the 🗺</Text>
            </View>
        );

    modal6 = () =>
        (
            <View style={styles.modal2}>
                <Text style={styles.modalText}>⌨️ Search for the community you would like to join or create one</Text>
            </View>
        );

    modal7 = () =>
        (
            <View style={styles.modal1}>
                <Text style={styles.modalText}>Enjoy Konjo! 😊</Text>
            </View>
        );

    showModal() {
        if (this.state.modal1 === true) {
            this.setState({ modal1: null })
            setTimeout(() => {
                this.setState({ modal2: true })
            }, 500)
        } else if (this.state.modal2 === true) {
            this.setState({ modal2: null })
            setTimeout(() => {
                this.setState({ modal3: true })
            }, 500)
        } else if (this.state.modal3 === true) {
            this.setState({ modal3: null })
            setTimeout(() => {
                this.setState({ modal4: true })
            }, 500)
        } else if (this.state.modal4 === true) {
            this.setState({ modal4: null })
            setTimeout(() => {
                this.setState({ modal5: true })
            }, 500)
        } else if (this.state.modal5 === true) {
            this.setState({ modal5: null })
            setTimeout(() => {
                this.setState({ modal6: true })
            }, 500)
        } else if (this.state.modal6 === true) {
            this.setState({ modal6: null })
            setTimeout(() => {
                this.setState({ modal7: true })
            }, 500)
        } else if (this.state.modal7 === true) {
            this.setState({ modal7: null })
            Vibration.vibrate();
            setTimeout(() => {
                this.textInput.focus();
            }, 500)
        }
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
                            })}>
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
                                        onChangeText={this.handleChange}
                                        ref={(input) => { this.textInput = input; }}
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
                    <View>
                        <Modal
                            isVisible={this.state.modal1 === true}
                            animationIn="slideInLeft"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal1()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal2 === true}
                            animationIn="slideInDown"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal2()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal3 === true}
                            animationIn="slideInRight"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal3()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal4 === true}
                            animationIn="slideInUp"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal4()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal5 === true}
                            animationIn="slideInLeft"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal5()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal6 === true}
                            animationIn="slideInDown"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal6()}
                        </Modal>
                        <Modal
                            isVisible={this.state.modal7 === true}
                            animationIn="slideInRight"
                            onSwipeComplete={() => this.showModal()}
                            swipeDirection={['up', 'left', 'right', 'down']}
                        >
                            {this.modal7()}
                        </Modal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
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
    },
    modal1: {
        height: 300,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    modalText: {
        fontSize: 25,
        color: 'white',
        padding: 10,
        textAlign: "center"
    },
    modal2: {
        height: 300,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    }
});

export default NewHomeScreen;

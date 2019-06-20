import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Vibration,
    ScrollView,
    TextInput
} from "react-native";
import { Card } from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import { AlertHelper } from './AlertHelper';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import LogoTitle from "./LogoTitle"
import SInfo from 'react-native-sensitive-info';

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_USER = "username";
var STORAGE_KEY = "id_token";

class ChangePassScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creator: "",
            userToken: "",
            password: "",
            newpassword: "",
            confirmnewpassword: ""
        }
        this.changePassword = this.changePassword.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleConfirmNewPasswordChange = this.handleConfirmNewPasswordChange.bind(this);
    }

    componentDidMount() {
        this.getToken();
        Vibration.vibrate();
    }

    async getToken() {
        var token = await SInfo.getItem(STORAGE_KEY, {});
        this.setState({ userToken: token });
        var username = await SInfo.getItem(STORAGE_USER, {});
        this.setState({ creator: username });
    }

    handlePasswordChange(password) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ password });
    }
    handleNewPasswordChange(newpassword) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ newpassword });
    }
    handleConfirmNewPasswordChange(confirmnewpassword) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ confirmnewpassword });
    }


    changePassword() {
        if (this.state.creator !== "") {
            if (this.state.password !== "") {
                if (this.state.newpassword !== "") {
                    if (this.state.confirmnewpassword !== "") {
                        if (this.state.userToken !== "") {
                            if (this.state.newpassword === this.state.confirmnewpassword) {
                                const data = {
                                    email: this.state.creator,
                                    password: this.state.password,
                                    newpassword: this.state.newpassword,
                                    confirmnewpassword: this.state.confirmnewpassword
                                };
                                fetch("https://konjomeet.herokuapp.com/users/changepass", {
                                    method: "POST",
                                    headers: {
                                        "Content-type": "application/json",
                                        "user-token": `${this.state.userToken}`
                                    },
                                    body: JSON.stringify(data)
                                })
                                    .then(response => response.json())
                                    .then(responseData => {
                                        if (responseData.error) {
                                            Vibration.vibrate();
                                            AlertHelper.show('error', 'Error', `${responseData.error}`);
                                        } else {
                                            Vibration.vibrate();
                                            this.props.navigation.push("Login", {
                                                passchange: true
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        AlertHelper.show('warn', 'Error', `${error.message}!`);
                                    });
                            } else {
                                Vibration.vibrate();
                                AlertHelper.show('warn', 'Warning', "New passwords do not match.");
                            }
                        } else {
                            Vibration.vibrate();
                            AlertHelper.show('warn', 'Warning', "Please login to create.");
                        }
                    } else {
                        Vibration.vibrate();
                        AlertHelper.show('warn', 'Warning', "Please confirm new password to change.");
                    }
                } else {
                    Vibration.vibrate();
                    AlertHelper.show('warn', 'Warning', "Please enter new password to change.");
                }
            } else {
                Vibration.vibrate();
                AlertHelper.show('warn', 'Warning', "Please enter current password to change.");
            }
        } else {
            Vibration.vibrate();
            AlertHelper.show('warn', 'Warning', "Please login to create.");
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
                    onPress={() => navigation.push("Communities")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>👥</Text>
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

        return (
            <ScrollView>
                <Card borderRadius={15}>
                    <View>
                        <Text style={{ fontSize: 25, textAlign: "center", padding: 15 }}>Change Password</Text>
                        <AnimatableView animation="bounceInUp"
                            delay={10}
                            duration={1500}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Current Password"
                                    secureTextEntry={true}
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    name="password"
                                    id="password"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={this.handlePasswordChange}
                                    value={this.state.password}
                                    onSubmitEditing={() => { this.passInput.focus(); }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="New Password"
                                    secureTextEntry={true}
                                    name="newpassword"
                                    id="newpassword"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={this.handleNewPasswordChange}
                                    ref={(input) => { this.passInput = input; }}
                                    onSubmitEditing={() => { this.confirmpassInput.focus(); }}
                                    value={this.state.newpassword} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirm New Password"
                                    secureTextEntry={true}
                                    name="confirmnewpassword"
                                    id="confirmnewpassword"
                                    onChangeText={this.handleConfirmNewPasswordChange}
                                    ref={(input) => { this.confirmpassInput = input; }}
                                    onSubmitEditing={this.changePassword}
                                    value={this.state.confirmnewpassword}
                                    returnKeyType='send' />
                            </View>
                            <TouchableOpacity
                                style={styles.changePassButton}
                                onPress={this.changePassword}>
                                <Text style={styles.buttonText}>Submit ⌨️</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                    </View>
                </Card>
            </ScrollView>

        )
    }
}

export default ChangePassScreen;

const styles = StyleSheet.create({
    buttonText: {
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
    }
})
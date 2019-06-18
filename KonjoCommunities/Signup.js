import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Vibration,
    KeyboardAvoidingView
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { AlertHelper } from './AlertHelper';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

var STORAGE_KEY = "id_token";
var STORAGE_USER = "username";

class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require("./klogo.png")}
                style={{ width: 30, height: 30 }}
            />
        );
    }
}

class SignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmpass: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPassChange = this.handleConfirmPassChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.loginClear = this.loginClear.bind(this);
    }

    static navigationOptions = {
        headerTitle: <LogoTitle />,
        headerLeft: null
    };

    componentDidMount() {
        Vibration.vibrate();
    }

    handleEmailChange(email) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ email });
    }
    handlePasswordChange(password) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ password });
    }
    handleConfirmPassChange(confirmpass) {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
        this.setState({ confirmpass });
    }

    loginClear() {
        this.setState({
            email: "",
            password: "",
            confirmpass: ""
        });
    }

    async onValueChange(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log("AsyncStorage error: " + error.message);
        }
    }

    handleSignup() {
        let text = this.state.email
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (reg.test(text) === true) {
            if (this.state.password.length >= 8) {
                fetch("https://konjomeet.herokuapp.com/users/signup", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                        confirmpass: this.state.confirmpass
                    })
                })
                    .then(response => response.json())
                    .then(responseData => {
                        if (responseData.error) {
                            Vibration.vibrate();
                            AlertHelper.show('error', 'Error', `${responseData.error}`);
                        } else {
                            Vibration.vibrate();
                            this.onValueChange(STORAGE_KEY, responseData.token);
                            this.onValueChange(STORAGE_USER, this.state.email);
                            this.props.navigation.push("Home", {
                                signup: true, email: this.state.email
                            });
                            this.loginClear();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                Vibration.vibrate();
                AlertHelper.show('warn', 'Warning', "Passwords are required to have at least 8 characters.");
            }
        } else {
            Vibration.vibrate();
            AlertHelper.show('warn', 'Warning', "Please enter valid email.");
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView>
                    <View>
                        <Card borderRadius={15}>
                            <Text style={styles.header}>Signup</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    name="email"
                                    id="email"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={this.handleEmailChange}
                                    value={this.state.email}
                                    onSubmitEditing={() => { this.passInput.focus(); }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    name="password"
                                    id="password"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={this.handlePasswordChange}
                                    ref={(input) => { this.passInput = input; }}
                                    onSubmitEditing={() => { this.confirmpassInput.focus(); }}
                                    value={this.state.password} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirm Password"
                                    secureTextEntry={true}
                                    name="confirmpass"
                                    id="confirmpass"
                                    onChangeText={this.handleConfirmPassChange}
                                    ref={(input) => { this.confirmpassInput = input; }}
                                    onSubmitEditing={this.handleSignup}
                                    value={this.state.confirmpass}
                                    returnKeyType='send' />
                            </View>
                            <View style={styles.inputContainer}>
                                <TouchableOpacity
                                    style={styles.signupButton}
                                    onPress={this.handleSignup}>
                                    <Text style={styles.signupButtonText}>Signup ⌨️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={() => this.props.navigation.push("Login")}>
                                    <Text style={styles.loginButtonText}>Back to Login 🔑</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    header: {
        fontSize: 30,
        textAlign: "center",
        margin: 10
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
    signupButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    signupButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    loginButton: {
        borderWidth: 1,
        borderColor: "#007BFF",
        backgroundColor: "#007BFF",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    }
});

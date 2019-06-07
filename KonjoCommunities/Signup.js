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
    KeyboardAvoidingView,
    Alert
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

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
        this.setState({ email });
    }
    handlePasswordChange(password) {
        this.setState({ password });
    }
    handleConfirmPassChange(confirmpass) {
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
                    Alert.alert(responseData.error + " ❌");
                } else {
                    Vibration.vibrate();
                    Alert.alert("User Signup Success! ✓");
                    this.onValueChange(STORAGE_KEY, responseData.token);
                    this.onValueChange(STORAGE_USER, this.state.email);
                    this.loginClear();
                    this.props.navigation.push("NewHome");
                }
            })
            .catch(err => {
                console.log(err);
            });
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
        fontSize: 25,
        textAlign: "center",
        margin: 10,
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
    }
});

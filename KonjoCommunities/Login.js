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
  Keyboard
} from "react-native";
import { Card } from "react-native-elements";
import { AlertHelper } from './AlertHelper';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import SInfo from 'react-native-sensitive-info';
import konjoUrl from "./Urls";
import ReactNativeHaptic from 'react-native-haptic';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

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

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.loginClear = this.loginClear.bind(this);
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerLeft: null
  };

  async componentDidMount() {
    // ReactNativeHaptic.generate('selection');
    const username = await SInfo.getItem(STORAGE_USER, {});
    if (username !== undefined) {
      await SInfo.deleteItem(STORAGE_KEY, {});
      await SInfo.deleteItem(STORAGE_USER, {});
      const passchange = this.props.navigation.getParam('passchange', 'false');
      if (passchange === true) {
        AlertHelper.show('info', 'Info', 'Password changed. Please login with your new password.');
      } else {
        AlertHelper.show('info', 'Info', 'You have logged out.');
      }
    }
  }

  handleEmailChange(email) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ email });
  }
  handlePasswordChange(password) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ password });
  }

  loginClear() {
    this.setState({
      email: "",
      password: ""
    });
    Keyboard.dismiss();
  }

  async getUsername() {
    const username = await SInfo.getItem(STORAGE_USER, {});
    AlertHelper.show('info', 'Info', username === null ? "No user logged in" : username + " is logged in");
    // ReactNativeHaptic.generate('selection');
  }

  async onValueChange(item, selectedValue) {
    try {
      await SInfo.setItem(item, selectedValue, {});
    } catch (error) {
      console.log("SensitiveInfoStorage error: " + error.message);
    }
  }

  handleLogin() {
    let text = this.state.email
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(text) === true) {
      fetch(konjoUrl + "users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.error) {
            // ReactNativeHaptic.generate('selection');
            AlertHelper.show('error', 'Error', `${responseData.error}`);
          } else {
            // ReactNativeHaptic.generate('selection');
            this.onValueChange(STORAGE_KEY, responseData.token);
            this.onValueChange(STORAGE_USER, this.state.email);
            this.props.navigation.push("Home", {
              initlogin: this.state.email
            });
            this.loginClear();
          }
        })
    } else {
      // ReactNativeHaptic.generate('selection');
      AlertHelper.show('warn', 'Warning', "Please enter a valid email.");
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <Card borderRadius={15}>
              <Text style={styles.header}>Login</Text>
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
                  onChangeText={this.handlePasswordChange}
                  ref={(input) => { this.passInput = input; }}
                  onSubmitEditing={this.handleLogin}
                  value={this.state.password}
                  returnKeyType='send' />
              </View>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={this.handleLogin}>
                  <Text style={styles.buttonText}>Login 🔑</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => this.props.navigation.push("Signup")}>
                  <Text style={styles.buttonText}>Don't have an Account? Signup! ⌨️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={this.getUsername}>
                  <Text style={styles.buttonText}>Check User ❔</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
export default LoginScreen;

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
  loginButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  checkButton: {
    borderWidth: 1,
    borderColor: "#752794",
    backgroundColor: "#752794",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  }
});

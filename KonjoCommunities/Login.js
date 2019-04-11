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
import AsyncStorage from "@react-native-community/async-storage";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  handleEmailChange(email) {
    this.setState({ email });
  }
  handlePasswordChange(password) {
    this.setState({ password });
  }

  handleLogin() {
    AsyncStorage.setItem("username", this.state.email);
    this.props.navigation.navigate("Home");
    Vibration.vibrate();
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <Image
              style={{ height: 100, width: 200 }}
              source={require("./logo.png")}
            />
            <View>
              <Card borderRadius={15}>
                <Text style={styles.header}>Login</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    name="email"
                    id="email"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleUsernameChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    name="password"
                    id="password"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handlePasswordChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={this.handleLogin}
                  >
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
        <View style={{ height: 60 }} />
      </KeyboardAvoidingView>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45
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
    borderRadius: 15
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

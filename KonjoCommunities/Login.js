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
  AlertIOS
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

var STORAGE_KEY = "id_token";
var STORAGE_USER = "username";

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

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  }

  handleLogIn() {
    axios
      .post("https://konjomeet.herokuapp.com/users/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(response => response.json())
      .then(responseData => {
        AlertIOS.alert("Login Success!"),
          this._onValueChange(STORAGE_KEY, responseData.id_token);
        this._onValueChange(STORAGE_USER, this.state.email);
      });
    this.props.navigation.navigate("Home");
    Vibration.vibrate().catch(err => console.log(err));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <Image
              style={{ height: 50, width: 100 }}
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
export default LoginScreen;

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

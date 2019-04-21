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
  Alert
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

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
    this.handleSignup = this.handleSignup.bind(this);
  }

  static navigationOptions = {
    header: null
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

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    console.log(username);
    Alert.alert(
      username === null ? "No user logged in" : username + " is logged in."
    );
    Vibration.vibrate();
  }

  async userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(STORAGE_USER);
      Alert.alert("Logout Success!");
      Vibration.vibrate();
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  }

  async onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  }

  handleLogin() {
    fetch("https://konjomeet.herokuapp.com/users/login", {
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
          console.log(responseData.error);
          Vibration.vibrate();
          Alert.alert(responseData.error);
        } else {
          Vibration.vibrate();
          Alert.alert("Login Success!");
          console.log(responseData.token);
          this.onValueChange(STORAGE_KEY, responseData.token);
          this.onValueChange(STORAGE_USER, this.state.email);
          this.props.navigation.navigate("Home");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleSignup() {
    fetch("https://konjomeet.herokuapp.com/users/signup", {
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
          console.log(responseData.error);
          Vibration.vibrate();
          Alert.alert(responseData.error);
        } else {
          Vibration.vibrate();
          Alert.alert("User Signup Success!");
          console.log(responseData.token);
          this.onValueChange(STORAGE_KEY, responseData.token);
          this.onValueChange(STORAGE_USER, this.state.email);
          this.props.navigation.navigate("Home");
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
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ height: 50, width: 100 }}
              source={require("./logo.png")}
            />
          </View>
          <View>
            <Card borderRadius={15}>
              <Text style={styles.header}>Login or Signup</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  name="email"
                  id="email"
                  onBlur={Keyboard.dismiss}
                  onChangeText={this.handleEmailChange}
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
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={this.userLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={this.handleSignup}
                >
                  <Text style={styles.signupButtonText}>User Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={this.getUsername}
                >
                  <Text style={styles.checkButtonText}>Check User</Text>
                </TouchableOpacity>
              </View>
            </Card>
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
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#FFD517",
    backgroundColor: "#FFD517",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  logoutButtonText: {
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
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
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

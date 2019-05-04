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

var STORAGE_USER = "username";
var STORAGE_KEY = "id_token";

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

class NewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      category: "",
      creator: "",
      location: {
        lat: null,
        long: null
      },
      userToken: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.newClear = this.newClear.bind(this);
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
          onPress={() => navigation.push("Search")}>
          <View>
            <Text
              style={{ fontSize: 25 }}>🔎</Text>
          </View>
        </TouchableOpacity>
      </View>
      )
    };
  }

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    console.log(username);
    this.setState({ creator: username });
  }

  async getToken() {
    var token = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(token);
    this.setState({ userToken: token });
  }

  componentDidMount() {
    Vibration.vibrate();
    this.getUsername();
    this.getToken();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            long: position.coords.longitude
          }
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  newClear() {
    this.setState({
      name: "",
      description: "",
      category: ""
    });
  }

  handleNameChange(name) {
    this.setState({ name });
  }
  handleDescriptionChange(description) {
    this.setState({ description });
  }
  handleCategoryChange(category) {
    this.setState({ category });
  }

  handleSubmit() {
    const data = {
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
      creator: this.state.creator,
      location: {
        lat: this.state.location.lat,
        long: this.state.location.long
      }
    };
    // https://konjomeet.herokuapp.com/community
    fetch("http://localhost:4000/community", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "user-token": `${this.state.userToken}`
      },
      body: JSON.stringify(data)
    });
    this.props.navigation.push("Communities");
    Vibration.vibrate();
    this.newClear();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <View>
              <Card borderRadius={15}>
                <Text style={styles.header}>New Community</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Name"
                    name="name"
                    id="name"
                    blurOnSubmit={false}
                    onChangeText={this.handleNameChange}
                    autoFocus={true}
                    returnKeyType={"next"}
                    onSubmitEditing={() => { this.descInput.focus(); }}
                    value={this.state.name}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Description"
                    name="description"
                    id="description"
                    blurOnSubmit={false}
                    onChangeText={this.handleDescriptionChange}
                    returnKeyType={"next"}
                    ref={(input) => { this.descInput = input; }}
                    onSubmitEditing={() => { this.catInput.focus(); }}
                    value={this.state.description}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Category"
                    name="category"
                    id="category"
                    onChangeText={this.handleCategoryChange}
                    ref={(input) => { this.catInput = input; }}
                    onSubmitEditing={this.handleSubmit}
                    value={this.state.category}
                    returnKeyType='send'
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.handleSubmit}
                  >
                    <Text style={styles.saveButtonText}>Create</Text>
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
    borderRadius: 15
  },
  saveButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  saveButtonText: {
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

export default NewScreen;

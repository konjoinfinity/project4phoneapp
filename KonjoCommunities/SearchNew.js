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

var STORAGE_USER = "username";

class SearchNewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      category: "",
      creator: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.newClear = this.newClear.bind(this);
  }

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    console.log(username);
    this.setState({ creator: username });
  }

  componentDidMount() {
    Vibration.vibrate();
    this.getUsername();
    this.setState({ name: this.props.navigation.state.params.newName });
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
    const data = this.state;
    fetch("https://konjomeet.herokuapp.com/community", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    this.props.navigation.navigate("Communities");
    Vibration.vibrate();
    this.newClear();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
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
                <Text style={styles.header}>New Community</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.name}
                    name="name"
                    id="name"
                    blurOnSubmit={false}
                    onChangeText={this.handleNameChange}
                    autoFocus={true}
                    returnKeyType={"next"}
                    onSubmitEditing={() => { this.descInput.focus(); }}
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
  }
});

export default SearchNewScreen;

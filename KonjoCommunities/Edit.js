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

class EditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      category: ""
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.editClear = this.editClear.bind(this);
  }

  componentDidMount() {
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.props.navigation.state.params.communityId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          id: res._id,
          name: res.name,
          description: res.description,
          category: res.category
        });
      });
    Vibration.vibrate();
  }

  editClear() {
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
    fetch(`https://konjomeet.herokuapp.com/community/${this.state.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.props.navigation.navigate("Communities");
        Vibration.vibrate();
        this.editClear();
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View style={styles.container}>
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
                <Text style={styles.header}>Edit Community</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.name}
                    name="name"
                    id="name"
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    onChangeText={this.handleNameChange}
                    autoFocus={true}
                    onSubmitEditing={() => { this.descInput.focus(); }}
                    value={this.state.name}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.description}
                    name="description"
                    id="description"
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    onChangeText={this.handleDescriptionChange}
                    ref={(input) => { this.descInput = input; }}
                    onSubmitEditing={() => { this.catInput.focus(); }}
                    value={this.state.description}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state.category}
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
                    <Text style={styles.saveButtonText}>Update</Text>
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

export default EditScreen;

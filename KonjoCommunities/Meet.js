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

class MeetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      location: "",
      date: "",
      time: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  componentDidMount() {
    Vibration.vibrate();
  }

  handleNameChange(name) {
    this.setState({ name });
  }
  handleDescriptionChange(description) {
    this.setState({ description });
  }
  handleLocationChange(location) {
    this.setState({ location });
  }
  handleDateChange(date) {
    this.setState({ date });
  }
  handleTimeChange(time) {
    this.setState({ time });
  }

  handleSubmit() {
    const data = { meet: this.state };
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.props.navigation.state.params.communityId
      }/meet`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    this.props.navigation.navigate("Communities");
    Vibration.vibrate();
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
                <Text style={styles.header}>New Meet</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Name"
                    name="name"
                    id="name"
                    onChangeText={this.handleNameChange}
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    autoFocus={true}
                    onSubmitEditing={() => { this.descInput.focus(); }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Description"
                    name="description"
                    id="description"
                    onChangeText={this.handleDescriptionChange}
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    ref={(input) => { this.descInput = input; }}
                    onSubmitEditing={() => { this.locInput.focus(); }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Location"
                    name="location"
                    id="location"
                    onChangeText={this.handleLocationChange}
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    ref={(input) => { this.locInput = input; }}
                    onSubmitEditing={() => { this.dateInput.focus(); }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Date"
                    name="date"
                    id="date"
                    onChangeText={this.handleDateChange}
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    ref={(input) => { this.dateInput = input; }}
                    onSubmitEditing={() => { this.timeInput.focus(); }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Time"
                    name="time"
                    id="time"
                    onChangeText={this.handleTimeChange}
                    blurOnSubmit={false}
                    ref={(input) => { this.timeInput = input; }}
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.handleSubmit}
                  >
                    <Text style={styles.saveButtonText}>Create Meet</Text>
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
    paddingTop: 5
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

export default MeetScreen;

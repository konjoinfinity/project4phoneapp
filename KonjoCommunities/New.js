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

class NewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      author: "",
      notes: "",
      lyrics: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  handleTitleChange(title) {
    this.setState({ title });
  }
  handleAuthorChange(author) {
    this.setState({ author });
  }
  handleNotesChange(notes) {
    this.setState({ notes });
  }
  handleLyricsChange(lyrics) {
    this.setState({ lyrics });
  }

  handleSubmit() {
    const data = this.state;
    fetch("http://konjomusicbackend.herokuapp.com/songs", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    this.props.navigation.navigate("Songs");
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
                style={{ height: 100, width: 200 }}
                source={require("./logo.png")}
              />
            </View>
            <View>
              <Card borderRadius={15}>
                <Text style={styles.header}>New Song</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Title"
                    name="title"
                    id="title"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleTitleChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Author"
                    name="author"
                    id="author"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleAuthorChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Notes"
                    name="notes"
                    id="notes"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleNotesChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Lyrics"
                    name="lyrics"
                    id="lyrics"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleLyricsChange}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.handleSubmit}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
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

export default NewScreen;

import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Vibration
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import * as Animatable from 'react-native-animatable';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import LogoTitle from "./LogoTitle"

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_KEY = "id_token";

class EditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      category: "",
      userToken: ""
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.editClear = this.editClear.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerLeft: (<View style={{ flexDirection: "row" }}>
        <AnimatableView
          animation="bounceInLeft"
          delay={10}
          duration={2000}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.push("Home")}>
            <View>
              <Text
                style={{ fontSize: 25 }}>🏠</Text>
            </View>
          </TouchableOpacity>
        </AnimatableView>
        <AnimatableView
          animation="bounceInLeft"
          delay={10}
          duration={2000}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.push("Profile")}>
            <View>
              <Text
                style={{ fontSize: 25 }}>👤</Text>
            </View>
          </TouchableOpacity>
        </AnimatableView>
      </View>
      ),
      headerRight: (<View style={{ flexDirection: "row" }}>
        <AnimatableView
          animation="bounceInRight"
          delay={10}
          duration={2000}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.push("New")}>
            <View>
              <Text
                style={{ fontSize: 25 }}>➕</Text>
            </View>
          </TouchableOpacity>
        </AnimatableView>
        <AnimatableView
          animation="bounceInRight"
          delay={10}
          duration={2000}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.push("Communities")}>
            <View>
              <Text
                style={{ fontSize: 25 }}>👥</Text>
            </View>
          </TouchableOpacity>
        </AnimatableView>
      </View>
      )
    };
  }

  async getToken() {
    var token = await AsyncStorage.getItem(STORAGE_KEY);
    this.setState({ userToken: token });
  }

  async componentDidMount() {
    await this.getToken();
    await fetch(`https://konjomeet.herokuapp.com/community/${
      this.props.navigation.state.params.communityId
      }`, {
        method: "GET",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
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
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ name });
  }
  handleDescriptionChange(description) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ description });
  }
  handleCategoryChange(category) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ category });
  }

  handleSubmit() {
    const data = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description,
      category: this.state.category
    };
    fetch(`https://konjomeet.herokuapp.com/community/${this.state.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "user-token": `${this.state.userToken}`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.props.navigation.push("Community", {
          communityId: `${this.state.id}`, edit: true
        })
        Vibration.vibrate();
        this.editClear();
      });
  }

  render() {
    return (
      <View style={styles.container} behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <View>
              <AnimatableView
                animation="bounceInUp"
                delay={10}
                duration={1800}>
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
              </AnimatableView>
            </View>
          </View>
        </ScrollView>
        <KeyboardSpacer />
      </View>
    );
  }
}

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

export default EditScreen;

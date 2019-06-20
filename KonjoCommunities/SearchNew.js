import React from "react";
import {
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
import * as Animatable from 'react-native-animatable';
import { AlertHelper } from './AlertHelper';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import LogoTitle from "./LogoTitle"
import SInfo from 'react-native-sensitive-info';

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_USER = "username";
var STORAGE_KEY = "id_token";

class SearchNewScreen extends React.Component {
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

  async getUsername() {
    var username = await SInfo.getItem(STORAGE_USER, {});
    this.setState({ creator: username });
  }

  async getToken() {
    var token = await SInfo.getItem(STORAGE_KEY, {});
    this.setState({ userToken: token });
  }

  componentDidMount() {
    Vibration.vibrate();
    this.getUsername();
    this.getToken();
    this.setState({ name: this.props.navigation.state.params.newName });
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
    if (this.state.name !== "") {
      if (this.state.description !== "") {
        if (this.state.category !== "") {
          if (this.state.creator !== "") {
            if (this.state.location.lat !== null) {
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
              fetch("https://konjomeet.herokuapp.com/community", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                  "user-token": `${this.state.userToken}`
                },
                body: JSON.stringify(data)
              }).then(res => res.json())
                .then(res => {
                  this.props.navigation.push("Community", {
                    communityId: `${res._id}`, newcomm: true
                  });
                }).catch(error => {
                  AlertHelper.show('warn', 'Error', `${error.message}!`);
                });
              Vibration.vibrate();
              this.newClear();
            } else {
              Vibration.vibrate();
              AlertHelper.show('warn', 'Warning', "Please submit location to create.");
            }
          } else {
            Vibration.vibrate();
            AlertHelper.show('warn', 'Warning', "Please login to create.");
          }
        } else {
          Vibration.vibrate();
          AlertHelper.show('warn', 'Warning', "Please enter category to create.");
        }
      } else {
        Vibration.vibrate();
        AlertHelper.show('warn', 'Warning', "Please enter description to create.");
      }
    } else {
      Vibration.vibrate();
      AlertHelper.show('warn', 'Warning', "Please enter name to create.");
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <View>
              <AnimatableView
                animation="bounceInUp"
                delay={10}
                duration={1800}>
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
                      onSubmitEditing={() => { this.descInput.focus(); }} />
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
                      value={this.state.description} />
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
                      returnKeyType='send' />
                  </View>
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={this.handleSubmit}>
                      <Text style={styles.saveButtonText}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </AnimatableView>
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

export default SearchNewScreen;

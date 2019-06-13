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
import DatePicker from 'react-native-datepicker'
import { AlertHelper } from './AlertHelper';
import KeyboardSpacer from 'react-native-keyboard-spacer';

AnimatableView = Animatable.createAnimatableComponent(View);

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

class MeetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      location: "",
      date: "",
      time: "",
      creator: "",
      userToken: "",
      community: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.meetClear = this.meetClear.bind(this);
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
            onPress={() => navigation.push("NewHome")}>
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
            onPress={() => navigation.push("Search")}>
            <View>
              <Text
                style={{ fontSize: 25 }}>🔎</Text>
            </View>
          </TouchableOpacity>
        </AnimatableView>
      </View>
      )
    };
  }

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    this.setState({ creator: username });
  }

  async getToken() {
    var token = await AsyncStorage.getItem(STORAGE_KEY);
    this.setState({ userToken: token });
  }

  async componentDidMount() {
    Vibration.vibrate();
    await this.getToken();
    await this.getUsername();
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
        this.setState({ community: res });
      });
  }

  meetClear() {
    this.setState({
      name: "",
      description: "",
      location: "",
      date: "",
      time: ""
    });
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

  updateDateState() {
    console.log(this.state.date);
  }

  updateTimeState() {
    console.log(this.state.time);
  }

  handleDateChange(date) {
    console.log(date)
    this.setState({ date }, () => this.updateDateState())
  }

  handleTimeChange(time) {
    console.log(time)
    this.setState({ time }, () => this.updateTimeState())
  }

  handleSubmit() {
    if (this.state.name !== "") {
      if (this.state.description !== "") {
        if (this.state.location !== "") {
          if (this.state.date !== "") {
            if (this.state.time !== "") {
              if (this.state.creator !== "") {
                const data = {
                  meet: {
                    name: this.state.name,
                    description: this.state.description,
                    location: this.state.location,
                    date: this.state.date,
                    time: this.state.time,
                    creator: this.state.creator
                  }
                };
                fetch(`https://konjomeet.herokuapp.com/community/${
                  this.props.navigation.state.params.communityId
                  }/meet`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-type": "application/json",
                      "user-token": `${this.state.userToken}`
                    },
                    body: JSON.stringify(data)
                  }
                );
                this.props.navigation.push("Community", {
                  communityId: `${this.props.navigation.state.params.communityId}`, meet: true
                })
                this.meetClear();
              } else {
                Vibration.vibrate();
                AlertHelper.show('warn', 'Warning', "Please login to create.");
              }
            } else {
              Vibration.vibrate();
              AlertHelper.show('warn', 'Warning', "Please enter time to create.");
            }
          } else {
            Vibration.vibrate();
            AlertHelper.show('warn', 'Warning', "Please enter date to create.");
          }
        } else {
          Vibration.vibrate();
          AlertHelper.show('warn', 'Warning', "Please enter location to create.");
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
      <View style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <View>
              <AnimatableView
                animation="bounceInUp"
                delay={10}
                duration={1800}>
                <Card borderRadius={15}>
                  <Text style={styles.header}>New Meet</Text>
                  <Text style={styles.comm}>{this.state.community !== "" && this.state.community.name}</Text>
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
                      value={this.state.name}
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
                      value={this.state.description}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Location"
                      name="location"
                      id="location"
                      onChangeText={this.handleLocationChange}
                      blurOnSubmit={true}
                      ref={(input) => { this.locInput = input; }}
                      value={this.state.location}
                    />
                  </View>
                  <DatePicker
                    style={{ width: 300, paddingTop: 25 }}
                    date={this.state.date}
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderColor: "#CCCCCC",
                        borderWidth: 1,
                        height: 50,
                        placeholderText: 25,
                        dateText: 25,
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderRadius: 15
                      },
                      placeholderText: { fontSize: 25 },
                      dateText: { fontSize: 25 }
                    }}
                    mode="date"
                    placeholder="Select Date"
                    format="MMMM Do YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    ref={(input) => { this.dateInput = input; }}
                    onDateChange={(date) => this.handleDateChange(date)}
                  />
                  <DatePicker
                    style={{ width: 300, paddingTop: 25 }}
                    showIcon={false}
                    date={this.state.time}
                    customStyles={{
                      dateInput: {
                        borderColor: "#CCCCCC",
                        borderWidth: 1,
                        height: 50,
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderRadius: 15
                      },
                      placeholderText: { fontSize: 25 },
                      dateText: { fontSize: 25 }
                    }}
                    mode="time"
                    placeholder="Select Time"
                    format="h:mm A"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={(time) => this.handleTimeChange(time)}
                  />
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={this.handleSubmit}
                    >
                      <Text style={styles.saveButtonText}>Create Meet</Text>
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
    paddingTop: 5
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 10
  },
  comm: {
    textAlign: "center",
    fontSize: 15
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

export default MeetScreen;

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Vibration,
  ScrollView
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import * as Animatable from 'react-native-animatable';
import LogoTitle from "./LogoTitle"

AnimatableView = Animatable.createAnimatableComponent(View);

var STORAGE_KEY = "id_token";
var STORAGE_USER = "username";

class HomeScreen extends React.Component {

  componentDidMount() {
    Vibration.vibrate();
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerLeft: null
  };

  async userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(STORAGE_USER);
      console.log("Logout Success! ✅")
      Vibration.vibrate();
      this.props.navigation.push("Login")
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  }

  render() {
    return (
      <ScrollView>
        <Text
          style={{ fontSize: 35, textAlign: "center", padding: 10 }}>
          Beautiful Communities
        </Text>
        <Card borderRadius={15}>
          <AnimatableView
            animation="bounceInLeft"
            delay={10}
            duration={1500}>
            <TouchableOpacity
              style={styles.communitiesButton}
              onPress={() => this.props.navigation.push("Communities")}>
              <Text style={styles.communitiesButtonText}>All Communities 👥</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={30}
            duration={1500}>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => this.props.navigation.push("New")}>
              <Text style={styles.newButtonText}>New Community ➕</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={50}
            duration={1500}>
            <TouchableOpacity
              style={styles.myCommunitiesButton}
              onPress={() => this.props.navigation.push("Profile")}>
              <Text style={styles.myCommunitiesButtonText}>Profile 👤</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={70}
            duration={1500}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.props.navigation.push("Search")}>
              <Text style={styles.searchButtonText}>Search 🔍</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={90}
            duration={1500}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => this.props.navigation.push("Map")}>
              <Text style={styles.mapButtonText}>Map 🗺</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={110}
            duration={1500}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => this.userLogout()}>
              <Text style={styles.logoutButtonText}>Logout ➡🚪</Text>
            </TouchableOpacity>
          </AnimatableView>
          <AnimatableView
            animation="bounceInLeft"
            delay={130}
            duration={1500}>
            <TouchableOpacity
              style={styles.newHomeButton}
              onPress={() => this.props.navigation.push("NewHome")}>
              <Text style={styles.newHomeButtonText}>New Home 🆕🏠</Text>
            </TouchableOpacity>
          </AnimatableView>
        </Card>
      </ScrollView>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  communitiesButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communitiesButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  newButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  newButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  myCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  myCommunitiesButtonText: {
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
  searchButton: {
    borderWidth: 1,
    borderColor: "#E0118A",
    backgroundColor: "#E0118A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  mapButton: {
    borderWidth: 1,
    borderColor: "#752794",
    backgroundColor: "#752794",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  newHomeButton: {
    borderWidth: 1,
    borderColor: "#B8E35D",
    backgroundColor: "#B8E35D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  newHomeButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  }
});


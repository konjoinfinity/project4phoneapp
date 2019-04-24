import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Vibration,
  Button,
  ScrollView
} from "react-native";
import { Card } from "react-native-elements";
import Nav from "./Nav"

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

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: false
    };
    this.openCloseNav = this.openCloseNav.bind(this);
  }

  componentDidMount() {
    Vibration.vibrate();
    this.props.navigation.setParams({
      openCloseNav: this.openCloseNav
    });
  }

  openCloseNav() {
    if (this.state.nav === false) {
      this.setState({ nav: true });
    } else {
      this.setState({ nav: false });
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerLeft: (<Button
        title="="
        onPress={navigation.getParam('openCloseNav')}
      ></Button>
      )
    };
  }

  render() {
    return (
      <ScrollView>
        {this.state.nav === true && <Nav />}
        <Text style={{ fontSize: 40, textAlign: "center", padding: 15 }}>
          Beautiful Communities
        </Text>
        <Card borderRadius={15}>
          <TouchableOpacity
            style={styles.communitiesButton}
            onPress={() => this.props.navigation.navigate("Communities")}
          >
            <Text style={styles.communitiesButtonText}>All Communities 👥</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => this.props.navigation.navigate("New")}
          >
            <Text style={styles.newButtonText}>New Community ➕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myCommunitiesButton}
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Text style={styles.myCommunitiesButtonText}>Profile 👤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => this.props.navigation.navigate("Search")}
          >
            <Text style={styles.searchButtonText}>Search 🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login 🔑</Text>
          </TouchableOpacity>
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
  searchButton: {
    borderWidth: 1,
    borderColor: "#FFE713",
    backgroundColor: "#FFE713",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#E0118A",
    backgroundColor: "#E0118A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  }
});


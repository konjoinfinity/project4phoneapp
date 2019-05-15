import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Nav from "./Nav"

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

class MyCommunitiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: "",
      creator: "",
      nav: false,
      userToken: ""
    };
    this.openCloseNav = this.openCloseNav.bind(this);
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

  async componentDidMount() {
    await this.getToken();
    await fetch("https://konjomeet.herokuapp.com/community", {
      method: "GET",
      headers: {
        "user-token": `${this.state.userToken}`
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
    Vibration.vibrate();
    this.getUsername();
    this.props.navigation.setParams({
      openCloseNav: this.openCloseNav
    });
  }

  openCloseNav() {
    if (this.state.nav === false) {
      this.setState({ nav: true });
      this.scrolltop.scrollTo({ x: 0, y: 0, animated: true })
      Vibration.vibrate();
    } else {
      this.setState({ nav: false });
      Vibration.vibrate();
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerLeft: (<TouchableOpacity
        onPress={navigation.getParam('openCloseNav')}>
        <View>
          <Image
            source={require("./menu.png")}
            style={{ width: 30, height: 30, marginLeft: 10 }} />
        </View>
      </TouchableOpacity>
      )
    };
  }

  render() {
    let mycommunities;
    this.state.communities &&
      (mycommunities = this.state.communities.filter(
        community => community.creator === this.state.creator
      ));
    let mine;
    this.state.communities &&
      (mine = mycommunities.map((community, id) => {
        return (
          <Card borderRadius={15} key={id}>
            <TouchableOpacity
              style={styles.communityButton}
              onPress={() =>
                this.props.navigation.push("Community", {
                  communityId: `${community._id}`
                })
              }
            >
              <Text style={styles.communityButtonText}>{community.name}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
              {community.description}
            </Text>
            <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
              Members: {community.numberOfMembers}
            </Text>
            <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
              Creator: {community.creator}
            </Text>
          </Card>
        );
      }));
    return (
      <View style={styles.communities}>
        <ScrollView ref={(ref) => { this.scrolltop = ref; }}>
          {this.state.nav === true && <Nav navigation={this.props.navigation} />}
          <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
            My Communities
          </Text>
          {mine}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  communityButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communityButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  communities: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default MyCommunitiesScreen;

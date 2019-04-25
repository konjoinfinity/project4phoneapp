import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Button,
  TouchableHighlight
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Nav from "./Nav"

var STORAGE_USER = "username";

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

class JoinedCommunitiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: "",
      creator: "",
      nav: false
    };
    this.openCloseNav = this.openCloseNav.bind(this);
    this.getCommunities = this.getCommunities.bind(this);
  }

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    console.log(username);
    this.setState({ creator: username });
  }

  componentDidMount() {
    fetch("https://konjomeet.herokuapp.com/community")
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
    } else {
      this.setState({ nav: false });
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerLeft: (<TouchableHighlight
        onPress={navigation.getParam('openCloseNav')}>
        <Image
          source={require("./menu.png")}
          style={{ width: 30, height: 30, marginLeft: 10 }} />
      </TouchableHighlight>
      )
    };
  }

  getCommunities() {
    fetch("https://konjomeet.herokuapp.com/community")
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
  }

  render() {
    let joinedcommunities;
    this.state.communities &&
      (joinedcommunities = this.state.communities.filter(community =>
        community.members.some(member => member.name === this.state.creator)
      ));
    let joined;
    this.state.communities &&
      (joined = joinedcommunities.map((community, id) => {
        return (
          <Card borderRadius={15} key={id}>
            <TouchableOpacity
              style={styles.communityButton}
              onPress={() =>
                this.props.navigation.navigate("Community", {
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
        <ScrollView>
          {this.state.nav === true && <Nav navigation={this.props.navigation} />}
          <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
            Joined Communities
          </Text>
          {joined}
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

export default JoinedCommunitiesScreen;

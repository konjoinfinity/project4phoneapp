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


class CommunitiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: ""
    };
    this.getCommunities = this.getCommunities.bind(this);
  }

  componentDidMount() {
    fetch("https://konjomeet.herokuapp.com/community")
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
    Vibration.vibrate();
  }

  getCommunities() {
    fetch("https://konjomeet.herokuapp.com/community")
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
  }

  render() {
    let communities;
    this.state.communities &&
      (communities = this.state.communities.map((community, id) => {
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
      <ScrollView>
        <View style={{
          borderBottomWidth: 1,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          padding: 15,
          borderColor: "#DAD5D5"
        }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                source={require("./logo.png")}
                style={{ width: 60, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.communities}>
          <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
            Communities
          </Text>
          {communities}
        </View>
      </ScrollView>
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

export default CommunitiesScreen;

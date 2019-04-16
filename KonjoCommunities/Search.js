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

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: "",
      search: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("https://konjomeet.herokuapp.com/community")
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
    Vibration.vibrate();
  }

  handleChange(search) {
    this.setState({ search });
  }

  render() {
    let communitySearch;
    this.state.communities && (communitySearch = this.state.communities);
    let search = this.state.search.trim().toLowerCase();

    this.state.communities && console.log(search);

    if (search.length > 0) {
      this.state.communities &&
        (communitySearch = communitySearch.filter(function(community) {
          return community.name.toLowerCase().match(search);
        }));
    }

    let results;
    this.state.communities &&
      (results = communitySearch.map((community, id) => {
        return (
          this.state.search !== "" && (
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
              <Text style={{ fontSize: 10, textAlign: "center", padding: 5 }}>
                Members: {community.numberOfMembers}
              </Text>
              <Text style={{ fontSize: 10, textAlign: "center", padding: 5 }}>
                Creator: {community.creator}
              </Text>
            </Card>
          )
        );
      }));
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <View>
            <Card borderRadius={15}>
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
              <Text style={styles.header}>Search Communities</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Search Communities"
                  name="search"
                  id="search"
                  onBlur={Keyboard.dismiss}
                  onChangeText={this.handleChange}
                />
              </View>
            </Card>
          </View>
          {results}
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

export default SearchScreen;

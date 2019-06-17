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
import Nav from "./Nav"
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import LogoTitle from "./LogoTitle"

AnimatableView = Animatable.createAnimatableComponent(View);

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: "",
      search: "",
      nav: false
    };
    this.openCloseNav = this.openCloseNav.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("https://konjomeet.herokuapp.com/community/search")
      .then(res => res.json())
      .then(res => {
        this.setState({ communities: res });
      });
    Vibration.vibrate();
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

  handleChange(search) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ search });
  }

  render() {
    let communitySearch;
    this.state.communities && (communitySearch = this.state.communities);
    let search;
    this.state.communities && (
      (search = this.state.search.trim().toLowerCase()))

    this.state.communities &&
      search.length > 0 && (
        (communitySearch = communitySearch.filter(function (community) {
          return community.name.toLowerCase().match(search);
        }))
      )

    let results;
    this.state.communities &&
      (results = communitySearch.map((community, id) => {
        return (
          this.state.search !== "" && (
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
          )
        );
      }));
    let newsearch;
    this.state.communities && (
      newsearch =
      this.state.search !== "" &&
      (results.length === 0 && (
        <Card borderRadius={15}>
          <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
            Create a New Community
          </Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() =>
              this.props.navigation.push("SearchNew", {
                newName: this.state.search
              })
            }
          >
            <Text style={styles.newButtonText}>{this.state.search} ➕</Text>
          </TouchableOpacity>
        </Card>
      )));
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView ref={(ref) => { this.scrolltop = ref; }}>
          {this.state.nav === true && <Nav navigation={this.props.navigation} />}
          <View>
            <AnimatableView
              animation="bounceInUp"
              delay={10}
              duration={1800}>
              <Card borderRadius={15}>
                <Text style={styles.header}>Search Communities</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Search Communities"
                    name="search"
                    id="search"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleChange}
                    autoFocus={true}
                  />
                </View>
              </Card>
            </AnimatableView>
          </View>
          {results}
          {newsearch}
        </ScrollView>
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
  }
});

export default SearchScreen;

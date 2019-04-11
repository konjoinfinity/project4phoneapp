import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          style={{ height: 100, width: 200 }}
          source={require("./logo.png")}
        />
        <Text style={{ fontSize: 50, textAlign: "center" }}>
          Beautiful Communities
        </Text>
        <TouchableOpacity
          style={styles.communitiesButton}
          onPress={() => this.props.navigation.navigate("Communities")}
        >
          <Text style={styles.communitiesButtonText}>View Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => this.props.navigation.navigate("New")}
        >
          <Text style={styles.newButtonText}>New Community</Text>
        </TouchableOpacity>
      </View>
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
  }
});

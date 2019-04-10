import React from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-elements";

class HomeScreen extends React.Component {
  render() {
    return (
      <Card>
        <View>
          <Text style={{ fontSize: 50, justifyContent: "center", padding: 20 }}>
            Home
          </Text>
        </View>
      </Card>
    );
  }
}

export default HomeScreen;

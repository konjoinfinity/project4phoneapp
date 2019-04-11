import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./Home";
// import CommunitiesScreen from "./Communites";
// import CommunityScreen from "./Community";
import NewScreen from "./New";
// import EditScreen from "./Edit";

const Project = createStackNavigator(
  {
    Home: HomeScreen,
    // Communities: CommunitiesScreen,
    // Community: CommunityScreen,
    New: NewScreen
    // Edit: EditScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(Project);

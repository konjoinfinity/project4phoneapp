import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./Home";
import CommunitiesScreen from "./Communities";
import CommunityScreen from "./Community";
import NewScreen from "./New";
import EditScreen from "./Edit";
import MeetScreen from "./Meet";

const Project = createStackNavigator(
  {
    Home: HomeScreen,
    Communities: CommunitiesScreen,
    Community: CommunityScreen,
    New: NewScreen,
    Edit: EditScreen,
    Meet: MeetScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(Project);

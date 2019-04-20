import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./Home";
import CommunitiesScreen from "./Communities";
import CommunityScreen from "./Community";
import NewScreen from "./New";
import EditScreen from "./Edit";
import MeetScreen from "./Meet";
import MyCommunitiesScreen from "./MyCommunities";
import JoinedCommunitiesScreen from "./JoinedCommunities";
import SearchScreen from "./Search";
import LoginScreen from "./Login";
import SearchNewScreen from "./SearchNew";

const Project = createStackNavigator(
  {
    Home: HomeScreen,
    Communities: CommunitiesScreen,
    Community: CommunityScreen,
    New: NewScreen,
    Edit: EditScreen,
    Meet: MeetScreen,
    MyCommunities: MyCommunitiesScreen,
    JoinedCommunities: JoinedCommunitiesScreen,
    Search: SearchScreen,
    Login: LoginScreen,
    SearchNew: SearchNewScreen
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(Project);

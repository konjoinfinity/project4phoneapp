import React, { Component } from "react";
import { createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
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
import AuthLoadingScreen from "./AuthLoading"
import ProfileScreen from "./Profile";
import MapScreen from "./Map"
import GrowCommunitiesScreen from "./GrowCommunities";
import SignupScreen from "./Signup";

const AppStack = createStackNavigator(
  {
    Communities: CommunitiesScreen,
    Community: CommunityScreen,
    New: NewScreen,
    Edit: EditScreen,
    Meet: MeetScreen,
    MyCommunities: MyCommunitiesScreen,
    JoinedCommunities: JoinedCommunitiesScreen,
    Search: SearchScreen,
    Login: LoginScreen,
    SearchNew: SearchNewScreen,
    Profile: ProfileScreen,
    Home: HomeScreen,
    Map: MapScreen,
    GrowCommunities: GrowCommunitiesScreen,
    Signup: SignupScreen
  },
  {
    initialRouteName: 'Home',
  }
);

// const AppStack = createDrawerNavigator(
//   {
//     Home: HomeScreen,
//     Communities: CommunitiesScreen,
//     Community: {
//       screen: CommunityScreen,
//       navigationOptions: {
//         drawerLabel: () => null,
//       }
//     },
//     New: NewScreen,
//     Edit: {
//       screen: EditScreen,
//       navigationOptions: {
//         drawerLabel: () => null,
//       }
//     },
//     Meet: {
//       screen: MeetScreen,
//       navigationOptions: {
//         drawerLabel: () => null,
//       }
//     },
//     MyCommunities: MyCommunitiesScreen,
//     JoinedCommunities: JoinedCommunitiesScreen,
//     Search: SearchScreen,
//     Login: LoginScreen,
//     Map: MapScreen,
//     SearchNew: {
//       screen: SearchNewScreen,
//       navigationOptions: {
//         drawerLabel: () => null,
//       }
//     },
//     // Nav: {
//     //   screen: Nav,
//     //   navigationOptions: {
//     //     drawerLabel: () => null,
//     //   }
//     // },
//     Profile: ProfileScreen,
//   },
//   {
//     initialRouteName: 'Home',
//   }
// );

const AuthStack = createStackNavigator({ Login: LoginScreen },
  {
    initialRouteName: 'Login',
  });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));



import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from "react-navigation";
import CommunitiesScreen from "./Communities";
import CommunityScreen from "./Community";
import NewScreen from "./New";
import EditScreen from "./Edit";
import MeetScreen from "./Meet";
import MyCommunitiesScreen from "./MyCommunities";
import JoinedCommunitiesScreen from "./JoinedCommunities";
import LoginScreen from "./Login";
import SearchNewScreen from "./SearchNew";
import AuthLoadingScreen from "./AuthLoading"
import ProfileScreen from "./Profile";
import MapScreen from "./Map"
import GrowCommunitiesScreen from "./GrowCommunities";
import SignupScreen from "./Signup";
import CommMapScreen from "./CommMap";
import HomeScreen from "./Home"
import ChangePassScreen from "./ChangePass";
import { AlertHelper } from "./AlertHelper";
import EditMeetScreen from "./EditMeet";
import klogo from "./klogo.png"
import { TouchableOpacity, Dimensions, View, Text } from 'react-native';


// const AppStack = createStackNavigator(
//   {
//     Communities: CommunitiesScreen,
//     Community: CommunityScreen,
//     New: NewScreen,
//     Edit: EditScreen,
//     Meet: MeetScreen,
//     MyCommunities: MyCommunitiesScreen,
//     JoinedCommunities: JoinedCommunitiesScreen,
//     Login: LoginScreen,
//     SearchNew: SearchNewScreen,
//     Profile: ProfileScreen,
//     Map: MapScreen,
//     GrowCommunities: GrowCommunitiesScreen,
//     Signup: SignupScreen,
//     CommMap: CommMapScreen,
//     Home: HomeScreen,
//     ChangePass: ChangePassScreen,
//     Helper: AlertHelper,
//     EditMeet: EditMeetScreen
//   },
//   {
//     initialRouteName: 'Home',
//     defaultNavigationOptions: {
//       gesturesEnabled: false
//     }
//   }
// );

const AppStack = createStackNavigator({
  MyTab: {
    screen: createMaterialTopTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Text>🏠</Text><Text style={{ fontSize: 10, color: tintColor }}>Home</Text></View>)
          },
        },
        Communities: {
          screen: CommunitiesScreen,
          navigationOptions: {
            tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Text>🌞</Text><Text style={{ fontSize: 10, color: tintColor }}>Konjos</Text></View>)
          },
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Text>👤</Text><Text style={{ fontSize: 10, color: tintColor }}>Profile</Text></View>)

          },
        },
        Map: {
          screen: MapScreen,
          navigationOptions: {
            tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Text>🗺</Text><Text style={{ fontSize: 10, color: tintColor }}>Map</Text></View>)
          },
        },

      },
      {
        tabBarOptions: {
          style: { backgroundColor: '#ffffff', borderTopWidth: 0.5, borderTopColor: "#e0e0e0" },
          indicatorStyle: { backgroundColor: "#4db6ac" },
          labelStyle: { margin: 0, padding: 0, paddingBottom: 0 },
          activeTintColor: "gray", inactiveTintColor: '#ffffff', upperCaseLabel: false, showLabel: true, showIcon: false,
          tabStyle: { height: Dimensions.get('window').height * 0.088, width: Dimensions.get('window').width * 0.25 }
        },
        tabBarPosition: 'bottom',
        swipeEnabled: false
      }
    ),
    navigationOptions: ({ navigation }) => ({
      title: `Konjo`,
      headerStyle: { backgroundColor: '#80cbc4', height: Dimensions.get('window').height * 0.066 },
      headerTitleStyle: {
        color: "#ffffff", fontSize: 25, fontWeight: '400',
        paddingTop: 0
      },
      headerRight: (<View style={{ flexDirection: "row", paddingRight: 10 }}>
        <TouchableOpacity accessibilityLabel="infobutton" style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 15, borderRadius: 50, padding: 2, backgroundColor: "#009688", shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } }} onPress={() => navigation.push("MyCommunities")}>
          <Text> ✅</Text></TouchableOpacity>
        <TouchableOpacity accessibilityLabel="logout" style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 15, borderRadius: 50, padding: 2, backgroundColor: "#009688", shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } }} onPress={() => navigation.push("GrowCommunities")}>
          <Text> ➡️</Text></TouchableOpacity></View>),
      headerLeft: (<View style={{ flexDirection: "row", paddingRight: 10 }}>
        <TouchableOpacity accessibilityLabel="joined" style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 15, borderRadius: 50, padding: 2, backgroundColor: "#009688", shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } }} onPress={() => navigation.push("JoinedCommunities")}>
          <Text> 👥</Text></TouchableOpacity>
        <TouchableOpacity accessibilityLabel="growing" style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 15, borderRadius: 50, padding: 2, backgroundColor: "#009688", shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } }} onPress={() => navigation.push("GrowCommunities")}>
          <Text> 🗣</Text></TouchableOpacity></View>)
    })
  },
  MyCommunities: MyCommunitiesScreen,
  JoinedCommunities: JoinedCommunitiesScreen,
  GrowCommunities: GrowCommunitiesScreen,
}, { headerLayoutPreset: 'center' })

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
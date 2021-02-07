import { createSwitchNavigator, createStackNavigator, createAppContainer } from "react-navigation";
<<<<<<< HEAD
import { ScreenContainer } from 'react-native-screens';
=======
>>>>>>> parent of d0823e7... updated bottom nav and header nav, need to fix extra nav screens
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

const AppStack = createStackNavigator(
  {
    Communities: CommunitiesScreen,
    Community: CommunityScreen,
    New: NewScreen,
    Edit: EditScreen,
    Meet: MeetScreen,
    MyCommunities: MyCommunitiesScreen,
    JoinedCommunities: JoinedCommunitiesScreen,
    Login: LoginScreen,
    SearchNew: SearchNewScreen,
    Profile: ProfileScreen,
    Map: MapScreen,
    GrowCommunities: GrowCommunitiesScreen,
    Signup: SignupScreen,
    CommMap: CommMapScreen,
    Home: HomeScreen,
    ChangePass: ChangePassScreen,
    Helper: AlertHelper,
    EditMeet: EditMeetScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

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



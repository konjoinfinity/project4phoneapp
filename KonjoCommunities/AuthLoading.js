import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import SInfo from 'react-native-sensitive-info';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    bootstrapAsync = async () => {
        const userToken = await SInfo.getItem('id_token', {});
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen;
import React from 'react';
import {
    Image,
    View
} from 'react-native';
import SInfo from 'react-native-sensitive-info';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    bootstrapAsync = async () => {
        const userToken = await SInfo.getItem('id_token', {});
        setTimeout(() => {
            this.props.navigation.navigate(userToken ? 'App' : 'Auth');
        }, 1500);
    };

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#42A163"
            }}>
                <Image
                    source={require("./logo.png")}
                    style={{ width: 275, height: 150 }} />
            </View>
        );
    }
}

export default AuthLoadingScreen;
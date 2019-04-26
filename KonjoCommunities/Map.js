import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require("./logo.png")}
                style={{ width: 60, height: 30 }}
            />
        );
    }
}

class MapScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            error: null
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
                console.log(position)
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    static navigationOptions = {
        headerTitle: <LogoTitle />
    };

    render() {
        const LatLng = {
            latitude: this.state.latitude,
            longitude: this.state.longitude
        }
        return (
            <View style={styles.container}>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    {this.state.latitude &&
                        <Marker
                            coordinate={LatLng}
                            title="Test"
                            description="This is a test"
                        />}
                </MapView>
            </View>

        );
    }
}

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

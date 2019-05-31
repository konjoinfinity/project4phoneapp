import React, { Component } from 'react';
import { View, Image, StyleSheet, Vibration, TouchableOpacity, Text, TextInput } from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as geolib from 'geolib';
// import AsyncStorage from "@react-native-community/async-storage";

// var STORAGE_KEY = "id_token";

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
            error: null,
            communities: "",
            coord: ""
        };
        this.iAmHere = this.iAmHere.bind(this);
        this.coordValue = this.coordValue.bind(this);
    }

    // async getToken() {
    //     var token = await AsyncStorage.getItem(STORAGE_KEY);
    //     console.log(token);
    //     this.setState({ userToken: token });
    // }

    componentDidMount() {
        // await this.getToken();
        // switch to http://localhost:4000/community for dev
        // https://konjomeet.herokuapp.com/community for production
        fetch("https://konjomeet.herokuapp.com/community/search")
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            });
        Vibration.vibrate();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        )
        this.iAmHere();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Home")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🏠</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Profile")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>👤</Text>
                    </View>
                </TouchableOpacity>
            </View>
            ),
            headerRight: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("New")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>➕</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("Search")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>🔎</Text>
                    </View>
                </TouchableOpacity>
            </View>
            )
        };
    }

    iAmHere() {
        const coords = []
        setTimeout(() => {
            this.state.communities !== "" && this.state.communities.map(community => {
                latlong = {
                    latitude: community.location.lat,
                    longitude: community.location.long
                };
                coords.push(latlong)
            })
            const coord = geolib.findNearest({ latitude: this.state.latitude, longitude: this.state.longitude }, coords);
            this.coordValue(coord)
        }, 1000);
    }

    coordValue(value) {
        setTimeout(() => {
            this.setState({ coord: value })
        }, 1000);
        setTimeout(() => {
            this.marker.showCallout()
        }, 3000);
    }

    render() {
        let commcoords;
        this.state.communities &&
            (commcoords = this.state.communities.map((community, id) => {
                let commlatlong;
                commlatlong = {
                    latitude: community.location.lat,
                    longitude: community.location.long
                };

                return (
                    <Marker
                        key={id}
                        coordinate={commlatlong}
                        title={community.name}
                        ref={community.location.lat === this.state.coord.latitude ? marker => (this.marker = marker) : React.createRef()}
                        onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${community._id}` })}>
                        <Callout>
                            <TouchableOpacity
                                style={styles.communityButton}>
                                <Text style={styles.communityButtonText}>{community.name}</Text>
                            </TouchableOpacity>
                        </Callout>
                    </Marker>
                )
            }))
        return (
            <View style={styles.container}>
                {this.state.latitude &&
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            //replace with this.state.latitude, this.state.longitude, for production
                            //dev - latitude: 38.875917, longitude: -77.122655
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.1011,
                            longitudeDelta: 0.1011,

                        }}>
                        {commcoords}
                    </MapView>}
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
    communityButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 5,
        borderRadius: 15
    },
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    headerButton: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
});

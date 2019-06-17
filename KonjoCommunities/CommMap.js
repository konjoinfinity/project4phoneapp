import React, { Component } from 'react';
import { View, Image, StyleSheet, Vibration, TouchableOpacity, Text } from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import LogoTitle from "./LogoTitle"

class CommMapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            community: ""
        };
    }

    componentDidMount() {
        fetch(`https://konjomeet.herokuapp.com/community/${
            this.props.navigation.state.params.communityId
            }/map`)
            .then(res => res.json())
            .then(res => {
                this.setState({ community: res });
            });
        Vibration.vibrate();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.push("NewHome")}>
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
        setTimeout(() => {
            this.marker.showCallout()
        }, 2500);
    }
    render() {
        this.state.community !== "" && (
            this.iAmHere()
        )
        return (
            <View style={styles.container}>
                {this.state.community !== "" &&
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: this.state.community.location.lat,
                            longitude: this.state.community.location.long,
                            latitudeDelta: 0.0511,
                            longitudeDelta: 0.0511
                        }}>
                        <Marker
                            coordinate={{
                                latitude: this.state.community.location.lat,
                                longitude: this.state.community.location.long
                            }}
                            title={this.state.community.name}
                            ref={marker => (this.marker = marker)}
                            onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${this.state.community._id}` })}>
                            <Callout>
                                <TouchableOpacity
                                    style={styles.communityButton}>
                                    <Text style={styles.communityButtonText}>{this.state.community.name}</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    </MapView>}
            </View>

        );
    }
}

export default CommMapScreen;

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
        padding: 15,
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

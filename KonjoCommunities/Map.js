import React, { Component } from 'react';
import { View, StyleSheet, Vibration, TouchableOpacity, Text, Button } from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as geolib from 'geolib';
import LogoTitle from "./LogoTitle"
import { AlertHelper } from './AlertHelper';
import SInfo from 'react-native-sensitive-info';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            error: null,
            communities: "",
            coord: "",
            joined: false,
            growing: false,
            mine: false,
            all: true,
            creator: "",
            userToken: ""
        };
        this.closestCommunity = this.closestCommunity.bind(this);
        this.showJoined = this.showJoined.bind(this);
        this.showMine = this.showMine.bind(this);
        this.showGrowing = this.showGrowing.bind(this);
        this.showAll = this.showAll.bind(this);
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
                    onPress={() => navigation.push("Communities")}>
                    <View>
                        <Text
                            style={{ fontSize: 25 }}>👥</Text>
                    </View>
                </TouchableOpacity>
            </View>
            )
        };
    }

    async getToken() {
        const token = await SInfo.getItem(STORAGE_KEY, {});
        this.setState({ userToken: token });
        const username = await SInfo.getItem(STORAGE_USER, {});
        this.setState({ creator: username });
    }

    async componentDidMount() {
        const token = await SInfo.getItem(STORAGE_KEY, {});
        this.getToken();
        await fetch("https://konjomeet.herokuapp.com/community", {
            method: "GET",
            headers: {
                "user-token": `${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ communities: res });
            }).catch(error => {
                AlertHelper.show('warn', 'Error', `${error.message}!`);
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
        setTimeout(() => {
            this.state.communities !== "" && (
                this.state.all === true && (
                    this.closestCommunity(this.state.communities)))
        }, 1000);
    }

    showJoined() {
        Vibration.vibrate();
        this.setState({
            joined: true,
            mine: false,
            growing: false,
            all: false
        })
        let joinedcommunities = this.state.communities.filter(community =>
            community.members.some(member => member.name === this.state.creator)
        );
        this.closestCommunity(joinedcommunities)
    }

    showMine() {
        Vibration.vibrate();
        this.setState({
            joined: false,
            mine: true,
            growing: false,
            all: false
        })
        let mycommunities = this.state.communities.filter(
            community => community.creator === this.state.creator
        );
        this.closestCommunity(mycommunities)
    }

    showGrowing() {
        Vibration.vibrate();
        this.setState({
            joined: false,
            mine: false,
            growing: true,
            all: false
        })
        let growcommunities = this.state.communities.filter(
            community => community.numberOfMembers < 3
        );
        this.closestCommunity(growcommunities)
    }

    showAll() {
        Vibration.vibrate();
        this.setState({
            joined: false,
            mine: false,
            growing: false,
            all: true
        })
        this.closestCommunity(this.state.communities)
    }

    closestCommunity(communities) {
        const coords = []
        this.state.communities !== "" && communities.map(community => {
            latlong = {
                latitude: community.location.lat,
                longitude: community.location.long
            };
            coords.push(latlong)
        })
        let value;
        coords !== [] && (
            value = geolib.findNearest({ latitude: this.state.latitude, longitude: this.state.longitude }, coords))
        setTimeout(() => {
            value !== undefined &&
                this.setState({ coord: value })
        }, 2000);
        setTimeout(() => {
            this.state.coord !== "" &&
                this.marker.showCallout()
        }, 3000);
    }

    render() {
        let joinedcommunities;
        this.state.communities && (
            this.state.joined === true && (
                (joinedcommunities = this.state.communities.filter(community =>
                    community.members.some(member => member.name === this.state.creator)
                ))));
        let joined;
        this.state.communities && (
            this.state.joined === true && (
                (joined = joinedcommunities.map((community, id) => {
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
                            pinColor={"#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6)}
                            ref={community.location.lat === this.state.coord.latitude ? marker => (this.marker = marker) : React.createRef()}
                            onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${community._id}` })}>
                            <Callout>
                                <TouchableOpacity
                                    style={styles.communityButton}>
                                    <Text style={styles.communityButtonText}>{community.name}</Text>
                                    <Text style={styles.membersText}>Members: {community.numberOfMembers}</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    );
                }))));
        let mycommunities;
        this.state.communities && (
            this.state.mine === true && (
                (mycommunities = this.state.communities.filter(
                    community => community.creator === this.state.creator
                ))));
        let mine;
        this.state.communities && (
            this.state.mine === true && (
                (mine = mycommunities.map((community, id) => {
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
                            pinColor={"#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6)}
                            ref={community.location.lat === this.state.coord.latitude ? marker => (this.marker = marker) : React.createRef()}
                            onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${community._id}` })}>
                            <Callout>
                                <TouchableOpacity
                                    style={styles.communityButton}>
                                    <Text style={styles.communityButtonText}>{community.name}</Text>
                                    <Text style={styles.membersText}>Members: {community.numberOfMembers}</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    );
                }))));
        let growcommunities;
        this.state.communities && (
            this.state.growing === true && (
                (growcommunities = this.state.communities.filter(
                    community => community.numberOfMembers < 3
                ))));
        let growing;
        this.state.communities && (
            this.state.growing === true && (
                (growing = growcommunities.map((community, id) => {
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
                            pinColor={"#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6)}
                            ref={community.location.lat === this.state.coord.latitude ? marker => (this.marker = marker) : React.createRef()}
                            onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${community._id}` })}>
                            <Callout>
                                <TouchableOpacity
                                    style={styles.communityButton}>
                                    <Text style={styles.communityButtonText}>{community.name}</Text>
                                    <Text style={styles.membersText}>Members: {community.numberOfMembers}</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    );
                }))));
        let commcoords;
        this.state.communities && (
            this.state.all === true && (
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
                            pinColor={"#" + ("000" + (Math.random() * (1 << 24) | 0).toString(16)).substr(-6)}
                            ref={community.location.lat === this.state.coord.latitude ? marker => (this.marker = marker) : React.createRef()}
                            onCalloutPress={() => this.props.navigation.push("Community", { communityId: `${community._id}` })}>
                            <Callout>
                                <TouchableOpacity
                                    style={styles.communityButton}>
                                    <Text style={styles.communityButtonText}>{community.name}</Text>
                                    <Text style={styles.membersText}>Members: {community.numberOfMembers}</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    )
                }))))
        return (
            <View style={styles.container}>
                {this.state.latitude &&
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            //dev - latitude: 38.875917, longitude: -77.122655, prod - this.state.latitude/longitude
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.1011,
                            longitudeDelta: 0.1011
                        }}>
                        {joined}{commcoords}{mine}{growing}
                    </MapView>}
                <View
                    style={{
                        position: 'absolute',
                        top: '90%',
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                    <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.showJoined()}>
                        <Text style={styles.communityButtonText}>Joined</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.showMine()}>
                        <Text style={styles.communityButtonText}>Mine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.showGrowing()}>
                        <Text style={styles.communityButtonText}>Growing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButtons}
                        onPress={() => this.showAll()}>
                        <Text style={styles.communityButtonText}>All</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 10,
        borderRadius: 15
    },
    communityButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    membersText: {
        color: "#FFFFFF",
        fontSize: 17,
        textAlign: "center",
        paddingTop: 5
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
    },
    filterButtons: {
        borderWidth: 1,
        borderColor: "#007BFF",
        backgroundColor: "#007BFF",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
});

import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Vibration,
    KeyboardAvoidingView,
    DatePickerIOS,
    Alert
} from "react-native";
import { Card } from "react-native-elements";
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/MaterialIcons'

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

class DateTimeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            time: ""
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static navigationOptions = {
        headerTitle: <LogoTitle />
    };

    handleSubmit() {
        Alert.alert("Date: " + this.state.date,
            "Time: " + this.state.time)
    }

    updateDateState() {
        console.log(this.state.date);
    }

    updateTimeState() {
        console.log(this.state.time);
    }

    handleDateChange(date) {
        console.log(date)
        this.setState({ date }, () => this.updateDateState())
    }

    handleTimeChange(time) {
        console.log(time)
        this.setState({ time }, () => this.updateTimeState())
    }

    render() {
        return (
            <ScrollView>
                <Card borderRadius={15}>
                    <DatePicker
                        style={{ width: 300 }}
                        date={this.state.date}
                        mode="date"
                        placeholder="Select Date"
                        format="MMMM Do YYYY"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => this.handleDateChange(date)}
                    />
                    <DatePicker
                        style={{ width: 300 }}
                        iconComponent={
                            <Icon
                                size={30}
                                color='#333333'
                                name='access-time'
                            />
                        }
                        date={this.state.time}
                        mode="time"
                        placeholder="Select Time"
                        format="h:mm A"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            iconComponent: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(time) => this.handleTimeChange(time)}
                    />
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.saveButtonText}>Submit Date and Time 📅🕑</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        )
    }
}

export default DateTimeScreen;


const styles = StyleSheet.create({
    saveButton: {
        borderWidth: 1,
        borderColor: "#12C16D",
        backgroundColor: "#12C16D",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    }

})
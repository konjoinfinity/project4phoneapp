import React from "react";
import { Image } from "react-native";

class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require("./logo.png")}
                style={{ width: 60, height: 30 }} />
        );
    }
}

export default LogoTitle;
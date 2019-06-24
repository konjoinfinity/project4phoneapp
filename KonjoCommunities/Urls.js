import DeviceInfo from 'react-native-device-info'

const konjoUrl = DeviceInfo.isEmulator() ? "http://localhost/4000/" : "https://konjomeet.herokuapp.com/";

export default konjoUrl;
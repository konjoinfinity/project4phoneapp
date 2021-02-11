import React from "react";
import {
  Button,
  TextInput,
  Keyboard,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Alert
} from "react-native";
import { Card } from "react-native-elements";
import Nav from "./Nav"
import { AlertHelper } from './AlertHelper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from "react-native-modal";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Confetti from 'react-native-confetti';
import LogoTitle from "./LogoTitle"
import SInfo from 'react-native-sensitive-info';
import konjoUrl from "./Urls";
import ReactNativeHaptic from 'react-native-haptic';

const STORAGE_USER = "username";
const STORAGE_KEY = "id_token";
const push = "push"
const attending = "attending"
const pull = "pull"
const notattending = "notattending"
const maybeattending = "maybeattending"

class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      community: "",
      comment: "",
      creator: "",
      nav: false,
      userToken: "",
      memberslist: false,
      keyboard: false,
      options: false,
      joinmodal: null,
      meetoptions: false
    };
    this.openCloseNav = this.openCloseNav.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteCommunity = this.deleteCommunity.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
    this.commentClear = this.commentClear.bind(this);
    this.openCloseMembersList = this.openCloseMembersList.bind(this);
    this.openCloseMeetOptions = this.openCloseMeetOptions.bind(this);
    this.showHideOptions = this.showHideOptions.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleCommentChange(comment) {
    ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: true });
    this.setState({ comment });
  }

  commentClear() {
    this.setState({ comment: "" });
  }

  async getToken() {
    const token = await SInfo.getItem(STORAGE_KEY, {});
    this.setState({ userToken: token });
    const username = await SInfo.getItem(STORAGE_USER, {});
    this.setState({ creator: username });
  }

  async componentDidMount() {
    ReactNativeHaptic.generate('selection');
    await this.getToken();
    await fetch(`${konjoUrl}community/${this.props.navigation.state.params.communityId
      }`, {
      method: "GET",
      headers: {
        "user-token": `${this.state.userToken}`
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
    this.props.navigation.setParams({
      openCloseNav: this.openCloseNav
    });
    this.meetAlert();
    const newcomm = this.props.navigation.getParam('newcomm', 'false');
    if (newcomm === true) {
      AlertHelper.show('success', 'Success', `You've created ${this.state.community.name}!`);
    }
    const meet = this.props.navigation.getParam('meet', 'false');
    if (meet === true) {
      AlertHelper.show('info', 'Meet!', `You've created a new meet for ${this.state.community.name}!`);
    }
    const editmeet = this.props.navigation.getParam('editmeet', 'false');
    if (editmeet === true) {
      AlertHelper.show('info', 'Meet!', `You've edited a meet for ${this.state.community.name}!`);
    }
    const edit = this.props.navigation.getParam('edit', 'false');
    if (edit === true) {
      AlertHelper.show('info', 'Edited!', `You've updated ${this.state.community.name}!`);
    }
    if (this.state.creator !== this.state.community.creator) {
      const meetMember =
        this.state.community &&
        this.state.community.members.filter(
          member => member.name === this.state.creator
        );
      if (meetMember.length === 0) {
        this.setState({ joinmodal: true });
      }
    }
  }

  joinModal = () =>
  (
    <View style={styles.modal}>
      <Text style={styles.modalText}>Swipe to join {this.state.community.name}</Text>
      <Button title="Tap here or outside to close" onPress={() => this.closeModal()} />
    </View>
  );

  closeModal() {
    ReactNativeHaptic.generate('selection');
    this.setState({ joinmodal: null })
  }

  openCloseNav() {
    this.setState(prevState => ({ nav: !prevState.nav }));
    this.scrolltop.scrollTo({ x: 0, y: 0, animated: true })
    ReactNativeHaptic.generate('selection');
  }

  meetNav() {
    this.props.navigation.push("Meet", {
      communityId: `${this.state.community._id}`
    })
  }

  meetAlert() {
    const meetMember =
      this.state.community &&
      this.state.community.members.filter(
        member => member.name === this.state.creator
      );
    if (meetMember.length === 1 || this.state.community.creator === this.state.creator) {
      if (this.state.community.numberOfMembers >= 3) {
        if (this.state.community.meets.length === 0) {
          Alert.alert(
            'Create a Meet!',
            'You have 3 members!',
            [
              {
                text: 'Cancel',
                onPress: () => ReactNativeHaptic.generate('selection'),
                style: 'cancel',
              },
              { text: 'Create', onPress: () => this.meetNav() },
            ],
            { cancelable: false },
          );
          ReactNativeHaptic.generate('selection');
        }
      }
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerLeft: (<TouchableOpacity
        onPress={navigation.getParam('openCloseNav')}>
        <View>
          <Image
            source={require("./menu.png")}
            style={{ width: 30, height: 30, marginLeft: 10 }} />
        </View>
      </TouchableOpacity>
      )
    };
  }

  getCommunity() {
    fetch(`${konjoUrl}community/${this.state.community._id}`
      , {
        method: "GET",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  deleteCommunity() {
    fetch(`${konjoUrl}community/${this.state.community._id}`,
      {
        method: "DELETE",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
      .then(res => res.json())
      .then(res => console.log(res))
      .then(this.props.navigation.push("Home", {
        delcomm: true, name: this.state.community.name
      }))
      .then(ReactNativeHaptic.generate('selection')).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  deleteComment(e) {
    const data = { body: e };
    fetch(`${konjoUrl}community/${this.state.community._id
      }/delete`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "user-token": `${this.state.userToken}`
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => console.log(response))
      .then(result => {
        console.log(result);
        this.getCommunity();
        ReactNativeHaptic.generate('selection');
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  handleComment() {
    if (this.state.comment !== "") {
      const data = { comment: this.state.comment, creator: this.state.creator };
      fetch(`${konjoUrl}community/${this.state.community._id
        }/comment`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            "user-token": `${this.state.userToken}`
          },
          body: JSON.stringify(data)
        }
      )
        .then(response => console.log(response))
        .then(result => {
          console.log(result);
          this.getCommunity();
          this.commentClear()
          ReactNativeHaptic.generate('selection');
          setTimeout(() => {
            this.scrolltop.scrollToEnd({ animated: true });
          }, 300)
        }).catch(error => {
          AlertHelper.show('warn', 'Error', `${error.message}!`);
        });
    } else {
      ReactNativeHaptic.generate('selection');
      AlertHelper.show('warn', 'Warning', "Please enter text to comment.");
    }
  }

  joinCommunity() {
    const data = { member: this.state.creator };
    fetch(`${konjoUrl}community/${this.state.community._id
      }/adduser`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "user-token": `${this.state.userToken}`
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => console.log(response))
      .then(result => {
        console.log(result);
        this.getCommunity();
        ReactNativeHaptic.generate('selection');
        AlertHelper.show('success', 'Konjo!', `You have joined ${this.state.community.name}!`);
        this.confetti.startConfetti();
        if (this.state.joinmodal === true) {
          this.setState({ joinmodal: null })
        }
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  deleteMember(e) {
    const data = { body: e };
    fetch(`${konjoUrl}community/${this.state.community._id
      }/removeuser`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "user-token": `${this.state.userToken}`
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => console.log(response))
      .then(result => {
        console.log(result);
        this.getCommunity();
        ReactNativeHaptic.generate('selection');
        AlertHelper.show('info', 'Info', `You've left ${this.state.community.name}.`)
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  deleteMeet(e) {
    const data = { body: e };
    fetch(`${konjoUrl}community/${this.state.community._id
      }/meet/delete`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "user-token": `${this.state.userToken}`
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => console.log(response))
      .then(result => {
        console.log(result);
        this.getCommunity();
        ReactNativeHaptic.generate('selection');
        AlertHelper.show('info', 'Info', `You've deleted a meet for ${this.state.community.name}.`)
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  openCloseMembersList() {
    this.setState(prevState => ({
      memberslist: !prevState.memberslist
    }));
    ReactNativeHaptic.generate('selection');
  }

  openCloseMeetOptions() {
    this.setState(prevState => ({
      meetoptions: !prevState.meetoptions
    }));
    ReactNativeHaptic.generate('selection');
  }

  showHideOptions() {
    this.setState(prevState => ({
      options: !prevState.options
    }));
    ReactNativeHaptic.generate('selection');
  }

  attendAll(meetid, meetname, method, type) {
    fetch(`${konjoUrl}community/${this.state.community._id
      }/meet/attendall`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "user-token": `${this.state.userToken}`
        },
        body: JSON.stringify({
          meet: meetid,
          name: this.state.creator,
          dbmethod: method,
          attendance: type
        })
      }
    ).then(response => console.log(response))
      .then(result => {
        console.log(result);
        this.getCommunity();
        ReactNativeHaptic.generate('selection');
        AlertHelper.show('info', 'Info', `Attendance updated for ${meetname}!`)
      }).catch(error => {
        AlertHelper.show('warn', 'Error', `${error.message}!`);
      });
  }

  render() {
    let members;
    this.state.community &&
      (members = this.state.community.members.map((member, id) => {
        return (
          <Card key={id} borderRadius={15}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}>
              <Text style={{ fontSize: 20 }}>👤 {member.name}</Text>
              {this.state.creator === this.state.community.creator && (
                <Button
                  title="🗑 Remove"
                  onPress={() => this.deleteMember(`${member._id}`)} />)}
            </View>
          </Card>
        );
      }));
    let commentlist;
    this.state.community &&
      (commentlist = this.state.community.comments.map((comment, id) => {
        return (
          <TouchableOpacity key={id} style={styles.comment}>
            <Text style={{ fontSize: 40, padding: 20, textAlign: "center" }}>{comment.text}</Text>
            <Text style={{ fontSize: 15, padding: 10, textAlign: "center" }}>{comment.creator}</Text>
            {this.state.creator === comment.creator && (
              <Button
                title="🗑 Delete"
                onPress={() => this.deleteComment(`${comment._id}`)} />)}
          </TouchableOpacity>
        );
      }));
    const member =
      this.state.community &&
      this.state.community.members.filter(
        member => member.name === this.state.creator
      );
    let meetlist;
    let userattending;
    let usernotattending;
    let usermaybeattending;
    this.state.community &&
      (meetlist = this.state.community.meets.map((meet, id) => {
        userattending = meet.attending.filter(user => user.name === this.state.creator);
        usernotattending = meet.notAttending.filter(user => user.name === this.state.creator);
        usermaybeattending = meet.maybeAttending.filter(user => user.name === this.state.creator);
        return (
          <Card borderRadius={15} key={id}>
            <View>
              <Text style={{ fontSize: 30, padding: 5, textAlign: "center" }}>{meet.name}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>🗒 {meet.description}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>📍 {meet.location}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>📆 {meet.date}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>🕒 {meet.time}</Text>
              <Text style={{ fontSize: 10, padding: 5, textAlign: "center" }}>👤 {meet.creator}</Text>
              <Card borderRadius={15}>
                <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Who's Going?</Text>
                <View>
                  {meet.attending.length !== 0 && <Card borderRadius={15}>
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Attending</Text>
                      {meet.attending.map((going, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{going.name}</Text>
                            {going.name === this.state.creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, attending)} />}
                          </View>
                        )
                      })}
                    </View>
                  </Card>}
                  {meet.notAttending.length !== 0 && <Card borderRadius={15}>
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Not Attending</Text>
                      {meet.notAttending.map((notgoing, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{notgoing.name}</Text>
                            {notgoing.name === this.state.creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, notattending)} />}
                          </View>
                        )
                      })}
                    </View>
                  </Card>}
                  {meet.maybeAttending.length !== 0 && <Card borderRadius={15}>
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Maybe Attending</Text>
                      {meet.maybeAttending.map((maybegoing, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{maybegoing.name}</Text>
                            {maybegoing.name === this.state.creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, maybeattending)} />}
                          </View>
                        )
                      })}
                    </View>
                  </Card>}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Going 👍🏻"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, attending)} />
                      )))}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Not Going 👎🏻"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, notattending)} />
                      )))}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Maybe Going 🤷🏻‍♂️🤷🏻‍♀️"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, maybeattending)} />
                      )))}
                </View>
              </Card>
              {this.state.creator === meet.creator &&
                <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Options</Text>}
              {this.state.meetoptions === false && (
                this.state.creator === meet.creator && (
                  <Button onPress={() => this.openCloseMeetOptions()}
                    title="Show" />))}
              {this.state.meetoptions === true && (
                this.state.creator === meet.creator && (
                  <Button onPress={() => this.openCloseMeetOptions()}
                    title="Hide" />))}
              {this.state.meetoptions === true && (
                this.state.creator === meet.creator && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      this.props.navigation.push("EditMeet", {
                        communityId: `${this.state.community._id}`, meet: `${meet._id}`
                      })}>
                    <Text style={styles.buttonText}>Edit Meet ✏️</Text>
                  </TouchableOpacity>))}
              {this.state.meetoptions === true && (
                this.state.creator === meet.creator && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.deleteMeet(`${meet._id}`)}>
                    <Text style={styles.buttonText}>Delete Meet 🗑</Text>
                  </TouchableOpacity>))}
            </View>
          </Card>
        );
      }));
    return (
      <View style={styles.communities} behavior="padding" >
        <ScrollView ref={(ref) => { this.scrolltop = ref; }}>
          {this.state.nav === true && <Nav navigation={this.props.navigation} />}
          <AnimatableView
            animation="bounceInUp"
            delay={10}
            duration={1800}>
            <Card borderRadius={15} minWidth={330}>
              <View>
                <Text style={{ fontSize: 40, padding: 10, textAlign: "center" }}>{this.state.community.name}</Text>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>🗒 {this.state.community.description}</Text>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>📝 {this.state.community.category}</Text>
              </View>
            </Card>
            <Card borderRadius={15}>
              <View>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>👥 Members:  {this.state.community.numberOfMembers}</Text>
                {this.state.memberslist === false &&
                  <Button onPress={() => this.openCloseMembersList()}
                    title="Show" />}
                {this.state.memberslist === true &&
                  <Button onPress={() => this.openCloseMembersList()}
                    title="Hide" />}
                {this.state.memberslist === true &&
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    👤 {this.state.community.creator}
                  </Text>}
                {this.state.memberslist === true && (
                  this.state.creator === this.state.community.creator && (
                    <View>{members}</View>))}
                {this.state.memberslist === true &&
                  member.length === 1 && <View>{members}</View>}
              </View>
            </Card>
            <Card borderRadius={15}>
              <View>
                <Text style={{
                  fontSize: 25,
                  textAlign: "center"
                }}>Options</Text>
                {this.state.options === false &&
                  <Button onPress={() => this.showHideOptions()}
                    title="Show" />}
                {this.state.options === true &&
                  <Button onPress={() => this.showHideOptions()}
                    title="Hide" />}
                {this.state.options === true &&
                  <View>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() =>
                        this.props.navigation.push("CommMap", {
                          communityId: `${this.state.community._id}`
                        })}>
                      <Text style={styles.buttonText}>Map 🗺</Text>
                    </TouchableOpacity>
                    {this.state.creator !== this.state.community.creator &&
                      member.length === 0 && (
                        <TouchableOpacity
                          style={styles.joinButton}
                          onPress={this.joinCommunity}>
                          <Text style={styles.buttonText}>Join Community ➕👥</Text>
                        </TouchableOpacity>)}
                    {this.state.creator !== this.state.community.creator &&
                      member.length === 1 && (
                        <TouchableOpacity
                          style={styles.leaveButton}
                          onPress={() => this.deleteMember(member[0]._id)}>
                          <Text style={styles.buttonText}>Leave Community ⬅️👤</Text>
                        </TouchableOpacity>)}
                    {this.state.creator === this.state.community.creator && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          this.props.navigation.push("Edit", {
                            communityId: `${this.state.community._id}`
                          })}>
                        <Text style={styles.buttonText}>Edit Community ✏️</Text>
                      </TouchableOpacity>)}
                    {this.state.creator === this.state.community.creator && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={this.deleteCommunity}>
                        <Text style={styles.buttonText}>Delete Community 🗑</Text>
                      </TouchableOpacity>)}
                    {this.state.community.numberOfMembers >= 3 &&
                      member.length === 1 && (
                        <TouchableOpacity
                          style={styles.meetButton}
                          onPress={() =>
                            this.props.navigation.push("Meet", {
                              communityId: `${this.state.community._id}`
                            })}>
                          <Text style={styles.buttonText}>Create Meet ➕📆</Text>
                        </TouchableOpacity>)}
                    {this.state.community.numberOfMembers >= 3 &&
                      this.state.creator === this.state.community.creator && (
                        <TouchableOpacity
                          style={styles.meetButton}
                          onPress={() =>
                            this.props.navigation.push("Meet", {
                              communityId: `${this.state.community._id}`
                            })}>
                          <Text style={styles.buttonText}>Create Meet ➕🗓</Text>
                        </TouchableOpacity>)}
                  </View>}
              </View>
            </Card>
            {this.state.community.numberOfMembers >= 3 && member.length === 1 && (
              this.state.community.meets.length !== 0 && (
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>Meets</Text>))}
            {this.state.community.numberOfMembers >= 3 &&
              this.state.creator === this.state.community.creator && (
                this.state.community.meets.length !== 0 && (
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>Meets</Text>))}
            {this.state.creator === this.state.community.creator && (
              <View>{meetlist}</View>)}
            {member.length === 1 && <View>{meetlist}</View>}
            {member.length === 1 && (
              <Card borderRadius={15}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    name="comment"
                    id="comment"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleCommentChange}
                    returnKeyType="send"
                    value={this.state.comment}
                    onSubmitEditing={this.handleComment} />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.handleComment}>
                    <Text style={styles.buttonText}>Add Comment 💬</Text>
                  </TouchableOpacity>
                </View>
              </Card>)}
            {this.state.creator === this.state.community.creator && (
              <Card borderRadius={15}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    name="comment"
                    id="comment"
                    onBlur={Keyboard.dismiss}
                    onChangeText={this.handleCommentChange}
                    returnKeyType='send'
                    value={this.state.comment}
                    onSubmitEditing={this.handleComment} />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={this.handleComment}>
                    <Text style={styles.buttonText}>Add Comment 💬</Text>
                  </TouchableOpacity>
                </View>
              </Card>)}
            {this.state.creator === this.state.community.creator && (
              this.state.community.comments.length !== 0 && (
                <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>Comments</Text>))}
            {member.length === 1 && (
              this.state.community.comments.length !== 0 && (
                <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>Comments</Text>))}
            {this.state.creator === this.state.community.creator && (
              <View style={{ margin: 20 }}>{commentlist}</View>)}
            {member.length === 1 && (
              <View style={{ margin: 20 }}>{commentlist}</View>)}
          </AnimatableView>
        </ScrollView>
        <Modal
          isVisible={this.state.joinmodal === true}
          animationInTiming={500}
          animationIn="slideInDown"
          onSwipeComplete={() => this.joinCommunity()}
          swipeDirection={['right', 'left', 'up', 'down']}
          onBackdropPress={() => this.closeModal()}>
          {this.joinModal()}
        </Modal>
        <KeyboardSpacer />
        <Confetti timeout={1} size={2} confettiCount={50} duration={3000} ref={(node) => this.confetti = node} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 15
  },
  textInput: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 15
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#FF1717",
    backgroundColor: "#FF1717",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  joinButton: {
    borderWidth: 1,
    borderColor: "#3D7E9A",
    backgroundColor: "#3D7E9A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communityButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communities: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#FFD517",
    backgroundColor: "#FFD517",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  meetButton: {
    borderWidth: 1,
    borderColor: "#752794",
    backgroundColor: "#752794",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  comment: {
    borderWidth: 1,
    borderColor: "#FFB944",
    backgroundColor: "#FFB944",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  saveButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  myCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  joinedCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#E0118A",
    backgroundColor: "#E0118A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  mapButton: {
    borderWidth: 1,
    borderColor: "#00B6B6",
    backgroundColor: "#00B6B6",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  modal: {
    height: 250,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  modalText: {
    fontSize: 25,
    color: 'white',
    padding: 10,
    textAlign: "center"
  },
  leaveButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  }
});

export default CommunityScreen;

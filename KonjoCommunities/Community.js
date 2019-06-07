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
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Nav from "./Nav"

var STORAGE_USER = "username";
var STORAGE_KEY = "id_token";

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

class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      community: "",
      comment: "",
      creator: "",
      nav: false,
      userToken: "",
      joined: ""
    };
    this.openCloseNav = this.openCloseNav.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteCommunity = this.deleteCommunity.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
    this.commentClear = this.commentClear.bind(this);
    this.joinUnjoin = this.joinUnjoin.bind(this);
  }

  handleCommentChange(comment) {
    this.setState({ comment });
  }

  commentClear() {
    this.setState({ comment: "" });
  }

  async getUsername() {
    var username = await AsyncStorage.getItem(STORAGE_USER);
    console.log(username);
    this.setState({ creator: username });
  }

  async getToken() {
    var token = await AsyncStorage.getItem(STORAGE_KEY);
    this.setState({ userToken: token });
  }

  async componentDidMount() {
    await this.getToken();
    await this.getUsername();
    await fetch(`https://konjomeet.herokuapp.com/community/${
      this.props.navigation.state.params.communityId
      }`, {
        method: "GET",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
    Vibration.vibrate();
    this.props.navigation.setParams({
      openCloseNav: this.openCloseNav
    });
    this.meetAlert();
  }

  openCloseNav() {
    if (this.state.nav === false) {
      this.setState({ nav: true });
      this.scrolltop.scrollTo({ x: 0, y: 0, animated: true })
      Vibration.vibrate();
    } else {
      this.setState({ nav: false });
      Vibration.vibrate();
    }
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
                onPress: () => Vibration.vibrate(),
                style: 'cancel',
              },
              { text: 'Create', onPress: () => this.meetNav() },
            ],
            { cancelable: false },
          );
          Vibration.vibrate();
        } else {
          console.log("Meets already created")
        }
      } else {
        console.log("More members required")
      }
    } else {
      console.log("Required to Join")
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
    fetch(`https://konjomeet.herokuapp.com/community/${this.state.community._id}`
      , {
        method: "GET",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
  }

  deleteCommunity() {
    fetch(`https://konjomeet.herokuapp.com/community/${this.state.community._id}`,
      {
        method: "DELETE",
        headers: {
          "user-token": `${this.state.userToken}`
        }
      })
      .then(res => res.json())
      .then(res => console.log(res))
      .then(this.props.navigation.push("NewHome"))
      .then(Vibration.vibrate());
  }

  deleteComment(e) {
    const data = { body: e };
    fetch(`https://konjomeet.herokuapp.com/community/${
      this.state.community._id
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
        Vibration.vibrate();
      });
  }

  handleComment() {
    const data = { comment: this.state.comment, creator: this.state.creator };
    fetch(`https://konjomeet.herokuapp.com/community/${
      this.state.community._id
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
        Vibration.vibrate();
      })
  }

  joinCommunity() {
    const data = { member: this.state.creator };
    fetch(`https://konjomeet.herokuapp.com/community/${
      this.state.community._id
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
        Vibration.vibrate();
      });
    this.joinUnjoin(true)
  }

  deleteMember(e) {
    const data = { body: e };
    fetch(`https://konjomeet.herokuapp.com/community/${
      this.state.community._id
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
        Vibration.vibrate();
      });
    this.joinUnjoin(false)
  }

  deleteMeet(e) {
    const data = { body: e };
    fetch(`https://konjomeet.herokuapp.com/community/${
      this.state.community._id
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
        Vibration.vibrate();
      });
  }

  viewCommunities() {
    Vibration.vibrate();
    this.props.navigation.push("Communities");
  }

  goHome() {
    Vibration.vibrate();
    this.props.navigation.push("NewHome");
  }

  joinUnjoin(value) {
    this.setState({ joined: value })
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
              }}
            >
              <Text style={{ fontSize: 20 }}>👤 {member.name}</Text>
              {this.state.creator === this.state.community.creator && (
                <Button
                  title="🗑 Remove"
                  onPress={() => this.deleteMember(`${member._id}`)}
                />
              )}
              {this.state.creator === member.name && (
                <Button
                  title="🗑 Remove"
                  onPress={() => this.deleteMember(`${member._id}`)}
                />
              )}
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
                onPress={() => this.deleteComment(`${comment._id}`)}
              />
            )}
          </TouchableOpacity>
        );
      }));
    const member =
      this.state.community &&
      this.state.community.members.filter(
        member => member.name === this.state.creator
      );
    let meetlist;
    this.state.community &&
      (meetlist = this.state.community.meets.map((meet, id) => {
        return (
          <Card borderRadius={15} key={id}>
            <View>
              <Text style={{ fontSize: 30, padding: 5, textAlign: "center" }}>{meet.name}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>
                🗒 {meet.description}
              </Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>
                📍 {meet.location}
              </Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>
                📆 {meet.date}
              </Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>
                🕒 {meet.time}
              </Text>
              <Text style={{ fontSize: 10, padding: 5, textAlign: "center" }}>
                👤 {meet.creator}
              </Text>
              {this.state.creator === meet.creator && (
                <Button
                  title="🗑 Delete"
                  onPress={() => this.deleteMeet(`${meet._id}`)}
                />
              )}
            </View>
          </Card>
        );
      }));
    return (
      <KeyboardAvoidingView style={styles.communities} behavior="padding">
        <ScrollView ref={(ref) => { this.scrolltop = ref; }}>
          {this.state.nav === true && <Nav navigation={this.props.navigation} />}
          <AnimatableView
            animation="bounceInUp"
            delay={10}
            duration={1800}>
            <AnimatableView animation={this.state.joined === true ? "flipInY" : undefined}>
              <Card borderRadius={15}>
                <View>
                  <Text style={{ fontSize: 40, padding: 10, textAlign: "center" }}>
                    {this.state.community.name}
                  </Text>
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    🗒 {this.state.community.description}
                  </Text>
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    📝 {this.state.community.category}
                  </Text>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View>
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    👥 {this.state.community.numberOfMembers}
                  </Text>
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    👤 {this.state.community.creator}
                  </Text>
                  {this.state.creator === this.state.community.creator && (
                    <View>{members}</View>
                  )}
                  {member.length === 1 && <View>{members}</View>}
                </View>
              </Card>
              <Card borderRadius={15}>
                <View>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() =>
                      this.props.navigation.push("CommMap", {
                        communityId: `${this.state.community._id}`
                      })
                    }
                  >
                    <Text style={styles.mapButtonText}>Map 🗺</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => this.goHome()}
                  >
                    <Text style={styles.homeButtonText}>Go Home 🏠</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.communityButton}
                    onPress={() => this.viewCommunities()}
                  >
                    <Text style={styles.communityButtonText}>View Communites 👥</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.myCommunitiesButton}
                    onPress={() => this.props.navigation.push("MyCommunities")}
                  >
                    <Text style={styles.myCommunitiesButtonText}>
                      My Communities 👤
                </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinedCommunitiesButton}
                    onPress={() => this.props.navigation.push("JoinedCommunities")}
                  >
                    <Text style={styles.joinedCommunitiesButtonText}>
                      Joined Communities 👤➡️👥
          </Text>
                  </TouchableOpacity>
                  {this.state.creator !== this.state.community.creator &&
                    member.length === 0 && (
                      <TouchableOpacity
                        style={styles.joinButton}
                        onPress={this.joinCommunity}
                      >
                        <Text style={styles.joinButtonText}>Join Community ➕👥</Text>
                      </TouchableOpacity>
                    )}
                  {this.state.creator === this.state.community.creator && (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() =>
                        this.props.navigation.push("Edit", {
                          communityId: `${this.state.community._id}`
                        })
                      }
                    >
                      <Text style={styles.editButtonText}>Edit Community ✏️</Text>
                    </TouchableOpacity>
                  )}
                  {this.state.creator === this.state.community.creator && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={this.deleteCommunity}
                    >
                      <Text style={styles.deleteButtonText}>Delete Community 🗑</Text>
                    </TouchableOpacity>
                  )}
                  {this.state.community.numberOfMembers >= 3 &&
                    member.length === 1 && (
                      <TouchableOpacity
                        style={styles.meetButton}
                        onPress={() =>
                          this.props.navigation.push("Meet", {
                            communityId: `${this.state.community._id}`
                          })
                        }
                      >
                        <Text style={styles.meetButtonText}>Create Meet ➕📆</Text>
                      </TouchableOpacity>
                    )}
                  {this.state.community.numberOfMembers >= 3 &&
                    this.state.creator === this.state.community.creator && (
                      <TouchableOpacity
                        style={styles.meetButton}
                        onPress={() =>
                          this.props.navigation.push("Meet", {
                            communityId: `${this.state.community._id}`
                          })
                        }
                      >
                        <Text style={styles.meetButtonText}>Create Meet ➕🗓</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </Card>
              {this.state.community.numberOfMembers >= 3 && member.length === 1 && (
                this.state.community.meets.length !== 0 && (
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    Meets
            </Text>
                ))}
              {this.state.community.numberOfMembers >= 3 &&
                this.state.creator === this.state.community.creator && (
                  this.state.community.meets.length !== 0 && (
                    <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                      Meets
              </Text>
                  ))}
              {this.state.creator === this.state.community.creator && (
                <View>{meetlist}</View>
              )}
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
                      onSubmitEditing={this.handleComment}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={this.handleComment}
                    >
                      <Text style={styles.saveButtonText}>Add Comment 💬</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
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
                      onSubmitEditing={this.handleComment}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={this.handleComment}
                    >
                      <Text style={styles.saveButtonText}>Add Comment 💬</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
              {this.state.creator === this.state.community.creator && (
                this.state.community.comments.length !== 0 && (
                  <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>
                    Comments
            </Text>
                ))}
              {member.length === 1 && (
                this.state.community.comments.length !== 0 && (
                  <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>
                    Comments
            </Text>
                ))}
              {this.state.creator === this.state.community.creator && (
                <View style={{ margin: 20 }}>{commentlist}</View>
              )}
              {member.length === 1 && (
                <View style={{ margin: 20 }}>{commentlist}</View>
              )}
            </AnimatableView>
          </AnimatableView>
        </ScrollView>
      </KeyboardAvoidingView>
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
  deleteButtonText: {
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
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  communityButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communityButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  communities: {
    flex: 2,
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
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  meetButton: {
    borderWidth: 1,
    borderColor: "#752794",
    backgroundColor: "#752794",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  meetButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
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
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  myCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  myCommunitiesButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  joinedCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#E0118A",
    backgroundColor: "#E0118A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  joinedCommunitiesButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  mapButton: {
    borderWidth: 1,
    borderColor: "#00B6B6",
    backgroundColor: "#00B6B6",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  }
});

export default CommunityScreen;

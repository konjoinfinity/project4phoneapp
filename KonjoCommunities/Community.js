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
  KeyboardAvoidingView
} from "react-native";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

var STORAGE_USER = "username";

class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      community: "",
      comment: "",
      creator: ""
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteCommunity = this.deleteCommunity.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
    this.commentClear = this.commentClear.bind(this);
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

  componentDidMount() {
    Vibration.vibrate();
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.props.navigation.state.params.communityId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
    this.getUsername();
  }

  getCommunity() {
    fetch(
      `https://konjomeet.herokuapp.com/community/${this.state.community._id}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
  }

  deleteCommunity() {
    fetch(
      `https://konjomeet.herokuapp.com/community/${this.state.community._id}`,
      {
        method: "DELETE"
      }
    )
      .then(res => res.json())
      .then(res => console.log(res))
      .then(this.props.navigation.navigate("Home"))
      .then(Vibration.vibrate());
  }

  deleteComment(e) {
    const data = { body: e };
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.state.community._id
      }/delete`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
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
    const data = { comment: this.state.comment };
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.state.community._id
      }/comment`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
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
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.state.community._id
      }/adduser`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
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

  deleteMember(e) {
    const data = { body: e };
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.state.community._id
      }/removeuser`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
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

  deleteMeet(e) {
    const data = { body: e };
    fetch(
      `https://konjomeet.herokuapp.com/community/${
      this.state.community._id
      }/meet/delete`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
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
    this.props.navigation.navigate("Communities");
  }

  goHome() {
    Vibration.vibrate();
    this.props.navigation.navigate("Home");
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
            </View>
          </Card>
        );
      }));
    let commentlist;
    this.state.community &&
      (commentlist = this.state.community.comments.map((comment, id) => {
        return (
          <TouchableOpacity key={id} style={styles.comment}>
            <Text style={{ fontSize: 40, padding: 20 }}>{comment.text}</Text>
            <Button
              title="🗑 Delete"
              onPress={() => this.deleteComment(`${comment._id}`)}
            />
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
              <Text style={{ fontSize: 20, padding: 5 }}>{meet.name}</Text>
              <Text style={{ fontSize: 20, padding: 5 }}>
                🗒 {meet.description}
              </Text>
              <Text style={{ fontSize: 20, padding: 5 }}>
                🗺 {meet.location}
              </Text>
              <Text style={{ fontSize: 20, padding: 5 }}>
                📆 {meet.date}
              </Text>
              <Text style={{ fontSize: 20, padding: 5 }}>
                🕒 {meet.time}
              </Text>
              {this.state.creator === this.state.community.creator && (
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
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ height: 50, width: 100 }}
              source={require("./logo.png")}
            />
          </View>
          <Card borderRadius={15}>
            <View>
              <Text style={{ fontSize: 40, padding: 10 }}>
                {this.state.community.name}
              </Text>
              <Text style={{ fontSize: 30, padding: 10 }}>
                🗒 {this.state.community.description}
              </Text>
              <Text style={{ fontSize: 30, padding: 10 }}>
                📝 {this.state.community.category}
              </Text>
            </View>
          </Card>
          <Card borderRadius={15}>
            <View>
              <Text style={{ fontSize: 30, padding: 10 }}>
                👥 {this.state.community.numberOfMembers}
              </Text>
              <Text style={{ fontSize: 30, padding: 10 }}>
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
                onPress={() => this.props.navigation.navigate("MyCommunities")}
              >
                <Text style={styles.myCommunitiesButtonText}>
                  My Communities 👤
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.joinedCommunitiesButton}
                onPress={() => this.props.navigation.navigate("JoinedCommunities")}
              >
                <Text style={styles.joinedCommunitiesButtonText}>
                  Joined Communities 👤👥
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
                    this.props.navigation.navigate("Edit", {
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
                      this.props.navigation.navigate("Meet", {
                        communityId: `${this.state.community._id}`
                      })
                    }
                  >
                    <Text style={styles.meetButtonText}>Create Meet ➕🗓</Text>
                  </TouchableOpacity>
                )}
              {this.state.community.numberOfMembers >= 3 &&
                this.state.creator === this.state.community.creator && (
                  <TouchableOpacity
                    style={styles.meetButton}
                    onPress={() =>
                      this.props.navigation.navigate("Meet", {
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
            <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
              Meets
            </Text>
          )}
          {this.state.community.numberOfMembers >= 3 &&
            this.state.creator === this.state.community.creator && (
              <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                Meets
              </Text>
            )}
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
            <Text style={{ fontSize: 35, padding: 20, fontWeight: "bold" }}>
              Comments
            </Text>
          )}
          {member.length === 1 && (
            <Text style={{ fontSize: 35, padding: 20, fontWeight: "bold" }}>
              Comments
            </Text>
          )}
          {this.state.creator === this.state.community.creator && (
            <View style={{ margin: 20 }}>{commentlist}</View>
          )}
          {member.length === 1 && (
            <View style={{ margin: 20 }}>{commentlist}</View>
          )}
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
  }
});

export default CommunityScreen;

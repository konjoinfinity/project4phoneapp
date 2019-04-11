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
  Vibration
} from "react-native";
import { Card } from "react-native-elements";

class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      community: "",
      comment: "",
      creator: "konjo@konjoweb.com"
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteCommunity = this.deleteCommunity.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
  }

  handleCommentChange(comment) {
    this.setState({ comment });
  }

  componentDidMount() {
    Vibration.vibrate();
    fetch(
      `http://localhost:4000/community/${
        this.props.navigation.state.params.communityId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
  }

  getCommunity() {
    fetch(`http://localhost:4000/community/${this.state.community._id}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ community: res });
      });
  }

  deleteCommunity() {
    fetch(`http://localhost:4000/community/${this.state.community._id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(res => console.log(res))
      .then(this.props.navigation.navigate("Home"))
      .then(Vibration.vibrate());
  }

  deleteComment(e) {
    console.log(e);
    const data = { body: e };
    fetch(
      `http://localhost:4000/community/${this.state.community._id}/delete`,
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
      `http://localhost:4000/community/${this.state.community._id}/comment`,
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

  joinCommunity() {
    const data = { member: this.state.creator };
    fetch(
      `http://localhost:4000/community/${this.state.community._id}/adduser`,
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

  render() {
    let members;
    this.state.community &&
      (members = this.state.community.members.map((member, id) => {
        return (
          <Text key={id} style={{ fontSize: 20 }}>
            {member.name}
          </Text>
        );
      }));
    let commentlist;
    this.state.community &&
      (commentlist = this.state.community.comments.map((comment, id) => {
        return (
          <TouchableOpacity key={id} style={styles.comment}>
            <Text style={{ fontSize: 40, padding: 20 }}>{comment.text}</Text>
            <Button
              title="Delete"
              onPress={() => this.deleteComment(`${comment._id}`)}
              style={styles.deleteButton}
            />
          </TouchableOpacity>
        );
      }));
    const member =
      this.state.community &&
      this.state.community.members.filter(
        member => member.name === this.state.creator
      );
    return (
      <View style={styles.communities}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ height: 100, width: 200 }}
              source={require("./logo.png")}
            />
          </View>
          <Card borderRadius={15}>
            <Text style={{ fontSize: 30, padding: 10 }}>
              Name: {this.state.community.name}
            </Text>
            <Text style={{ fontSize: 30, padding: 10 }}>
              Description: {this.state.community.description}
            </Text>
            <Text style={{ fontSize: 30, padding: 10 }}>
              Category: {this.state.community.category}
            </Text>
          </Card>
          <Card borderRadius={15}>
            <Text style={{ fontSize: 40, padding: 10 }}>
              Members: {this.state.community.numberOfMembers}
            </Text>
            <Text style={{ fontSize: 30, padding: 10 }}>
              Creator: {this.state.community.creator}
            </Text>
            {members}
          </Card>
          <Card borderRadius={15}>
            <TouchableOpacity
              style={styles.communityButton}
              onPress={() => this.props.navigation.navigate("Communities")}
            >
              <Text style={styles.communityButtonText}>View Communites</Text>
            </TouchableOpacity>
            {this.state.creator !== this.state.community.creator &&
              member.length === 0 && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={this.joinCommunity}
                >
                  <Text style={styles.joinButtonText}>Join Community</Text>
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
                <Text style={styles.editButtonText}>Edit Community</Text>
              </TouchableOpacity>
            )}
            {this.state.creator === this.state.community.creator && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={this.deleteCommunity}
              >
                <Text style={styles.deleteButtonText}>Delete Community</Text>
              </TouchableOpacity>
            )}
          </Card>
          <Card borderRadius={15}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                name="comment"
                id="comment"
                onBlur={Keyboard.dismiss}
                onChangeText={this.handleCommentChange}
              />
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={this.handleComment}
              >
                <Text style={styles.saveButtonText}>Add Comment</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Text style={{ fontSize: 35, padding: 20, fontWeight: "bold" }}>
            Comments
          </Text>
          <Card borderRadius={15}>{commentlist}</Card>
        </ScrollView>
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
  }
});

export default CommunityScreen;

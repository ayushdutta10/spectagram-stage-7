import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

const fonts = {
  spectagramLogoFonts: require("../assets/fonts/logoFont.ttf"),
  AllFonts: require("../assets/fonts/Roboto.ttf"),
};

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: false,
      fontsLoaded: false,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(fonts);
    this.setState({ fontsLoaded: true });
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ lightTheme: theme === "light" ? true : false });
      });
  };

  componentDidMount() {
    this.fetchUser();
    this._loadFontsAsync();
  }

  render() {
    if (this.state.fontsLoaded === false) {
      return <AppLoading />;
    } else {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate(
              "PostScreen",
              (post = this.props.post)
            )
          }
        >
          <View
            style={
              this.state.lightTheme
                ? styles.lightCardContainer
                : styles.cardContainer
            }
          >
            <View style={styles.authorContainer}>
              <View style={styles.authorImageContainer}>
                <Image
                  source={{ uri: this.props.post.profile }}
                  style={styles.profileImage}
                ></Image>
              </View>
              <View style={styles.authorNameContainer}>
                <Text
                  style={
                    this.state.lightTheme
                      ? styles.lightAuthorNameText
                      : styles.authorNameText
                  }
                >
                  {this.props.post.author}
                </Text>
              </View>
            </View>
            <Image
              source={{ uri: this.props.post.post }}
              style={styles.postImage}
            />
            <View style={styles.captionContainer}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.lightCaptionText
                    : styles.captionText
                }
              >
                {this.props.post.caption}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.likeButton}>
                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                <Text style={styles.likeText}>12k</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  // default Dark Theme

  container: {
    flex: 1,
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2a2a2a",
    borderRadius: RFValue(20),
    padding: RFValue(20),
  },
  authorContainer: {
    flex: 0.1,
    flexDirection: "row",
  },
  authorImageContainer: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "130%",
    height: "130%",
    resizeMode: "contain",
    borderRadius: 100,
  },
  authorNameContainer: {
    flex: 0.85,
    justifyContent: "center",
  },
  authorNameText: {
    color: "white",
    fontSize: 20,
    fontFamily: "AllFonts",
    fontWeight: "bold",
    marginLeft: 8,
  },
  postImage: {
    marginTop: RFValue(20),
    resizeMode: "contain",
    width: "100%",
    alignSelf: "center",
    height: RFValue(275),
    borderRadius: 7.5,
  },
  captionContainer: {
    padding: RFValue(10),
  },
  captionText: {
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10),
    fontFamily: "AllFonts",
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
  },
  likeText: {
    color: "white",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
    fontFamily: "AllFonts",
    fontWeight: "bold",
  },

  // Light Theme

  lightCardContainer: {
    margin: RFValue(13),
    backgroundColor: "#eaeaea",
    borderRadius: RFValue(20),
    padding: RFValue(20),
  },
  lightAuthorNameText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "AllFonts",
  },
  lightCaptionText: {
    fontSize: 13,
    color: "black",
    paddingTop: RFValue(10),
    fontFamily: "AllFonts",
  },
});

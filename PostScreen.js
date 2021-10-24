import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import ImageView from "react-native-image-viewing";
import FullImageDescription from "../assets/FullImageDescription";

const fonts = {
  SpectagramLogoFonts: require("../assets/fonts/logoFont.ttf"),
  AllFonts: require("../assets/fonts/Roboto.ttf"),
};

export default class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: false,
      fontsLoaded: false,
      isImageViewVisible: false,
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
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      const fullImages = [{ uri: this.props.route.params.post }];
      return (
        <View
          style={
            this.state.lightTheme ? styles.lightContainer : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.lightAppTitleText
                    : styles.appTitleText
                }
              >
                Spectagram
              </Text>
            </View>
          </View>
          <View style={styles.postContainer}>
            <ScrollView
              style={
                this.state.lightTheme ? styles.lightPostCard : styles.postCard
              }
            >
              <View style={styles.authorContainer}>
                <View style={styles.authorImageContainer}>
                  <Image
                    source={{ uri: this.props.route.params.profile }}
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
                    {this.props.route.params.author}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ isImageViewVisible: true })}
              >
                <Image
                  source={{ uri: this.props.route.params.post }}
                  style={styles.postImage}
                />
              </TouchableOpacity>
              <ImageView
                images={fullImages}
                imageIndex={0}
                visible={this.state.isImageViewVisible}
                doubleTapToZoomEnabled={false}
                swipeToCloseEnabled={false}
                animationType="fade"
                onRequestClose={() =>
                  this.setState({ isImageViewVisible: false })
                }
                FooterComponent={() => {
                  return (
                    <FullImageDescription
                      text={this.props.route.params.caption}
                    />
                  );
                }}
              />

              <View style={styles.captionContainer}>
                <Text
                  style={
                    this.state.lightTheme
                      ? styles.lightCaptionText
                      : styles.captionText
                  }
                >
                  {this.props.route.params.caption}
                </Text>
                <Text
                  style={
                    this.state.lightTheme
                      ? styles.lightCaptionText
                      : styles.captionText
                  }
                >
                  {this.props.route.params.full}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                  <Text style={styles.likeText}>12k</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  // default Dark Theme

  container: {
    flex: 1,
    backgroundColor: "black",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "SpectagramLogoFonts",
  },
  postContainer: {
    flex: 1,
  },
  postCard: {
    margin: RFValue(20),
    backgroundColor: "#2a2a2a",
    borderRadius: RFValue(20),
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(30),
  },
  likeText: {
    color: "white",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
    fontFamily: "AllFonts",
    fontWeight: "bold",
  },
  authorContainer: {
    height: RFPercentage(10),
    padding: RFValue(10),
    flexDirection: "row",
  },
  authorImageContainer: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 100,
  },
  authorNameContainer: {
    flex: 0.85,
    padding: RFValue(10),
    justifyContent: "center",
  },
  authorNameText: {
    color: "white",
    fontSize: RFValue(20),
    fontFamily: "AllFonts",
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderRadius: 15,
    resizeMode: "contain",
  },
  captionContainer: {
    padding: RFValue(10),
  },
  captionText: {
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10),
    fontFamily: "AllFonts",
    fontWeight: "400",
  },

  // Light Theme

  lightContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  lightAppTitleText: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "SpectagramLogoFonts",
  },
  lightPostCard: {
    margin: RFValue(20),
    backgroundColor: "#eaeaea",
    borderRadius: RFValue(20),
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
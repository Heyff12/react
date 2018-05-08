/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons"; //图标库

// var List = require("./app/creation/index");
// var Edit = require("./app/edit/index");
// var Account = require("./app/account/index");
// var Login = require("./app/account/login");

import List from "./app/creation/index";
import Edit from "./app/edit/index";
import Account from "./app/account/index";
import Login from "./app/account/login";

import {
  Platform,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  AsyncStorage,
  NavigatorIOS //取消使用
} from "react-native";

var Props = {};

export default class App extends Component<Props> {
  constructor(Props) {
    super(Props);
    this.state = {
      selectedTab: "account",
      notifCount: 0,
      presses: 0,
      logined: false,
      user: null
    };
  }

  componentDidMount() {
    this._asyncAppStatus(); //获取数据
  }

  _asyncAppStatus() {
    AsyncStorage.getItem("user").then(data => {
      var user;
      var newState = {};
      if (data) {
        user = JSON.parse(data);
      }
      if (user && user.accessToken) {
        newState.user = user;
        newState.logined = true;
      } else {
        newState.logined = false;
      }
      this.setState(newState);
    });
  }

  // getInitialState() {
  //   return { selectedTab: "redTab", notifCount: 0, presses: 0 };
  // }

  _afterLogin(user) {
    user = JSON.stringify(user);
    AsyncStorage.setItem("user", user).then(() => {
      this.setState({
        logined: true,
        user: user
      });
    });
  }

  render() {
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin.bind(this)} />;
    }
    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          selected={this.state.selectedTab === "list"}
          onPress={() => {
            this.setState({
              selectedTab: "list"
            });
          }}
        >
          <NavigatorIOS
            style={{ flex: 1 }}
            initialRoute={{ component: List, title: "列表页面" }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          selected={this.state.selectedTab === "edit"}
          onPress={() => {
            this.setState({
              selectedTab: "edit"
            });
          }}
        >
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          selected={this.state.selectedTab === "account"}
          onPress={() => {
            this.setState({
              selectedTab: "account"
            });
          }}
        >
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  tabContent: {
    flex: 1,
    alignItems: "center"
  },
  tabText: {
    color: "white",
    margin: 50
  }
});

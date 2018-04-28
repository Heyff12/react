/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons"; //图标库

var List = require("./app/creation/index");
var Edit = require("./app/edit/index");
var Account = require("./app/account/index");

import {
  Platform,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS //取消使用
} from "react-native";

type Props = {};

export default class App extends Component<Props> {
  constructor(Props) {
    super(Props);
    this.state = { selectedTab: "list", notifCount: 0, presses: 0 };
  }

  // getInitialState() {
  //   return { selectedTab: "redTab", notifCount: 0, presses: 0 };
  // }

  render() {
    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          selected={this.state.selectedTab === "list"}
          onPress={() => {
            this.setState({ selectedTab: "list" });
          }}
        >
          <NavigatorIOS
            style={{ flex: 1 }}
            initialRoute={{
              component: List,
              title: "list"
            }}
            // configureScene={route => {
            //   return Navigator.SceneConfigs.FloatFromRight;
            // }}
            // renderScene={(route, navigator) => {
            //   var Compoent = route.component;
            //   return <Compoent {...route.params} navigator={navigator} />;
            // }}
          />
          {/* <List /> */}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          selected={this.state.selectedTab === "edit"}
          onPress={() => {
            this.setState({ selectedTab: "edit" });
          }}
        >
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          selected={this.state.selectedTab === "account"}
          onPress={() => {
            this.setState({ selectedTab: "account" });
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

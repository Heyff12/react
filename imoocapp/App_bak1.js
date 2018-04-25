/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, TabBarIOS, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
// var Icon = require("react-native-vector-icons");

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

class List extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>列表页面</Text>
      </View>
    );
  }
}
class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>制作页面</Text>
      </View>
    );
  }
}
class Account extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>账户页面</Text>
      </View>
    );
  }
}

//以下方式不能使用
// var List = React.createClass({
//   render: function() {
//     return (
//       <View style={styles.container}>
//         <Text>列表页面</Text>
//       </View>
//     );
//   }
// });
// var Edit = React.createClass({
//   render: function() {
//     return (
//       <View style={styles.container}>
//         <Text>制作页面</Text>
//       </View>
//     );
//   }
// });
// var Account = React.createClass({
//   render: function() {
//     return (
//       <View style={styles.container}>
//         <Text>账户页面</Text>
//       </View>
//     );
//   }
// });

type Props = {};

export default class App extends Component<Props> {
  constructor(Props) {
    super(Props);
    this.state = {
      selectedTab: "list",
      notifCount: 0,
      presses: 0
    };
  }

  // getInitialState() {
  //   return { selectedTab: "redTab", notifCount: 0, presses: 0 };
  // }

  // _renderContent(color: string, pageText: string, num?: number) {
  //   return (
  //     <View style={[styles.tabContent, { backgroundColor: color }]}>
  //       <Text style={styles.tabText}>{pageText}</Text>
  //       <Text style={styles.tabText}>
  //         {num} re-renders of the {pageText}
  //       </Text>
  //     </View>
  //   );
  // }

  render() {
    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          selected={
            this.state.selectedTab === "list" // title=""
          }
          onPress={() => {
            this.setState({ selectedTab: "list" });
          }}
        >
          <List />
          {/* {this._renderContent("#414A8C", "blue Tab")} */}
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
          {/* {this._renderContent("#783E33", "Red Tab", this.state.notifCount)} */}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          selected={
            this.state.selectedTab === "account" // title="More" // renderAsOriginal
          }
          onPress={() => {
            this.setState({ selectedTab: "account" });
          }}
        >
          <Account />
          {/* {this._renderContent("#21551C", "Green Tab", this.state.presses)} */}
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

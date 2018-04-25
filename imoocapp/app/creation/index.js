import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库

class List extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>列表页面</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

module.exports = List
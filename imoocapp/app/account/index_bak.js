import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库

class Account extends Component {
  constructor(props) {
    super(props);
    var row = this.props.row;
    this.state = { user: { nickname: "小四", times: 0 } };
  }

  componentDidMount() {
    var that = this;
    AsyncStorage.getItem("user")
      .then(data => {
        console.log(data);
        if (data) {
          data = JSON.parse(data);
        } else {
          data = that.state.user;
        }
        // data = JSON.parse(data);
        that.setState(
          {
            user: data
          },
          () => {
            data.times++;
            var userData = JSON.stringify(data);
            AsyncStorage.setItem("user", userData)
              .then(() => {
                console.log("save ok");
              })
              .catch(err => {
                console.log("save fail");
                console.log(err);
              });
          }
        );
      })
      .catch(err => {
        console.log("get fail");
        console.log(err);
        // var user = that.state.user;
        // user.times++;
        // var userData = JSON.stringify(user);
        // AsyncStorage.setItem("user", userData)
        //   .then(() => {
        //     console.log("save ok");
        //   })
        //   .catch(err => {
        //     console.log("save fail");
        //     console.log(err);
        //   });
      });

    // AsyncStorage.removeItem('user')
    // .then(()=>{
    //   console.log('remove ok')
    // })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.item, styles.item1]}>老大，开心吗</Text>
        <View style={[styles.item, styles.item2]}>
          <Text>老二，哈哈哈哈</Text>
        </View>
        <View style={[styles.item, styles.item3]}>
          <Text>老三，呵呵呵呵呵aaaa</Text>
        </View>
        <Text style={[styles.item, styles.item4]}>
          {this.state.user.nickname}笑了{this.state.user.times}
          次
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#F5FCFF"
    paddingTop: 30,
    paddingBottom: 80,
    backgroundColor: "orange",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center"
  },
  item1: {
    flex: 1,
    backgroundColor: "#ccc"
    // alignSelf: "flex-start"
  },
  item2: {
    flex: 2,
    backgroundColor: "#999"
    // alignSelf: "stretch"
  },
  item3: {
    flex: 1,
    backgroundColor: "#666"
    // alignSelf: "flex-end"
  },
  item4: {
    flex: 3,
    backgroundColor: "#666"
    // alignSelf: "flex-end"
  }
});

module.exports = Account;

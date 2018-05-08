import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput,
  Button,
  AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
import request from "../common/request";
import config from "../common/config";

class Login extends Component {
  constructor(props) {
    super(props);
    var row = this.props.row;
    this.state = { phoneNumber: "", codeSent: false, verifyCode:'' };
  }

  componentDidMount() {}

  _submit() {}

  _showVerifyCode() {
    this.setState({
      codeSent: true
    });
  }

  _sendVerifyCode() {
    var phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return AlertIOS.alert("手机号不能为空！");
    }
    var body = {
      phoneNumber: phoneNumber
    };
    var signupUrl = config.api.base + config.api.signup;
    request
      .post(signupUrl, body)
      .then(data => {
        if (data.success && data) {
          this._showVerifyCode();
        } else {
          AlertIOS.alert("获取验证码失败，请检查手机号是否正确");
        }
      })
      .catch(err => {
        console.log(err);
        AlertIOS.alert("获取验证码失败，请检查网络是否良好");
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder="输入手机号"
            autoCaptialize={"none"}
            autoCorrect={false}
            keyboradType={"number-pad"}
            style={styles.inputField}
            onChangeText={text => {
              this.setState({ phoneNumber: text });
            }}
          />
          {this.state.codeSent ? (
            <View style={styles.verifyCodeBox}>
              <TextInput
                placeholder="输入验证码"
                autoCaptialize={"none"}
                autoCorrect={false}
                keyboradType={"number-pad"}
                style={styles.inputField}
                onChangeText={text => {
                  this.setState({ verifyCode: text });
                }}
              />
            </View>
          ) : null}
          {this.state.codeSent ? (
            <Button
              style={styles.btn}
              title="登陆"
              color="#ee735c"
              onPress={this._submit.bind(this)}
            />
          ) : (
            <Button
              style={styles.btn}
              title="获取验证码"
              color="#ee735c"
              onPress={this._sendVerifyCode.bind(this)}
            />
          )}
        </View>
        {/* <Text style={[styles.item, styles.item1]}>老大，开心吗</Text>
        <View style={[styles.item, styles.item2]}>
          <Text>老二，哈哈哈哈</Text>
        </View>
        <View style={[styles.item, styles.item3]}>
          <Text>老三，呵呵呵呵呵aaaa</Text>
        </View>
        <Text style={[styles.item, styles.item4]}>
          {this.state.user.nickname}笑了{this.state.user.times}
          次
        </Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5FCFF"
  },
  signupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  },
  inputField: {
    // flex: 1,
    height: 40,
    padding: 5,
    color: "#666",
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 4
  },
  btn: {
    marginTop: 10,
    padding: 10,
    // backgroundColor: "transparent",
    borderColor: "#ee735c",
    borderWidth: 1,
    borderRadius: 4
  }
});

module.exports = Login;

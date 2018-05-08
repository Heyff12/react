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
// import { CountDownText } from "react-native-sk-countdown";
// import CountDownText from "react-native-sk-countdown";

class Login extends Component {
  constructor(props) {
    super(props);
    var row = this.props.row;
    this.state = {
      phoneNumber: "",
      codeSent: false,
      verifyCode: "",
      countingDone: false
    };
  }

  componentDidMount() {}

  _submit() {
    var phoneNumber = this.state.phoneNumber;
    var verifyCode = this.state.verifyCode;
    if (!phoneNumber || !verifyCode) {
      return AlertIOS.alert("手机号或验证码不能为空！");
    }
    var body = { phoneNumber: phoneNumber, verifyCode: verifyCode };
    var verifyUrl = config.api.base + config.api.verify;
    request
      .post(verifyUrl, body)
      .then(data => {
        if (data.success && data) {
          console.log("signin ok");
          console.log(data);
          this.props.afterLogin(data.data);
          // this._showVerifyCode();
        } else {
          AlertIOS.alert("登陆失败，请检查手机号或者验证码是否正确");
        }
      })
      .catch(err => {
        console.log(err);
        AlertIOS.alert("登陆失败，请检查网络是否良好");
      });
  }

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

  //倒计时结束
  _countdingDone() {
    this.setState({ countingDone: true });
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
            keyboardType={"number-pad"}
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
              {/* {this.state.countingDone ? (
                <Button
                  title="获取验证码"
                  style={styles.countBtn}
                  onPress={this._sendVerifyCode.bind(this)}
                />
              ) : (
                <CountDownText
                  style={styles.countBtn}
                  countType="seconds"
                  auto={
                    true // 计时类型：seconds / date
                  }
                  afterEnd={
                    this._countdingDone.bind(this) // 自动开始
                  }
                  timeLeft={
                    60 // 结束回调
                  }
                  step={
                    -1 // 正向计时 时间起点为0秒
                  }
                  startText="获取验证码"
                  endText="获取验证码"
                  intervalText={
                    sec => "剩余秒数:" + sec // 计时步长，以秒为单位，正数则为正计时，负数为倒计时 // 开始的文本 // 结束的文本
                  }
                />
              ) // 定时的文本回调
              } */}
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
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    color: "#fff",
    backgroundColor: "#ee735c",
    borderColor: "#ee735c",
    fontSize: 15,
    textAlign: "left",
    borderRadius: 2,
    fontWeight: "600"
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
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    borderWidth: 1,
    borderRadius: 4
  }
});

module.exports = Login;

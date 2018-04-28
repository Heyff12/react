import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
// import Video from "react-native-video";
// import VideoModel from "react-native-video";
// var Video = VideoModel.default;
var Video = require("react-native-video").default;
var width = Dimensions.get("window").width;

class Detail extends Component {
  constructor(Props) {
    super(Props);
    this.state = {
      rate: 1,
      muted: false,
      resizeMode: "contain",
      repeat: false,
      videoReady:false,
      videoProgress:0.01,
      videoToal:0,
      currentTime:0,
      data: Props.route.params.data
    };
  }

  _backToList() {
    this.props.navigator.pop();
  }

  _onLoadStarat() {
    console.log("load start");
  }

  _onLoad() {
    console.log("loads");
  }

  _onProgress(data) {
    console.log("load Progress");
    console.log(data);
    if(!this.state.videoReady){
      this.setState({ videoReady:true });
    }
    var duration = data.playableDuration
    var currentTime = data.currentTime
    var percent = Number((currentTime/duration).toFixed(2))
    this.setState({
      videoToal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    });

  }

  _onEnd() {
    console.log("end");
  }

  _onError(err) {
    console.log("err");
    console.log(err);
  }

  render() {
    return <View style={styles.container}>
        <Text onPress={this._backToList.bind(this)}>
          详情页面{this.state.data._id}
        </Text>
        <View style={styles.videoBox}>
          <Video ref="videoPlayer" source={{ url: this.state.data.video }} syle={styles.video} volume={5} paused={false} rate={this.state.rate} muted={this.state.muted} resizeMode={this.state.resizeMode} repeat={this.state.repeat} onLoadStart={this._onLoadStarat} onLoad={this._onLoad} onProgress={this._onProgress} onEnd={this._onEnd} onError={this._onError} />
          {!this.state.videoReady && <ActivityIndicator color="#ee735c" style={styles.loading} />}
          <View style={styles.progressBox}>
            <View style={[styles.progressBar,{width:width*this.state.videoProgress}]} />
          </View>
        </View>
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: "#000"
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: "#000"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 140,
    width: width,
    alignSelf: "center",
    backgroundColor: "transparent"
  },
  progressBox: {
    width:width,
    height:2,
    backgroundColor:'#ccc'
  },
  progressBar: {
    width:1,
    height:2,
    backgroundColor:'#ff6600'
  }
});

module.exports = Detail;

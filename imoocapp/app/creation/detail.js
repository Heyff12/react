import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
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
      videoLoaded: false, //视频是否加载好
      videoProgress: 0.01, //进度条进度
      videoToal: 0, //总时长
      currentTime: 0, //当前播放时长
      playing: false, //是否正在播放
      paused: false, //是否暂停
      videoOk: true, //视频是否正常
      data: Props.route.params.data
    };
  }

  _onLoadStarat() {
    console.log("load start");
  }

  _onLoad() {
    console.log("loads");
  }

  _onProgress(data) {
    console.log("load Progress");
    // console.log(data);
    var duration = data.playableDuration;
    var currentTime = data.currentTime;
    var percent = Number((currentTime / duration).toFixed(2));
    var newState = {
      videoToal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    };
    if (!this.state.videoLoaded) {
      newState.videoLoaded = true;
    }
    if (!this.state.playing) {
      newState.playing = true;
    }
    this.setState(newState);
    console.log(this.state.videoLoaded);
    console.log(this.state.playing);
  }

  _onEnd() {
    console.log("end");
    this.setState({ videoOk: false });
  }

  _onError(err) {
    console.log("err");
    console.log(err);
    this.setState({ videoProgress: 1, playing: false, paused: true });
  }

  _rePlay() {
    this.refs.videoPlayer.seek(0);
  }

  _pause() {
    if (!this.state.paused) {
      this.setState({ paused: true });
    }
  }

  _resume() {
    if (this.state.paused) {
      this.setState({ paused: false });
    }
  }

  _pop() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={this._pop.bind(this)}
            style={styles.backBox}
          >
            <Icon
              onPress={this._rePlay.bind(this)}
              name="ios-arrow-back"
              size={48}
              style={styles.backIcon}
            />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headTitle} numberOfflines={1}>
            视频详情页
          </Text>
        </View>
        <Text>
          详情页面{this.state.data._id}
        </Text>
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            source={{ uri: this.state.data.video }}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStarat.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />
          {!this.state.videoOk && (
            <Text style={styles.failText}>视频出错了！很抱歉</Text>
          )}
          {!this.state.videoLoaded ? (
            <ActivityIndicator color="#ee735c" style={styles.loading} />
          ) : null}
          {this.state.videoLoaded && !this.state.playing ? (
            <Icon
              onPress={this._rePlay.bind(this)}
              name="ios-play"
              size={48}
              style={styles.playIcon}
            />
          ) : null}
          {this.state.videoLoaded && this.state.playing ? (
            <TouchableOpacity
              onPress={
                this.state.paused
                  ? this._resume.bind(this)
                  : this._pause.bind(this)
              }
              style={styles.pauseBtn}
            >
              {this.state.paused && this.state.videoProgress < 1 ? (
                <Icon name="ios-play" size={48} style={styles.resumeIcon} />
              ) : (
                <Text />
              )}
            </TouchableOpacity>
          ) : null}
          <View style={styles.progressBox}>
            <View
              style={[
                styles.progressBar,
                { width: width * this.state.videoProgress }
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  header: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff"
  },
  backBox: {
    position: "absolute",
    left: 12,
    top: 32,
    width: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  headTitle: {
    width: width - 120,
    textAlign: "center"
  },
  backIcon: {
    color: "#999",
    fontSize: 20,
    marginRight: 5
  },
  backText: {
    color: "#999"
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
    width: width,
    height: 2,
    backgroundColor: "#ccc"
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: "#ff6600"
  },
  playIcon: {
    position: "absolute",
    top: 150,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 4,
    paddingLeft: 20,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    color: "#ed7b66",
    zIndex: 2000
  },
  pauseBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: 360,
    zIndex: 1000
  },
  resumeIcon: {
    position: "absolute",
    top: 150,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 4,
    paddingLeft: 20,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    color: "#ed7b66"
  },
  failText: {
    position: "absolute",
    left: 0,
    top: 140,
    width: width,
    alignSelf: "center",
    color: "#fff",
    backgroundColor: "transparent"
  }
});

module.exports = Detail;

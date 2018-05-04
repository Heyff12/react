import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  // ScrollView,
  ListView,
  TextInput,
  Modal,
  AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
import Button from "react-native-button"; //按钮
// import Video from "react-native-video";
// import VideoModel from "react-native-video";
// var Video = VideoModel.default;
var Video = require("react-native-video").default;
var width = Dimensions.get("window").width;
import request from "../common/request";
import config from "../common/config";

var cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
};

class Detail extends Component {
  constructor(Props) {
    super(Props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }); //判断是否发生变化
    this.state = {
      data: Props.route.params.data,
      dataSource: ds.cloneWithRows([]),
      rate: 1,
      muted: false,
      resizeMode: "contain",
      repeat: false,
      videoLoaded: false,
      videoProgress: 0.01,
      videoToal: 0,
      currentTime: 0,
      playing: false,
      paused: false,
      videoOk: true,
      comments: [],
      isLoadingTail: false,
      isRefreshing: false,
      animationType: "none",
      modalVisible: false,
      content: "",
      isSending: false
    }; //评论框是否显示 //评论内容 //当前详情页数据 //评论 //视频是否加载好 //进度条进度 //总时长:[] //当前播放时长 //是否正在播放 //是否暂停 //视频是否正常
  }

  _onLoadStarat() {
    console.log("load start");
  }

  _onLoad() {
    console.log("loads");
  }

  _onProgress(data) {
    // console.log("load Progress");
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
    // console.log(this.state.videoLoaded);
    // console.log(this.state.playing);
  }

  _onEnd() {
    console.log("end");
    this.setState({ playing: false });
  }

  _onError(err) {
    // console.log("err");
    // console.log(err);
    this.setState({
      videoProgress: 1,
      playing: false,
      paused: true,
      videoOk: false
    });
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

  componentDidMount() {
    this._fetchData();
  }

  // _fetchData() {
  //   var that = this;
  //   var url = config.api.base + config.api.comment;
  //   request
  //     .get(url, {
  //       id: 124,
  //       accessToken: "123a"
  //     })
  //     .then(data => {
  //       if (data && data.success) {
  //         var comments = data.data;
  //         if (comments && comments.length > 0) {
  //           that.setState({
  //             comments: comments,
  //             dataSource: that.state.dataSource.cloneWithRows(comments)
  //           });
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }

  _fetchData(page) {
    var that = this;
    this.setState({ isLoadingTail: true });

    request
      .get(config.api.base + config.api.comment, {
        accessToken: "1111",
        page: page,
        id: 124
      })
      .then(data => {
        if (data.success) {
          var items = cacheResults.items.slice();
          items = items.concat(data.data);
          cacheResults.nextPage += 1;
          cacheResults.items = items;
          cacheResults.total = data.total;
          setTimeout(() => {
            that.setState({
              isLoadingTail: false,
              dataSource: that.state.dataSource.cloneWithRows(
                cacheResults.items
              )
            });
          }, 2000);
        }
      })
      .catch(error => {
        this.setState({ isLoadingTail: false });

        console.error(error);
      });
  }

  _hasMore() {
    return cacheResults.items.length !== cacheResults.total;
  }

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return;
    }
    var page = cacheResults.nextPage;
    this._fetchData(page);
  }

  _renderFooter() {
    if (!this._hasMore() && cacheResults.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      );
    }
    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore} />;
    }
    return <ActivityIndicator style={styles.loadingMore} />;
  }

  _renderRow(row) {
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image
          style={styles.replyAvatar}
          source={{ uri: row.replyBy.avatar }}
        />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    );
  }

  _focus() {
    this._setModalVisible(true);
  }

  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    });
  }

  _blur() {}

  _closeModal() {
    this._setModalVisible(false);
  }

  _submit() {
    var that = this;
    if (!this.state.content) {
      return AlertIOS.alert("留言不能为空！");
    }
    if (this.state.isSending) {
      return AlertIOS.alert("正在评论中！");
    }
    this.setState(
      {
        isSending: true
      },
      () => {
        var body = {
          accessToken: "abc",
          creation: "1233",
          comment: this.state.content
        };
        var url = config.api.base + config.api.comment;
        request.post(url, body).then(data => {
          if (data && data.success) {
            var items = cacheResults.items.slice();
            var content = that.state.content;
            items = [
              {
                content: content,
                replyBy: {
                  avatar: "http://dummyimage.com/200x200/c2ea2d",
                  nickname: "哈哈哈呵呵"
                }
              }
            ].concat(items);
            cacheResults.items = items;
            cacheResults.tatal = cacheResults.tatal + 1;
            that.setState({
              isSending: false,
              dataSource: that.state.dataSource.cloneWithRows(
                cacheResults.items
              )
            });
            that._setModalVisible(false);
          }
        }).catch((err=>{
          console.log(err)
          that.setState({
            isSending: false
          });
          that._setModalVisible(false);
          AlertIOS.alert("留言失败，稍后重试！");
        }));
      }
    );
  }

  _renderHeader() {
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image
            style={styles.avatar}
            source={{ uri: this.state.data.author.avatar }}
          />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>
              {this.state.data.author.nickname}
            </Text>
            <Text style={styles.title}>{this.state.data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder="敢不敢评论一个"
              style={styles.content}
              multiline={true}
              onFocus={this._focus.bind(this)}
            />
          </View>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
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
        </View> */}
        {/* <Text>
          详情页面{this.state.data._id}
        </Text> */}
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
        {/* <ScrollView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        > */}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
        />
        {/* </ScrollView> */}
        <Modal
          animationType={"fade"}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this._setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <Icon
              onPress={this._closeModal.bind(this)}
              name="ios-close-outline"
              size={48}
              style={styles.closeIcon}
            />
            <View style={styles.comment}>
              <TextInput
                placeholder="敢不敢评论一个"
                style={styles.content}
                multiline={true} // onFocus={this._focus.bind(this)}
                // onBlur={this._blur.bind(this)}
                defaultValue={this.state.content}
                onChangeText={text => {
                  this.setState({ content: text });
                }}
              />
            </View>
          </View>
          <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>
            评论
          </Button>
        </Modal>
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
    height: width * 0.56,
    backgroundColor: "#000"
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: "#000"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 80,
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
    top: 110,
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
    top: 110,
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
    top: 90,
    width: width,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "transparent"
  },
  infoBox: {
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18
  },
  title: {
    fontSize: 16,
    marginTop: 8,
    color: "#666"
  },
  replyBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickname: {
    color: "#666"
  },
  replyContent: {
    marginTop: 4,
    color: "#666"
  },
  reply: {
    flex: 1
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: "#777",
    textAlign: "center"
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  comment: {
    paddingLeft: 2,
    // color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    // fontSize: 14,
    height: 80
  },
  listHeader: {
    marginTop: 10,
    width: width
  },
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  commentTitle: {},
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "#fff"
  },
  closeIcon: {
    alignSelf: "center",
    fontSize: 30,
    color: "#ee753c"
  },
  submitBtn: {
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginLeft:10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ee735c",
    borderRadius: 4,
    color: "#ee735c",
    fontSize: 16
  }
});

module.exports = Detail;

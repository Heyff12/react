import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
import request from "../common/request";
import config from "../common/config";
import Detail from "./detail";

var width = Dimensions.get("window").width;

var cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
};

class Item extends Component {
  constructor(props) {
    super(props);
    var row = this.props.row;
    this.state = {
      up: row.voted,
      row: row
    };
  }

  _up() {
    var that = this;
    var up = !this.state.up;
    var row = this.state.row;
    var url = config.api.base + config.api.up;

    var body = {
      id: row._id,
      up: up ? "yes" : "no",
      accessToken: "aaaa"
    };

    request
      .post(url, body)
      .then(data => {
        if (data.success && data) {
          that.setState({ up: up });
        } else {
          AlertIOS.alert("点赞失败，稍后重试");
        }
      })
      .catch(err => {
        console.log(err);
        AlertIOS.alert("点赞失败，稍后重试");
      });
  }

  render() {
    var row = this.state.row;
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <View style={styles.images}>
            <Image style={styles.thumb} source={{ uri: row.thumb }} />
            <Icon name="ios-play" size={28} style={styles.play} />
          </View>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name={this.state.up ? "ios-heart" : "ios-heart-outline"}
                size={28}
                style={[styles.up, this.state.up ? null : styles.down]}
              />
              <Text style={styles.handleText} onPress={this._up.bind(this)}>
                喜欢
              </Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon}
              />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      isLoadingTail: false,
      isRefreshing: false,
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    this._fetchData(1);
  }

  _fetchData(page) {
    var that = this;
    if (page !== 0) {
      this.setState({ isLoadingTail: true });
    } else {
      this.setState({ isRefreshing: true });
    }

    request
      .get(config.api.base + config.api.creations, {
        accessToken: "1111",
        page: page
      })
      .then(data => {
        if (data.success) {
          var items = cacheResults.items.slice();
          if (page !== 0) {
            items = items.concat(data.data);
            cacheResults.nextPage += 1;
          } else {
            items = data.data.concat(items);
          }
          cacheResults.items = items;
          cacheResults.total = data.total;
          setTimeout(() => {
            if (page !== 0) {
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(
                  cacheResults.items
                )
              });
            } else {
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(
                  cacheResults.items
                )
              });
            }
          }, 2000);
        }
      })
      .catch(error => {
        if (page !== 0) {
          this.setState({
            isLoadingTail: false
          });
        } else {
          this.setState({ isRefreshing: false });
        }

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

  _renderRow(row) {
    return (
      <Item row={row} key={row._id} onSelect={() => this._loadPage(row)} />
    );
  }

  _onRefresh() {
    if (this.state.isRefreshing || this._hasMore()) {
      return;
    }
    this._fetchData(0);
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

  _loadPage(row) {
    this.props.navigator.push({
      title: "视频详情页",
      component: Detail,
      params: {
        data: row
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff6600"
              title="拼命加载中……"
            />
          }
          onEndReachedThreshold={20}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={true}
        />
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
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600"
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  images: {
    width: width,
    height: width * 0.5,
    position: "relative"
  },
  thumb: {
    width: width,
    height: width * 0.5,
    resizeMode: "cover"
  },
  play: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#ed7b66"
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: "#333"
  },
  titleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee"
  },
  handleBox: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    width: width * 0.5 - 0.5,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: "#333"
  },
  up: {
    fontSize: 22,
    color: "#ed7b66"
  },
  down: {
    fontSize: 22,
    color: "#333"
  },
  commentIcon: {
    fontSize: 22,
    color: "#333"
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: "#777",
    textAlign: "center"
  }
});

module.exports = List;

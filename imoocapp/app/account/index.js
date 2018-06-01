import React, { Component } from "react";
import request from "../common/request";
import config from "../common/config";
import sha1 from 'sha1';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  Image,
  AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; //图标库
var width = Dimensions.get("window").width;
// var ImagePicker = require("NativeModules").ImagePickerManager;
// import { ImagePickerManager } from "NativeModules";
// import ImagePicker from "NativeModules";
// var ImagePicker = require("react-native-image-picker");
import ImagePicker from "react-native-image-picker";
// import { showImagePicker } from "react-native-image-picker";

var photoOptions = {
  title: "选择头像",
  cancelButtonTitle: "取消",
  takePhotoButtonTitle: "拍照",
  chooseFromLibraryButtonTitle: "选择相册",
  quality: "0.75",
  allowsEditing: true,
  noData: false,
  // storageOptions.skipBackup:false,
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

var CLOUDINARY = {
  cloud_name: "daq8ot1mc",
  api_key: "878444634363697",
  api_secret: "Ylqh74p3HE2dsq5KcVlASt8sd_U",
  base: "http://res.cloudinary.com/daq8ot1mc",
  image: "https://api.cloudinary.com/v1_1/daq8ot1mc/image/upload",
  video: "https://api.cloudinary.com/v1_1/daq8ot1mc/video/upload",
  audio: "https://api.cloudinary.com/v1_1/daq8ot1mc/raw/upload"
};

function avatar(id){
  return CLOUDINARY.base+'/'+type+'/upload/'+id
}

class Account extends Component {
  constructor(props) {
    super(props);
    var user = this.props.user || {};
    this.state = { user: user };
  }

  componentDidMount() {
    AsyncStorage.getItem("user").then(data => {
      var user;
      console.log(data);
      if (data) {
        user = JSON.parse(data);
      }
      // user.avatar = '';
      // AsyncStorage.setItem("user",JSON.stringify(user));
      if (user && user.accessToken) {
        this.setState({
          user: user
        });
      }
    });
  }

  _pickPhoto() {    
    console.log(ImagePicker);
    ImagePicker.showImagePicker(photoOptions, res => {
      console.log("Response = ", res);
      if (res.didCancel) {
        console.log("User cancelled image picker");
        return;
      }
      var avatarData = "data:image/jpeg;base64," + res.data;
      var user = this.state.user;
      user.avatar = avatarData;
      this.setState({ user: user });

      var timestamp = Date.now();
      var tags = "app,avatar";
      var folder = "avatar";
      var signatureURL = config.api.base + config.api.signature;
      var accessToken = this.state.user.accessToken;
      request
        .post(signatureURL, {
          accessToken: accessToken,
          timestamp: timestamp,
          type: "avatar"
        })
        .catch((err)=>{
          console.log(err)
        })
        .then(data => {
          console.log(data);
          if (data && data.success) {
            var signature =
              "folder=" +
              folder +
              "&tags=" +
              tags +
              "&timestamp=" +
              timestamp +
              CLOUDINARY.api_secret;
            signature = sha1(signature);
            var body = new FormData();
            body.append("folder", folder);
            body.append("signature", signature);
            body.append("timestamp", timestamp);
            body.append("tags", tags);
            body.append("api_key", CLOUDINARY.api_key);
            body.append("resource_type", "image");
            body.append("file", avatarData);
            this._upload(body);
          }
        });

      // if (res.didCancel) {
      //   console.log("User cancelled image picker");
      // } else if (res.error) {
      //   console.log("ImagePicker Error: ", res.error);
      // } else if (res.customButton) {
      //   console.log("User tapped custom button: ", res.customButton);
      // } else {
      //   let source = { uri: res.uri };

      //   // You can also display the image using data:
      //   // let source = { uri: 'data:image/jpeg;base64,' + res.data };

      //   this.setState({ avatarSource: source });
      // }
    });
  }

  _upload(body){
    var xhr = new XMLHttpRequest();
    var url = CLOUDINARY.image;

    xhr.open('POST',url)
    xhr.onload=()=>{
      if(xhr.status !== 200){
        AlertIOS.alert("请求失败");
        console.log(xhr.responseText)
        return
      }
      if(!xhr.responseText){
        AlertIOS.alert("请求失败");
        return;
      }
      var response;
      try {
        response = JSON.parse(xhr.response)
      }catch(e){
        console.log(e);
        console.log('parse fails')
      }

      if(response && response.public_id){
        var user = this.state.user
        user.avatar = avatar(response.public_id,'image');

        this.setState({
          user:user
        })

      }
    }
    xhr.send(body)
  }

  render() {
    var user = this.state.user;
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>
        {user.avatar ? (
          <TouchableOpacity
            onPress={this._pickPhoto.bind(this)}
            style={styles.avatarContainer}
          >
            {/* <Image style={styles.avatarBpc}> */}
            <View style={styles.avatarBox}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.avatarTip}>修改头像</Text>
            {/* </Image> */}
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarTip}>添加狗狗头像</Text>
            <TouchableOpacity
              style={styles.avatarBox}
              onPress={this._pickPhoto.bind(this)}
            >
              <Icon name="ios-cloud-upload-outline" style={styles.plusIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600"
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee"
  },
  // avatarContainerHas: {
  //   width: width,
  //   height: 140,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#eee"
  // },
  avatarTip: {
    color: "#666",
    backgroundColor: "transparent",
    fontSize: 14
  },
  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: "cover",
    borderRadius: width * 0.1
  },
  avatarBox: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: "#666",
    fontSize: 30,
    backgroundColor: "#fff",
    borderRadius: 6
  }
});

module.exports = Account;

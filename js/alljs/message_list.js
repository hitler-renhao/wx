var loading = '<img src="../images/loading.png" alt="" class="loading"></img>';
$('html').append(loading);
// 根据tokenkey请求接口获取账号密码
var tokenKey = localStorage.getItem('tokenKey');
var userId = localStorage.getItem('userId');
if (!tokenKey) {
  layer.msg('未登录', function () {
    location.href = 'login.html'
  })
}

function getUserAccounts() {
  $.ajax({
    // url: "http://192.168.1.8:8181/jiguang/jiGuangUser",
    url: global + "/jiguang/jiGuangUser",
    type: "get",
    data: {
      "tokenKey": tokenKey,
      'userId': userId
    },
    success: function (data) {
      // 获取登录账号密码成功
      if (data.code == 200) {
        var res = data.data;
        var account = [];
        account.push(res.jgAccount);
        account.push(res.jgPassword);
        login(account);
      } else if (data.code) {
        getUserAccount();
      }
    }
  });
}



function getUserAccount() {
  $.ajax({
    url: global + "/jiguang/registerUsers",
    // url: global + "/jiguang/registerUsers",
    type: "get",
    data: {
      "tokenKey": tokenKey,
      'userId': userId
    },
    success: function (data) {
      // 获取登录账号密码成功
      if (data.code == 200) {
        var res = data.data;
        localStorage.setItem('phone', res.jgAccount);
        localStorage.setItem('password', res.jgPassword);
        var account = [];
        account.push(res.jgAccount);
        account.push(res.jgPassword);
        login(account);
      } else if (data.code == 400) {
        layer.msg('注册失败,请稍后再试')
      }
    }
  });

}



function getUserName(names) {
  var name = new Array();
  $.ajax({
    url: global + "/jiguang/allUserInfo",
    type: "get",
    async: false,
    data: {
      'userName': names
    },
    success: function (data1) {
      // 获取用户信息成功
      if (data1.code == 200) {
        var allName = '',
          headImg = '';
        if (!!data1.data[0].shopData && !!data1.data[0].shopFile) {
          allName = data1.data[0].shopData.shopname;
          headImg = data1.data[0].shopFile.imagePath;
        } else if (!!data1.data[0].ekOptometristData && !!data1.data[0].ekOptometristData) {
          allName = data1.data[0].ekOptometristData.name;
          headImg = data1.data[0].ekOptometristData.image;
        } else if (!!data1.data[0].ekUserData && !!data1.data[0].ekUserData) {
          allName = data1.data[0].ekUserData.iphone;
          headImg = "../images/ek.png";
        }
        name[0] = allName;
        name[1] = headImg;
      }
    }
  });
  return name;
}

const across_appkey = '05eb50ccfeb67df023a67715';
const Secret = '8277c0514246381d4f42ba38';
var msg_id = 451732948;
JIM = new JMessage({
  debug: true
});

// 获取签名
$.ajax({
  url: global + "/jiguang/webSdkInit",
  type: "get",
  data: {
    "tokenKey": tokenKey
  },
  success: function (data) {
    console.log(data);
    // 获取登录账号密码成功
    if (data.code == 200) {
      var res = data.data;
      var appkey = res.appkey;
      var random_str = res.random_str;
      var signature = res.signature;
      var timestamp = res.timestamp;
      init(appkey, random_str, timestamp, signature);
    }
  }
});

// 初始化
function init(across_appkey, random_str, dateTime, signature) {
  JIM.init({
      // 开发者在极光平台注册的 IM 应用 appkey
      "appkey": across_appkey,
      // 20-36 长度的随机字符串, 作为签名加 salt 使用
      "random_str": random_str,
      // 当前时间戳，用于防止重放攻击，精确到毫秒
      "timestamp": dateTime,
      //  签名，10 分钟后失效（只针对初始化操作，初始化成功则之后的操作跟签名无关）
      "signature": signature,
      "flag": 1
    })
    // 初始化成功回调
    .onSuccess(function (data) {
      getUserAccounts();
    })
    // 初始化失败回调
    .onFail(function (data) {});
}



// 登录
function login(accounts) {
  var logName = accounts[0];
  var logPwd = accounts[1];
  JIM.login({
      'username': logName,
      // 'username': '18310215054',
      'password': logPwd
      // 'password': '111111'
    })
    // 登录成功
    .onSuccess(function (data) {
      // 聊天消息实时监听
      JIM.onMsgReceive(function (data) {});
      // 获取会话列表
      JIM.getConversation().onSuccess(function (data) {
        //data.code 返回码
        //data.message 描述
        //data.conversations[] 会话列表，属性如下示例
        //data.conversations[0].extras 附加字段
        //data.conversations[0].unread_msg_count 消息未读数
        //data.conversations[0].name  会话名称
        //data.conversations[0].appkey  appkey(单聊)
        //data.conversations[0].username  用户名(单聊)
        //data.conversations[0].nickname  用户昵称(单聊)
        //data.conversations[0].avatar  头像 media_id 
        //data.conversations[0].mtime 会话最后的消息时间戳
        //data.conversations[0].type  会话类型(3 代表单聊会话类型，4 代表群聊会话类型)
        var res = data.conversations;
        res = res.reverse();
        console.log(res);

        var str = '',
            nameAndHead = new Array();
        for (var i = 0; i < res.length; i++) {
          nameAndHead = getUserName(res[i].name);
          if (res[i].unread_msg_count != 0) {
            str =
              '<li user-name="' + res[i].name + '">' +
              '<a href="' + res[i].avatar + '" class="unseImg">' +
              '<img src="' + nameAndHead[1] + '" />' +
              '<span class="num">' + res[i].unread_msg_count + '</span>' +
              '</a>' +
              '<span class="userInfo">' +
              '<p class="name">' + nameAndHead[0] +
              '<b>' + format(res[i].mtime) + '</b>' +
              '</p>' +
              '<p class="news">' +
              '<number>' + res[i].unread_msg_count + '</number>条未读消息' +
              '</p>' +
              '</span>' +
              '</li>'
          } else {
            str =
              '<li user-name="' + res[i].name + '">' +
              '<a href="' + res[i].avatar + '" class="unseImg">' +
              '<img src="' + nameAndHead[1] + '" />' +
              '</a>' +
              '<span class="userInfo">' +
              '<p class="name">' + nameAndHead[0] +
              '<b>' + format(res[i].mtime) + '</b>' +
              '</p>' +
              '<p class="news">' +
              '<number>全部已读</number>' +
              '</p>' +
              '</span>' +
              '</li>'
          }
          $('.evalist').append(str);
          $('.loading').remove();
        }
      }).onFail(function (data) {
        //data.code 返回码
        //data.message 描述
      });

      // 聊天事件实时监听
      JIM.onEventNotification(function (data) {});

      // 离线消息同步监听
      JIM.onSyncConversation(function (data) {});

      // 用户信息变更监听
      JIM.onUserInfUpdate(function (data) {});

      // 业务事件同步监听
      JIM.onSyncEvent(function (data) {});

      // 会话未读数变更监听
      JIM.onMutiUnreadMsgUpdate(function (data) {});

      // 消息透传监听
      JIM.onTransMsgRec(function (data) {});
    })
    // 登录失败
    .onFail(function (data) {})
    .onTimeout(function (data) {});
}


// 发送单聊消息
/*
 * 
 * target_username ------ 接收消息者昵称
 * content -------------- 消息文本
 * msg_body ------------- 消息转发
 * target_nickname ------ 接收者的展示名
 * appkey --------------- 跨应用查询时必填，目标应用的 appkey
 * no_offline ----------- false，默认值，保存离线消息；true，不保存离线消息
 * no_notification ------ false，默认值，状态栏显示消息；true，状态栏不显示消息
 * need_receipt --------- 已读回执 需要:true 不需要:false
 * custom_notification -- 通知栏参数，见下表
 *   enabled =============== 是否启用自定义消息通知栏
 *   title ================= 通知栏标题
 *   alert ================= 通知栏内容
 *
 */
function sendSingleMsg() {
  $('.evalist li').on('click', '.evalist', function () {
    var target_username = $(this).attr('user-name');
  })
  JIM.sendSingleMsg({
      'target_username': target_username,
      'target_nickname': '123',
      'content': '6666666666666666666',
      // 'appkey': across_appkey,
      'no_offline': false,
      'no_notification': false,
      //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
      need_receipt: true
    })
    .onSuccess(function (data, msg) {})
    .onFail(function (data) {});
}


// 时间戳转日期时间
function add0(m) {
  return m < 10 ? '0' + m : m
}

function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  // return add0(h) + ':' + add0(mm) +  ':' + add0(s);
}

// 点击对话跳转
$('.evalist').on('click', 'li', function () {
  var userName = $(this).attr('user-name');
  location.href = 'Online_Service_B.html?user=' + userName;
})
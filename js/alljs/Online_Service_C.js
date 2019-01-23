var loading = '<img src="../images/loading.png" alt="" class="loading"></img>';
$('html').append(loading);
$(".khfxWarp").scrollTop($(".khfxWarp")[0].scrollHeight);
var tokenKey = localStorage.getItem('tokenKey');
var userId = localStorage.getItem('userId');
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


// C端获取登录账号密码
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
      console.log(data);
      // 获取登录账号密码成功
      if (data.code == 200) {
        var res = data.data;
        localStorage.setItem('c_username', res.jgAccount);
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

// var across_user = 'test0022';
const across_appkey = '05eb50ccfeb67df023a67715';
const Secret = '8277c0514246381d4f42ba38';
// var target_nickname = 'xuqiin1';
// var gid = 23364029;   // 群ID
// var target_gname = 'xu_test';
// var msg_ids = [56562546, 57865421, 45875642, 14236589];   // 消息回执ID
var msg_id = 451732948; // 发送成功后的消息ID
// var room_id = 68;
// 获取当前对话个人账号
var href = location.href;
var ids = href.split('?')[1].split('=')[0];
var shopId = href.split('?')[1].split('=')[1];
// 判断是店铺还是验光师
if (ids == 'infoId') {
  // 通过infoId获取用户userId
  $.ajax({
    url: global + "/jiguang/jiGuangOptometristUser",
    type: "get",
    data: {
      "tokenKey": tokenKey,
      'optometristId': shopId
    },
    success: function (data) {
      var userId = data.msg;
      // 获取登录账号密码成功
      if (data.code == 200) {
        // var userId = localStorage.getItem('userId');
        // 通过userId 获取username
        $.ajax({
          url: global + "/jiguang/registerUsers",
          type: "get",
          data: {
            "tokenKey": tokenKey,
            'userId': userId
          },
          success: function (data) {
            console.log(data);
            // 获取登录账号密码成功
            if (data.code == 200) {
              var username = data.data.jgAccount
              localStorage.setItem('b_username', username);
            }
          }
        });
      }
    }
  });
  // 获取顶部验光师姓名
  $.ajax({
    url: global + "/optometrist/queryByOptometristId",
    type: "post",
    data: {
      'optometristId': shopId
    },
    success: function (data) {
      console.log(data);
      // 获取登录账号密码成功
      if (data.code == 200) {
        $('.title').text(data.data.name);
      }
    }
  });
  $.ajax({
    url: global + "/jiguang/registerUsers",
    type: "get",
    data: {
      "tokenKey": tokenKey,
      'userId': userId
    },
    success: function (data) {
      console.log(data);
      // 获取登录账号密码成功
      if (data.code == 200) {
        var username = data.data.jgAccount
        localStorage.setItem('b_username', username);
      }
    }
  });
} else {
  // 通过shopId获取用户userId
  $.ajax({
    url: global + "/jiguang/jiGuangShopUser",
    type: "get",
    data: {
      "tokenKey": tokenKey,
      'shopId': shopId
    },
    success: function (data) {
      console.log('11111111111' + data);
      var userId = data.msg;
      localStorage.setItem('B_userId', userId);
      // 获取登录账号密码成功
      if (data.code == 200) {
        // 通过userId 获取username
        $.ajax({
          url: global + "/jiguang/registerUsers",
          type: "get",
          data: {
            "tokenKey": tokenKey,
            'userId': userId
          },
          success: function (data) {
            console.log(data);
            // 获取登录账号密码成功
            if (data.code == 200) {
              var username = data.data.jgAccount
              localStorage.setItem('b_username', username);
              // 获取顶部验光师姓名
              $.ajax({
                url: global + "/jiguang/allUserInfo",
                type: "get",
                async: false,
                data: {
                  'userName': username
                },
                success: function (data) {
                  // 获取用户信息成功
                  if (data.code == 200) {
                    console.log(data);
                    $('.title').text(data.data[0].shopData.shopname);
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}



// 通过username获取头像

function getHeader(username) {
  var headImg = '';
  $.ajax({
    url: global + "/jiguang/allUserInfo",
    type: "get",
    async: false,
    data: {
      'userName': username
    },
    success: function (data) {
      // 获取用户信息成功
      if (data.code == 200) {
        console.log(data);
        if (!!data.data[0].shopData) {
          headImg = data.data[0].shopFile.imagePath;
        } else if (!!data.data[0].ekOptometristData) {
          headImg = data.data[0].shopData.image;
        } else if (!!data.data[0].ekUserData) {
          headImg = "../images/ek.png";
        }
      }
    }
  });
  return headImg;
}

JIM = new JMessage({
  debug: true
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
      getUserAccount();
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
      // 'username': 18310215054,
      'password': logPwd
      // 'password': 111111

    })
    // 登录成功
    .onSuccess(function (data) {
      $('.loading').remove();
      localStorage.setItem('c_username', logName)
      // 聊天消息实时监听
      JIM.onMsgReceive(function (data) {
        // console.log(data.messages);

        var b_username = localStorage.getItem('b_username');
        console.log(b_username);

        var headImgLeft = getHeader(b_username);
        if (data.messages[0].content.from_id == b_username) {
          var strOther = '';
          strOther +=
            '<li>' +
            '<img src="' + headImgLeft + '" class="user" />' +
            '<div class="left">' +
            '<div class="chatLeft1">' + data.messages[0].content.msg_body.text +
            '<div class="arrow1"></div>' +
            '</div>' +
            '</li>'
          $('.evalist').append(strOther);
          /* 点击发送看到消息 */
          console.log(data);

          ($('.evalist').children("li:last-child")[0]).scrollIntoView();
          if (!data.messages[0].content.msg_body) {
            return false;
          }
          //有内容继续
          //  $('.evalist').append('<li>' + content + '</li>');
          setTimeout(function () {
            ($('.evalist').children("li:last-child")[0]).scrollIntoView();
          }, 100);
          /*-------*/
        }



      });



      // 聊天事件实时监听
      JIM.onEventNotification(function (data) {
        // console.log('event_receive: ' + JSON.stringify(data));
      });

      // 离线消息同步监听
      JIM.onSyncConversation(function (data) { //离线消息同步监听
        // 遍历所有消息 选出双方对话信息
        var b_username = localStorage.getItem('b_username');
        var c_username = localStorage.getItem('c_username');
        var headImgLeft = getHeader(b_username);
        var headImgRight = getHeader(c_username);

        for (var i = 0; i < data.length; i++) {
          if (data[i].from_username == b_username) {
            console.log(data[i].msgs)
            // 遍历双方对话信息 判断消息出自于哪一方
            for (var j = 0; j < data[i].msgs.length; j++) {
              var strleft = '';
              // 获取当前时间戳
              var nowTime = new Date().getTime();
              // 判断当前时间和过往消息时间间隔
              // if (data[i].msgs.ctime_ms - data[i - 1].msgs.ctime_ms > 1000) {

              // }
              // 判断消息出自于哪一方
              if (data[i].msgs[j].content.from_id == b_username) {
                strleft +=
                  '<li>' +
                  '<img src="' + headImgLeft + '" class="user" />' +
                  '<div class="left">' +
                  '<div class="chatLeft1">' + data[i].msgs[j].content.msg_body.text +
                  // '<img src="../images/emoji/3030.png" alt=""></img>' +
                  '<div class="arrow1"></div>' +
                  '</div>' +
                  '</div>' +
                  '</li>'
              } else if (data[i].msgs[j].content.from_id == c_username) {
                strleft +=
                  '<li class="liRight">' +
                  '<img src="' + headImgRight + '" class="user1" />' +
                  '<div class="right">' +
                  '<div class="chatLeft">' + data[i].msgs[j].content.msg_body.text +
                  '<div class="arrow"></div>' +
                  '</div>' +
                  '</div>' +
                  '</li>'
              }
              $('.evalist').append(strleft);
            }
          }
        }
        ($('.evalist').children("li:last-child")[0]).scrollIntoView();
        if (data.length == 0) {
          return false;
        }
        //有内容继续
        //  $('.evalist').append('<li>' + content + '</li>');
        setTimeout(function () {
          ($('.evalist').children("li:last-child")[0]).scrollIntoView();
        }, 100);
        /*-------*/
      });

      // 用户信息变更监听
      JIM.onUserInfUpdate(function (data) {
        console.log('onUserInfUpdate : ' + JSON.stringify(data));
      });

      // 业务事件同步监听
      JIM.onSyncEvent(function (data) {
        console.log('onSyncEvent : ' + JSON.stringify(data));
      });

      // 会话未读数变更监听
      JIM.onMutiUnreadMsgUpdate(function (data) {
        console.log('onConversationUpdate : ' + JSON.stringify(data));

      });

      // 消息透传监听
      JIM.onTransMsgRec(function (data) {
        console.log('onTransMsgRec : ' + JSON.stringify(data));
      });
    })
    // 登录失败
    .onFail(function (data) {
      console.log('error:' + JSON.stringify(data));
    }).onTimeout(function (data) {
      console.log('timeout:' + JSON.stringify(data));
    });
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
  var content = $('.word').val();
  var b_username = localStorage.getItem('b_username');
  $('.word').val('');
  JIM.sendSingleMsg({
      'target_username': b_username,
      // 'target_nickname': '123',
      'content': content,
      // 'appkey': across_appkey,
      'no_offline': false,
      'no_notification': false,
      //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
      'need_receipt': true
    })
    .onSuccess(function (data, msg) {
      //data.code 返回码
      //data.message 描述
      //data.msg_id 发送成功后的消息 id
      //data.ctime_ms 消息生成时间,毫秒
      //data.appkey 用户所属 appkey
      //data.target_username 用户名
      //msg.content 发送成功消息体,见下面消息体详情
      // console.log('success data:' + JSON.stringify(data));
      // console.log('succes msg:' + JSON.stringify(msg));
      if (data.code == 0) {
        var c_username = localStorage.getItem('c_username')

        var headImgRight = getHeader(c_username);
        // var yourName = getHeader(c_username);
        var str = '';
        // 发送成功
        str +=
          '<li class="liRight">' +
          '<img src="' + headImgRight + '" class="user1" />' +
          '<div class="right">' +
          '<div class="chatLeft">' + msg.content.msg_body.text +
          '<div class="arrow"></div>' +
          '</div>' +
          '</div>' +
          '</li>'
        $('.evalist').append(str);
        /* 点击发送看到消息 */
        // ($('.evalist').children("li:last-child")[0]).scrollIntoView();
        if (!msg.content.msg_body.text) {
          return false;
        }
        //有内容继续
        //  $('.evalist').append('<li>' + content + '</li>');
        setTimeout(function () {
          ($('.evalist').children("li:last-child")[0]).scrollIntoView();
        }, 100);
        /*-------*/
        var names = localStorage.getItem('iphone');
        names = names.slice(0, 3) + '****' + names.slice(names.length - 4, names.length);
        // var b_username = localStorage.getItem('b_username')
        // const url = 'http://test.bjysjglasses.com/ek/web/html/message_list.html'
        const url = 'http://wx.bjysjglasses.com/ek/web/html/message_list.html'
        var b_username = localStorage.getItem('b_username');
        $.ajax({
          url: global + "/jiguang/allUserInfo",
          type: "get",
          async: false,
          data: {
            'userName': b_username
          },
          success: function (data) {
            // 获取用户信息成功
            if (data.code == 200) {
              console.log(data);
              $.ajax({
                url: global + '/wechat/userMsgRemind',
                type: "post",
                async: false,
                data: {
                  'tokenKey': tokenKey,
                  'userId': data.data[0].ekJguserData.userId,
                  'url': url,
                  'userName': names
                },
                success: function (data) {}
              })
            }
          }
        });
      }
      console.log(data);
      console.log(msg)
    })
    .onFail(function (data) {
      console.log(data);

    });
}
$(function () {
  //获取tokenKey
  var style1 = '';
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  /* 默认展示 */
  $('.all').css({
      'display': 'block'
    }).siblings()
    .css({
      'display': 'none'
    });
  notPay(2, $('#all'));
  /* tab切换 */
  /* 
   *
   *    -2,-1,0,1已完成
   *    2待付款
   *		3,4,5待收货
   *		6待评价
   *
   */
  // 待付款
  $('.allOrder').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.all').css({
        'display': 'block'
      })
      .siblings()
      .css({
        'display': 'none'
      });
    // 使用支付单ID调待付款接口
    notPay(2, $('#all'));
  })
  // 待收货
  $('.waitPay').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.waitPay2').css({
        'display': 'block'
      }).siblings()
      .css({
        'display': 'none'
      });
    meal('3,4,5', $('#waitPay1'));
  })
  // 已完成
  $('.complete').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.complete2').css({
        'display': 'block'
      }).siblings()
      .css({
        'display': 'none'
      });
    meal('-2,-1,0,1', $('#complete1'));
  })
  // 待评价
  $('.waitColect').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.waitColect2').css({
        'display': 'block'
      }).siblings()
      .css({
        'display': 'none'
      });
    meal('6', $('#waitColect1'));
  })
  /* tab切换结束 */


  /* 支付单 */
  function notPay(userType, litxt) {
    $.ajax({
      type: "get",
      url: global + '/ekProductOrder/payOrderList',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "userId": userId
      },
      success: function (data) {
        if (data.code == 200) {
          var res = data.data;
          litxt.empty();
          var str = '';
          for (var i = 0; i < res.length; i++) {
            console.log(res[i].ekProductOrderList);
            console.log(res[i].ekProductPorder);
            if (res[i].ekProductOrderList.length != 0) {
              str += '<div class="content" payOrderId="' + res[i].ekProductPorder.id + '" status="3" userid="' + res[i].ekProductPorder.userId + '">'

              for (var j = 0; j < res[i].ekProductOrderList.length; j++) {
                var productJson = JSON.parse(res[i].ekProductOrderList[j].productJson)
                // console.log(res[i].ekProductOrderList[j].id);

                str += '<div orderid="' + res[i].ekProductOrderList[j].id + '" class="order_id">'
                str += '<div class="clicks" orderid="' + res[i].ekProductOrderList[j].id + '">' +
                  '<aside class="man-cloth">'
                if (res[i].ekProductOrderList[j].obtainMode == '0') {
                  str += '<strong>' + res[i].ekProductOrderList[j].shopName + '</strong>'
                } else if (res[i].ekProductOrderList[j].obtainMode == '1') {
                  str += '<strong>' + res[i].ekProductOrderList[j].shopName + '<i class="self">自提订单</i></strong>'
                }

                countDown(res[i].ekProductPorder.created, "#demo" + i * 10 + j + " .minute", "#demo" + i * 10 + j + " .second");

                str += '<div class="colockbox" id="demo' + i * 10 + j + '" style=" position: absolute; top: 0; left: 3rem;">剩余付款时间: ' +
                  '<span class="minute">-</span> : ' +
                  '<span class="second">-</span>' +
                  '</div>' +


                  '<span class="exchange">待付款 <i> ></i> </span>' +
                  '</aside>'
                for (var k = 0; k < productJson.length; k++) {
                  str += '<div class="body_box" style="">' +
                    '<div class="payment_center">' +
                    '<a href="javascript:;" class="picture">' +
                    '<img src="' + productJson[k].imgUrl + '" alt="" />' +
                    '</a>' +
                    '<div class="z_word">' +
                    '<p>' + productJson[k].productName + '</p>' +
                    '</div>' +
                    '<div class="z_word">' +
                    '<p>' + productJson[k].spectName + '</p>' +
                    '</div>' +
                    '<div class="num">x' + productJson[k].count + '</div>' +
                    '</div>' +
                    '</div>'
                }
                str += '</div>'
                str += '</div>'
              }
              str += '<div class="price">' +
                '<p>共' + res[i].ekProductPorder.orderCount + '件商品 合计: <i> ' + res[i].ekProductPorder.porderTotalPrice.toFixed(2) + '</i></p>' +
                '</div>' +
                '<div class="confirms">' +
                '<button class="payment confirm">立即付款</button>' +
                '<button class="cancelss">取消订单</button>' +
                '</div>' +
                '</div>'
            }

          }
          litxt.append(str);
        } else if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = '../html/login.html';
          })
        }
      }
    })
  }

  /* 订单 */
  function meal(userType, litxt) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/list',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "pageNum": 1,
        "pageSize": 100,
        "isShop": 'user',
        "state": userType
      },
      success: function (data) {
        if (data.code == 200) {
          console.log(JSON.parse(data.data.records[0].productJson));
          litxt.empty();
          var res = data.data;
          var str = '';
          var totalCount = 0;
          for (var i = 0; i < res.records.length; i++) {
            var products = JSON.parse(data.data.records[i].productJson);
            var shopJson = JSON.parse(data.data.records[i].shopJson);
            console.log(shopJson);

            switch (userType) {
              case '3,4,5':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="3" userid="' + res.records[i].userId + '">'
                break;
              case '-2,-1,0,1':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="4" userid="' + res.records[i].userId + '">'
                break;
              case '6':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="5" userid="' + res.records[i].userId + '">'
                break;
            }
            str += '<div class="clicks">' +
              '<aside class="man-cloth">'
            if (res.records[i].obtainMode == '0') {
              str += '<strong style="">' + shopJson.shopname + '</strong>'
            } else if (res.records[i].obtainMode == '1') {
              str += '<strong>' + shopJson.shopname + '<i class="self">自提订单</i></strong>'
            }
            switch (userType) {
              case '3,4,5':
                str += '<span class="exchange">待收货 <i> ></i> </span>'
                break;
              case '-2,-1,0,1':
                if (res.records[i].obtainMode == '1') {
                  str += '<span class="exchange">已完成 <i> ></i> </span>'
                } else if (res.records[i].obtainMode == '0') {
                  str += '<span class="exchange">已完成 <i> ></i> </span>'
                }
                break;
              case '6':
                str += '<span class="exchange">待评价 <i> ></i> </span>'
            }
            console.log(products);


            str += '</aside>' +
              '<div class="body_box" style="">'
            for (j = 0; j < products.length; j++) {
              str += '<div class="payment_center" data-id="' + products[j].porderId + '">' +
                '<a href="javascript:;" class="picture">' +
                '<img src="' + products[j].imgUrl + '" alt="" />' +
                '</a>' +
                '<div class="z_word">' +
                '<p>' + products[j].productName + '</p>' +
                '</div>' +
                '<div class="z_word">' +
                '<p>' + products[j].spectName + '</p>' +
                '</div>' +
                '<div class="num">x' + products[j].count + '</div>' +
                '</div>'
              console.log(products[j].count);
              totalCount += products[j].count;
            }
            // console.log(res.records[0].orderTotalPrice);

            str += '<div class="price">' +
              '<p>共' + totalCount + '件商品 合计: <i> ' + res.records[i].orderTotalPrice.toFixed(2) + '</i></p>' +
              '</div>' +
              '</div>' +
              '</div>'

            switch (userType) {
              case '3,4,5':
                if (res.records[i].orderStatus == '5') {
                  str += '<div class="confirms">' +
                    '<button class="contact confirm">确认收货</button>' +
                    '<button class="cancel">取消订单</button>' +
                    '</div>';
                } else {
                  str += '<div class="confirms">' +
                    '<button class="cancel">取消订单</button>' +
                    '</div>';
                }
                break;
              case '-2,-1,0,1':
                str += '<div class="confirms">' +
                  '<button class="completed">已完成</button>' +
                  '</div>';
                break;
              case '6':
                str += '<div class="confirms">' +
                  '<button class="evaluate">立即评价</button>' +
                  '</div>';
                break;

            }
            str += '</div>'
          }
          litxt.append(str);
        } else if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = '../html/login.html';
          })
        }
      }
    })
  }

  /* 待付款取消订单 */
  $('#container').on('click', '.cancelss', function () {
    let payOrderId = $(this).parent().parent().attr('payOrderId')
    // 确定
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/cancelPayOrder',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "payOrderId": payOrderId
      },
      success: function (data) {
        if (data.code == 200) {
          layer.msg(data.msg);
          setTimeout(function () {
            location.reload();
          }, 1000)
        } else if (data.code == 400) {
          layer.msg('网络似乎开小差了');
        }
      }
    })
  })

  /* 取消订单 */
  $('#container').on('click', '.cancel', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/cancelOrder',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "orderId": orderId,
        // "orderRemark": orderRemark
      },
      success: function (data) {
        if (data.code == 200) {
          layer.msg(data.msg);
          setTimeout(function () {
            location.reload();
          }, 1000)
          // location.reload();
        } else if (data.code == 400) {
          layer.msg('网络似乎开小差了');
        }
      }
    })
  })
  /* 取消订单结束 */

  /* 确认收货 */
  $('#container').on('click', '.contact', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    updateOrderState('6', orderId)
  })
  /* 确认收货结束 */

  /* 立即评价 */
  $('#container').on('click', '.evaluate', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    location.href = "Evaluation_baskSingle.html?orderId=" + orderId;
  })
  /* 立即评价结束 */

  function updateOrderState(state, productOrderId) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/updateOrderState',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "state": state,
        "productOrderId": productOrderId
      },
      success: function (data) {
        if (data.code == 200) {
          if (state == '0') {
            layer.msg('订单已取消', function () {
              location.reload();
            })
          } else if (state == '6') {
            layer.msg('确认收货成功', function () {
              location.reload();
            })
          }
        } else if (data.code == 400 && data.msg == '您不满足取消订单要求，请您核对订单！') {
          layer.msg('商家已接单, 您不能取消订单!', function () {
            location.reload();
          })
        }
      }
    })
  }

  /* 跳转订单详情页 */
  $('body').on('click', '.clicks', function () {
    let orderId = $(this).parent().attr('orderid');
    location.href = 'fill_order_detail.html?orderId=' + orderId;
  })

  /* 立即付款 */
  $('#container').on('click', '.payment', function () {
    // 结算
    let order_id = $(this).parent().parent().attr('payorderid')
    H5Pay(order_id);
  })

  function H5Pay(orderId) {
    var openid = localStorage.getItem('openId');
    $.ajax({
      type: "post",
      url: global + "/wechatpay/weChatH5Pay",
      dataType: "json",
      async: 'true',
      data: {
        "body": "商品订单-" + orderId,
        "openId": openid,
        'outTradeNo': orderId,
        'tokenKey': tokenKey
      },
      success: function (data) {
        if (data.code == 200) {
          var res = data.data;
          setTimeout(function () {
            onBridgeReady(res);
          }, 500)
        } else {
          layer.msg('您所处的网络环境不佳!')
        }
      }
    });

    function onBridgeReady(res) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": res.appId,
          "timeStamp": res.timeStamp,
          "nonceStr": res.nonceStr,
          "package": res.package,
          "signType": 'MD5',
          "paySign": res.paySign
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            location.href = 'fill_order_list_C.html'
          } else if (res.err_msg == "total_fee") {
            alert('付款失败!')
          }
        }
      );
    }
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  }

  // 倒计时
  function countDown(time, minute_elem, second_elem) {
    let firstTime = time.split('T')[0]
    let secondTime = time.split('T')[1]
    let year = firstTime.split('-')[0];
    let month = firstTime.split('-')[1];
    let day = firstTime.split('-')[2];
    timeStrampe = year + '/' + month + '/' + day + ' ' + secondTime;

    //if(typeof end_time == "string")
    var end_time = new Date(timeStrampe).getTime(), //月份是实际月份-1    
      //current_time = new Date().getTime(),
      sys_second = (end_time + 1800000 - new Date().getTime()) / 1000;
    var timer = setInterval(function () {
      if (sys_second > 0) {
        sys_second -= 1; // 每次减10毫秒, 防止用户看到立即支付按钮及倒计时文字
        var minute = Math.floor((sys_second / 60) % 60);
        var second = Math.floor(sys_second % 60);
        $(minute_elem).text(minute < 10 ? "0" + minute : minute); //计算分
        $(second_elem).text(second < 10 ? "0" + second : second); // 计算秒  
      } else {
        $(minute_elem).parent().parent().parent().parent().parent().remove();
        clearInterval(timer);
      }
    }, 1000); // 10毫秒刷新一次

  }

})
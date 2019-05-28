$(function () {
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var productOrderId = location.href.split('?')[1].split('=')[1];
  var finish = {
    init: function () {
      this.orderStatus = "";
      this.btn1 = '';
      this.btn2 = '';
      this.style = '';
      this.style2 = '';
      this.orderStatusText = '';
      //this.orderId = "";
      this.orderFinish();
      // this.getUserId();
      this.Pay();
    },
    orderFinish: function () {
      var that = this;
      $.ajax({
        type: "post",
        url: global + '/ekProductOrder/productOrderInfo',
        dataType: "json",
        async: false,
        data: {
          "tokenKey": tokenKey,
          "productOrderId": productOrderId
        },
        success: function (data) {
          console.log(data);
          var res = data.data;

          /* header */
          var header = '';
          // if (res.order.orderStatus == '0')
          switch (res.order.orderStatus) {
            case '-2':
            case '-1':
            case '0':
              header += '<text>' +
                '<h2>已取消</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '1':
              header += '<text>' +
                '<h2>已完成</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '2':
              countDown(res.order.createTime, ".timer .minute", ".timer .second")
              header += '<text>' +
                '<h2 class="porderId" porderId="' + res.order.porderId + '">待付款</h2>' +
                '<p><i class="timer">剩' +
                '<span class="minute">-</span> : ' +
                '<span class="second">-</span>' +
                '订单关闭</i></p>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '3':
              header += '<text>' +
                '<h2>待接单</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '4':
              header += '<text>' +
                '<h2>待发货</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '5':
              header += '<text>' +
                '<h2>待收货</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
            case '6':
              header += '<text>' +
                '<h2>待评价</h2>' +
                '</text>' +
                '<img src="../images/wallet.png" alt="">';
              break;
          }
          $('header').append(header)



          var str = '';
          str += '<!-- 商品信息 -->' +
            '<ul id="goods_infor">'
          switch (res.order.orderStatus) {
            case '-2':
            case '-1':
            case '0':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">已取消</i></h2>'
              break;
            case '1':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">已完成</i></h2>'
              break;
            case '2':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待付款</i></h2>'
              break;
            case '3':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待接单</i></h2>'
              break;
            case '4':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待发货</i></h2>'
              break;
            case '5':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待收货</i></h2>'
              break;
            case '6':
              str += '<h2><i style="float: left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待评价</i></h2>'
              break;
          }
          console.log(JSON.parse(res.order.productJson));
          let productJson = JSON.parse(res.order.productJson);
          for (var i = 0; i < productJson.length; i++) {
            str += '<li goods_id="123456">' +
              '<div class="goodsImg">' +
              '<img src="' + productJson[i].imgUrl + '">' +
              '</div>' +
              '<div class="infor">' +
              '<p class="name">' + productJson[i].productName + '</p>' +
              '<p class="name">' + productJson[i].spectName + '</p>' +
              '<p class="price red">￥' + productJson[i].totalPrice + '</p>' +
              '<p class="num">x' + productJson[i].count + '</p>' +
              '</div>' +
              '</li>'
          }

          if(res.order.orderPayPrice===null){
             res.order.orderPayPrice='0.00';       
          }
          str += '</ul>' +
            '<!-- 订单信息 -->' +
            '<ul id="order_infor">' +
            '<li class="total">' +
            '<p>优惠券优惠金额 <span class="fr order_info">￥'+(Number(res.order.orderTotalPrice) - Number(res.order.orderPayPrice)).toFixed(2)+'</span></p>' +
            // '<p>满减金额 <span class="fr order_info">¥0.00</span></p>' +
            '<p>运费 <span class="fr order_info">¥0.00</span></p>' +
            '<p>订单总金额 <span class="fr order_info">¥' + res.order.orderTotalPrice.toFixed(2) + '</span></p>' +
            '</li>' +
            '<li>' +
            '<span class="payable">应付金额：</span>' +
            '<span class="money fr">¥' + res.order.orderPayPrice.toFixed(2) + '</span>' +
            										//
            '</li>' +

            '</ul>' +
            '<!-- 收货方式 -->' +
            '<ul id="way">' +
            '<aside>商家信息</aside>' +
            '<li>' +
            '<p><i>门店名称: </i> <i>' + res.order.shopName + '</i> </p>' +
            '</li>' +
            '<li>'
          // 获取门店地址
          $.ajax({
            url: global + '/shop/queryShopByShopId',
            type: "post",
            dataType: "json",
            async: false,
            data: {
              "shopId": res.order.shopId
            },
            success: function (data) {
              let shop = data.data.shop;
              let address = shop.addresInfo.split(',')[0] + shop.addresInfo.split(',')[1] + shop.addresInfo.split(',')[2] + shop.addres;
              str += '<p><i>门店地址: </i> <i>' + address + '</i> </p>';
              localStorage.setItem('phoneNumber', shop.phone)
              localStorage.setItem('shopName', shop.shopname)
              localStorage.setItem('shopAddress', address)
              localStorage.setItem('latitude', shop.latitude)
              localStorage.setItem('longitude', shop.longitude)
              console.log(shop.phone);

            }
          })
          let phoneNumber = localStorage.getItem('phoneNumber')
          str += '</li>' +
            '<li>' +
            '<p><i>下单时间: </i> <i>' + data.data.order.createTime.split('T')[0] + ' ' + data.data.order.createTime.split('T')[1] + '</i> </p>' +
            '</li>' +


            '<li class="fl phone">' +
            '<a href="tel:' + phoneNumber + '">' +
            '<img src="../images/tel_blue.jpg" alt="">' +
            '<span>拨打电话</span>' +
            '</a>' +
            '</li>' +
            '<li class="fl">' +

            '</li>' +
            '<li class="fl message">' +
            '<img src="../images/gps.png" alt="">' +
            '<span>进店导航</span>' +
            '</li>' +


            '</ul>'
          if (res.order.obtainMode == '0') {
            let addrJson = JSON.parse(res.order.addrJson);
            str += '<!-- 收货人信息 -->' +
              '<ul id="infor">' +
              '<aside>收货信息</aside>' +
              '<li>' +
              '<p>' +
              '<i>收货人: </i>' +
              '<i>' + addrJson.receiverName + '</i>' +
              '&nbsp;&nbsp;' +
              '<i>' + addrJson.receiverPhone + '</i>' +
              '</p>' +
              '</li>' +
              '<li>' +
              '<p><i>收货地址: </i> <i>' + addrJson.receiverAddress + '</i> </p>' +
              '</li>' +
              '</ul>'
          }

          switch (res.order.orderStatus) {
            // case '2':
            //   str += '<ul id="balance">' +
            //     '<li class="fr pay payNow">' +
            //     '<p>立即支付</p>' +
            //     '</li>' +
            //     '<li class="fr cancel">' +
            //     '<p>取消订单</p>' +
            //     '</li>' +
            //     '</ul>'
            //   break;
            case '3':
              str += '<ul id="balance">' +
                '<li class="fr cancel">' +
                '<p>取消订单</p>' +
                '</li>' +
                '</ul>'
              break;
            case '4':
            case '5':
              str += '<ul id="balance">' +
                '<li class="fr delivery">' +
                '<p>确认收货</p>' +
                '</li>' +
                '</ul>'
              break;
            case '6':
              str += '<ul id="balance">' +
                '<li class="fr evaluate">' +
                '<p>评价</p>' +
                '</li>' +
                '</ul>'
              break;
            default:
              str += '';
          }
          $('#main').append(str)

        }

      })
    },
    Pay: function () {
      /* 支付订单 */
      $('.pay').click(function () {
        // alert('立即支付')
        var productOrderId = $('.porderId').attr('porderId')
        var openid = localStorage.getItem('openId');
        $.ajax({
          type: "post",
          url: global + "/wechatpay/weChatH5Pay",
          dataType: "json",
          async: 'true',
          data: {
            "body": "商品订单-" + productOrderId,
            "openId": openid,
            'outTradeNo': productOrderId,
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
                location.href = 'My_mealCoupon.html'
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
          // onBridgeReady();
        }
      })
    }
  }
  finish.init();

  /* 联系买家 */
  // $('.message').click(function () {
  //   layer.alert('进店导航功能暂未开放, 敬请谅解')
  //   // location.href = 'goods_order_detail_B.html?orderId=' + orderId;
  // })

  /* 取消订单 */
  $('.cancel').click(function () {
    cancelOrder()
  })

  /* 确认收货 */
  $('#main').on('click', '.delivery', function () {
    updateOrderState('6');
  })

  /* 评价 */
  $('#main').on('click', '.evaluate', function () {
    // alert('评价')
    location.href = "Evaluation_baskSingle.html?orderId=" + productOrderId;
  })

  /* 取消订单 */
  function cancelOrder() {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/cancelOrder',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "orderId": productOrderId,
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
  }


  /* 确认收货 */
  function updateOrderState(state) {
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
        } else if (data.code == 400) {
          layer.msg(data.msg, function () {
            location.reload();
          })
        }

      }
    })
  }

  /* 导航 */
  $('.message').click(function () {

    wx.ready(function () {

      // 获取用户自己位置
      wx.getLocation({
        // type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          var latitude = localStorage.getItem('latitude') // 纬度，浮点数，范围为90 ~ -90
          var longitude = localStorage.getItem('longitude') // 经度，浮点数，范围为180 ~ -180。

          bMapTransWXMap(longitude, latitude);
        }
      });

      // 百度地图加密经纬度BD09 转 国测局加密GCJ02 算法
      function bMapTransWXMap(lng, lat) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng - 0.0065;
        let y = lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta);
        let lats = z * Math.sin(theta);

        console.log('GCJ02-----' + lngs)
        console.log('GCJ02-----' + lats)
        navigation(lats, lngs)
      }

      // 调起导航
      function navigation(latitude, longitude) {
        var shopAddress = localStorage.getItem('shopAddress')
        var shopName = localStorage.getItem('shopName')
        wx.openLocation({
          latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
          name: shopName, // 位置名
          address: shopAddress, // 地址详情说明
          scale: 25, // 地图缩放级别,整形值,范围从1~28。默认为最大
          // infoUrl: 'https://www.baidu.com/' // 在查看位置界面底部显示的超链接,可点击跳转
        });
      }

    });
    wx.error(function (res) {
      alert(res.errMsg);
    });
  })



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
        sys_second -= 0.01; // 每次减10毫秒, 防止用户看到立即支付按钮及倒计时文字
        var minute = Math.floor((sys_second / 60) % 60);
        var second = Math.floor(sys_second % 60);
        $(minute_elem).text(minute < 10 ? "0" + minute : minute); //计算分
        $(second_elem).text(second < 10 ? "0" + second : second); // 计算秒  
      } else {
        $(minute_elem).parent().text('支付已超时')
        $('.payNow').remove();
        clearInterval(timer);
      }
    }, 10); // 10毫秒刷新一次

  }

})
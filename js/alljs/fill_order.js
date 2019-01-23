$(function () {
  /* 
   *
   * 地址展示
   *   1. url中没有id ---- 遍历地址, 选择默认地址
   *   
   *   2. url中携带id ---- 遍历地址, 选择id相同的地址
   *
   *
   *
   */
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var prodList = localStorage.getItem('crrc')
  prodList = JSON.parse(prodList);
  var finish = {
    init: function () {
      this.orderStatus = "";
      this.btn1 = '';
      this.btn2 = '';
      this.style = '';
      this.style2 = '';
      this.orderStatusText = '';
      //this.orderId = "";
      this.orderView();
      this.payNow();
      // this.getUserId();
      this.address(); //地址展示
    },
    orderView: function () {
      console.log(prodList);
      var str = '';
      var totalNumber = 0,
        totalMoney = 0;
      for (var index = 0; index < prodList.length; index++) {
        totalNumber += Number(prodList[index].number); // 总数量
        totalMoney += Number(prodList[index].totalPrice); // 总价格
        str += '<li specId="' + prodList[index].specId + '" prodid="' + prodList[index].prodId + '">' +
          '<div class="goodsImg">' +
          '<img src="' + prodList[index].prodImgUrl + '">' +
          '</div>' +
          '<div class="infor">' +
          '<p class="name">' + prodList[index].prodName + '</p>' +
          '<p class="spec">规格:' + prodList[index].specName + '</p>' +
          '<p class="price red">￥' + prodList[index].prodPrice + '</p>' +
          '<p class="num">x' + prodList[index].number + '</p>' +
          '</div>' +
          '</li>'
      }
      $('#goods_infor').append(str);
      $('.number').text(totalNumber + '件')
      $('.totalMoney').text('¥' + totalMoney.toFixed(2))
    },
    /* 立即付款 */
    payNow: function () {

      $('.pay').click(function () {
        if ($(this).html() == '去结算') {
          let List = [];
          let Lists = {};
          let prod = ''
          console.log(prodList);
          for (var i = 0; i < prodList.length; i++) {
            Lists = {
              specId: prodList[i].specId,
              count: prodList[i].number
            }
            List.push(Lists)

          }
          prod = JSON.stringify(List);

          var porderObtainMode = 0; // 快递发货:0, 到点自提:1
          if ($('#way').children('li:first').children('.select').attr('src') == '../images/selected.jpg') {
            porderObtainMode = 1;
          } else {
            porderObtainMode = 0;
          }



          // 收货地址id
          var addrId = $('#infor').attr('addrId');
          localStorage.setItem('addrId', addrId);
          // 结算
          $.ajax({
            type: "post",
            url: global + "/ekProductOrder/submitOrder",
            // url: "http://192.168.1.8:8181/ekProductOrder/submitOrder",
            dataType: "json",
            async: 'true',
            data: {
              "tokenKey": tokenKey,
              "userId": userId,
              "addrId": addrId,
              "specJson": prod,
              "porderObtainMode": porderObtainMode
            },
            success: function (data) {
              if (data.code == 200) {
                var res = data.data;
                console.log(res);
                // 测试跳转, 后期删除
                // 测试跳转, 后期删除
                // 测试跳转, 后期删除
                // location.href = 'fill_order_detail.html?productOrderId=' + res.id;
                // location.href = 'fill_order_list_C.html';

                H5Pay(res.id);
              } else if (data.code == 400) {
                console.log(data.msg);
                if (data.msg == '错误信息:{addrId=地址ID不能为空！}') {
                  layer.msg('快递发货请选择收货地址!')
                }

              }

            }
          });

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
              // onBridgeReady();
            }
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
      });
    },
    /* 地址 */
    address: function () {
      let url = location.href.split('?')[1];
      $.ajax({
        type: "get",
        url: global + "/optometrist/userAddressList",
        dataType: "json",
        data: {
          "tokenKey": tokenKey,
          "userId": userId
        },
        success: function (data) {
          let res = data.data;
          console.log(res);
          var str = '';
          if (res.length != 0) {
            if (!url) { // 显示默认
              for (key in res) {
                if (res[key].defaultTag == '1') {
                  $('#infor').attr('addrId', res[key].id)
                  str += '<img src="../images/dingwei.png" class="locations"></img>' +
                    '<div class="name">' +
                    '<p>' + res[key].receiverName + '</p>' +
                    '<p>' + res[key].receiverPhone + '</p>' +
                    '</div>' +
                    '<p class="address">' + res[key].receiverState + ' ' + res[key].receiverCity + ' ' + res[key].receiverDistrict + ' ' + res[key].receiverAddress + '</p>' +
                    '<img src="../images/8.png" alt="" class="to_right">'
                }
              }
            } else { // 显示已选定
              var id = url.split('=')[1];
              for (key in res) {
                if (res[key].id == id) {
                  $('#infor').attr('addrId', res[key].id)
                  str += '<img src="../images/dingwei.png" class="locations"></img>' +
                    '<div class="name">' +
                    '<p>' + res[key].receiverName + '</p>' +
                    '<p>' + res[key].receiverPhone + '</p>' +
                    '</div>' +
                    '<p class="address">' + res[key].receiverState + ' ' + res[key].receiverCity + ' ' + res[key].receiverDistrict + ' ' + res[key].receiverAddress + '</p>' +
                    '<img src="../images/8.png" alt="" class="to_right">'
                }
              }
            }
            $('#infor').append(str);
          } else {
            $('#infor').append('<p style="text-align: center; margin-top: .5rem; font-size: .4rem">请选择收货地址<span style="float: right; margin-right: .5rem; margin-top: .06rem">></span></p>');
          }



        }
      });


    }
  }
  finish.init();

  /* 查看商品 */
  $('#goods_infor').on('click', 'li', function () {
    var prodid = $(this).attr('prodid')
    location.href = 'goods_detail.html?prodid=' + prodid;
  })

  /* 配送方式选择 */
  $('#way li').click(function () {
    if ($(this).children('.select').attr('src') == '../images/before_select.jpg') {
      $(this).children('.select').attr('src', '../images/selected.jpg');
      $(this).siblings().children('.select').attr('src', '../images/before_select.jpg')
    } else {
      $(this).children('.select').attr('src', '../images/before_select.jpg');
      $(this).siblings().children('.select').attr('src', '../images/selected.jpg')
    }

    /* 隐藏收货地址 */
    if ($('#way').children(':first').children('.select').attr('src') == '../images/selected.jpg') {
      $('#infor').hide();
    } else {
      $('#infor').show();
    }
  })

  /* 选择收货地址 */
  $('#infor').click(function () {
    // alert('选择收货地址 181')
    location.href = 'address.html';
  })
})
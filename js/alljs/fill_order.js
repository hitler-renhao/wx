$(function () {

  // 抽奖提示弹框
  $("#delBtn").on("click",function(){
    $("#luck").fadeOut();
  })
  $("#toLuck").on("click",function(){
    location.href="Activity/luck_draw.html";
  })
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

  let href = location.href.split('?')[1]
  if (!href || href.split('=')[0] == 'id') {
    var totalMoneys = localStorage.getItem('totalMoney') || 0;
    var total = localStorage.getItem('total') || 0;
    $('.orange').text('已选' + total + '张')
    $('.subNumber').text('- ¥' + totalMoneys + ' 〉')
  } else {
    alert(1)
  }
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var prodList = localStorage.getItem('crrc')
  prodList = JSON.parse(prodList);
  // 店铺ID
  let shopIds = [];
  for (let index = 0; index < prodList.length; index++) {
    shopIds.push(prodList[index].shopId);
  }
  // 价格
  let prodPrice = [];
  for (let index = 0; index < prodList.length; index++) {
    prodPrice.push(prodList[index].totalPrice);
  }

 

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
      this.getCoupon(); // 优惠券展示
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
      totalMoney = (totalMoney - Number($('.subNumber').text().split('¥')[1].split(' ')[0])) || Number(prodList[index].totalPrice)
      $('.totalMoney').text('¥' + totalMoney.toFixed(2))
    },
    /* 立即付款 */
    payNow: function () {
      $('.pay').click(function () {
        if ($(this).html() == '去结算') {
          console.log("去结算")
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
              "porderObtainMode": porderObtainMode,
              "couponId": localStorage.getItem('couponleftid')
            },
            success: function (data) {
              if (data.code == 200) {
                var res = data.data;
                // 测试跳转, 后期删除
                // 测试跳转, 后期删除
                // 测试跳转, 后期删除
                // location.href = 'fill_order_detail.html?productOrderId=' + res.id;
                // location.href = 'fill_order_list_C.html';
                localStorage.removeItem('crrc')
                localStorage.removeItem('couponleftid')
                localStorage.removeItem('totalMoney')
                localStorage.removeItem('total')
                H5Pay(res.id,res.porderTotalPrice);
              } else if (data.code == 400) {
                console.log(data.msg);
                if (data.msg == '用户地址不存在！') {
                  layer.msg('快递发货请选择收货地址!')
                }

              }

            }
          });

          function H5Pay(orderId,luckPrice) {
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
                    onBridgeReady(res,luckPrice);
                  }, 500)
                } else if (data.code == 400 && data.msg == '{openId=用户标识不能为空！}') {
                  layer.alert('您还未登录，请先登录！', function () {
                    location.href = 'login.html'
                  })
                }
              }
            });

            function onBridgeReady(res,luckPrice) {
              
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
                  if (res.err_msg == "get_brand_wcpay_request:ok" || res.err_msg == "get_brand_wcpay_request:cancel") {
                      // location.href = 'fill_order_list_C.html'
                      // 活动抽奖
                      var date = new Date(); 
                      var endTime = new Date('2019-04-04 00:00:00');
                      if(endTime.getTime()>date.getTime()){
                          if(luckPrice>=299){
                            $("#luck").fadeIn();
                          }
                      }else{
                        setTimeout(function () {
                          location.href = 'fill_order_list_C.html';
                        },1000)
                      } 
                  } else if (res.err_msg == "total_fee") {
                    alert('付款失败!')
                  }
                }
              );
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
    },
    // 优惠券展示
    getCoupon: function () {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < shopIds.length; i++) {
        if (temp.indexOf(shopIds[i]) == -1) {
          temp.push(shopIds[i]);
        }
      }
      $.ajax({
        type: "get",
        url: global + "/coupon/queryCouponListByToken",
        dataType: "json",
        data: {
          "tokenKey": tokenKey,
          // "tokenKey": '3b49a49011cb43db9f63f7519f03f8a41551939572999',
          "shopId": JSON.stringify(temp),
          "status": '1'
        },
        success: function (data) {
          if (data.code == 200) {
            let str = '';
            let count = 0;
            console.log(data.data);
            if (data.data) {
              for (var i = 0; i < temp.length; i++) {
                for (var index = 0; index < data.data.length; index++) {
                  if (temp[i] == data.data[index].shopid && prodList[i].totalPrice >= data.data[index].uselimit) {
                    count++;
                  } else {
                    str = '无优惠券可使用 〉'
                  }
                }
              }
            } else {
              str = '无优惠券可使用 〉'
            }
            count > 0 ? $('.canUse').text(count + '张可使用 〉') : $('.canUse').text(str)
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


  /* 选择优惠券 */
  $('.chooseCoupon').click(function () {
    location.href = 'couponList.html?fill_order';
  })

  // /* 展示优惠金额 */
  // $('.showCoupon').click(function () {
  //   alert('已抵扣')
  // })
})
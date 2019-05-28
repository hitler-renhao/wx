$(function () {
  let shopId = localStorage.getItem('b_shopId');
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var openId = localStorage.getItem('openId');
  !tokenKey ? layer.alert('您还未登录，请先登录！', function () { location.href = 'login.html' }) : '' ;
  // 抽奖提示弹框
  $("#delBtn").on("click",function(){
    $("#luck").fadeOut();
  })
  $("#toLuck").on("click",function(){
    location.href="Activity/luck_draw.html";
  })
  
 
  var info = {
    init: function () {
      this.local();
      this.jump();
    },
    local() {
      let ary = [];
      ary.push(shopId);
      let that = this;
      that.localAjax(ary)
      if (location.href.split('?')[1].split('=')[0] == 'totalMoney') {
        let href = location.href.split('?')[1];
        let totalMoney = href.split('&')[0].split('=')[1];
        let total = href.split('&')[1].split('=')[1];
        let money = href.split('&')[2].split('=')[1];
        $('input').val(money)
        $('.fr').children(':first').text('已选' + total + '张')
        $('.fl').children(':last').html('共优惠<span class="subMoney">' + Number(totalMoney).toFixed(2) + '</span>元')
        $('.totalMoney').text((Number(money) - Number(totalMoney)).toFixed(2) + '元')
      } else {
        $("input").bind("input propertychange", function (event) {
          that.localAjax(ary)
          $('.totalMoney').text(Number($('input').val()).toFixed(2) + '元')
        });
      }
    },
    jump() {
      $('.coupon').click(function () {
        let val = $('input').val();
        // console.log(val);
        location.href = 'couponList.html?val=' + val + '&shopId=' + shopId;
      })
    },
    localAjax(ary) {
      $.ajax({
        type: "get",
        url: global + "/coupon/queryCouponListByToken",
        dataType: "json",
        data: {
          "tokenKey": tokenKey,
          // "tokenKey": '3b49a49011cb43db9f63f7519f03f8a41551939572999',
          "shopId": JSON.stringify(ary)
        },
        success: function (data) {
          if (data.code == 200) {
            let count = 0;
            console.log(data.data);
            if (location.href.split('?')[1].split('=')[0] != 'totalMoney') {
              for (index = 0; index < data.data.length; index++) {
                $('.fr').children(':first').css({
                  'opacity': '0'
                })
                if ($('input').val() >= data.data[index].uselimit && data.data[index].status == 1) {
                  count++;
                }
              }
              console.log(count);
              count == 0 ? $('.fl').children(':last').html('无可用优惠券') : $('.fl').children(':last').html(count + '张优惠券可用')
            }

          }
        },
        error: function () {
          layer.alert('您还未登录，请先登录！', function () {
            location.href = 'login.html'
          })
        }
      });
    }
  }
  info.init();

  $('#balance').on('click', '.pay', function () {
    // alert("Hgf")
    let porderTotalPrice = $('input').val();
    var couponleftId;
    if (location.href.split('?')[1].split('=')[0] == 'totalMoney') {
      couponleftId = location.href.split('&')[3].split('=')[1] == 'undefined' ? '' : location.href.split('&')[3].split('=')[1];
    } else {
      couponleftId = '';
    }
    $.ajax({
      type: "post",
      url: global + "/ekProductOrder/createPayOrder",
      dataType: "json",
      async: 'true',
      data: {
        "tokenKey": tokenKey,
        "porderTotalPrice": porderTotalPrice,
        "leftId": couponleftId,
        "shopId": shopId,
        // "shopId": 'shop1902201005547720498772049920'
      },
      success: function (data) {
        console.log("返回接口数据：",data)
        if (data.code == 200) {
          var res = data.data;
          console.log(res);
          localStorage.removeItem('couponleftid')
          H5Pay(res.id, porderTotalPrice,res.porderTotalPrice);
        } else if (data.code == 400) {
          layer.msg(data.msg)
        }
      },
      error: function () {
        layer.alert('您还未登录，请先登录！', function () {
          location.href = 'login.html'
        })
      }
    });
  })
  // 获取openId
  // 购买套餐生成订单号



  function H5Pay(orderId, porderTotalPrice,dataPrice) {
    var openid = localStorage.getItem('openId');
    $.ajax({
      type: "post",
      url: global + "/wechatpay/weChatH5Pay",
      dataType: "json",
      async: 'true',
      data: {
        "body": "商品订单-" + orderId,
        "openId": openId,
        'outTradeNo': orderId,
        'tokenKey': tokenKey
      },
      success: function (data) {
        console.log("生成订单返回数据",data)
        if (data.code == 200) {
          var res = data.data;
          setTimeout(function () {
            onBridgeReady(res, porderTotalPrice,dataPrice);
          }, 500)
        } else {
          layer.msg('您所处的网络环境不佳!')
        }
      }
    });

    function onBridgeReady(res, porderTotalPrice,dataPrice) {
      console.log("调用微信之前返回数据：",dataPrice)
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
            //示范一个公告层
            // layer.msg('付款成功');
            // setTimeout(function () {
            //   location.href = 'shop_detail.html?shopId=' + shopId;
            // },1000)

              // 活动抽奖
              var date = new Date(); 
              var endTime = new Date('2019-04-04 00:00:00');
              if(endTime.getTime()>date.getTime()){
                layer.msg('付款成功');
                setTimeout(function () {
                  if(dataPrice>=299){
                    $("#luck").fadeIn();
                  }
                },1000)
              }else{
                layer.msg('付款成功');
                setTimeout(function () {
                  location.href = 'shop_detail.html?shopId=' + shopId;
                },1000)
              }
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


  

})
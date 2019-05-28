$(function () {
  var tokenKey = localStorage.getItem('tokenKey')
  wx.ready(function () {
    // 获取用户自己位置
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        bMapTransWXMap(longitude, latitude)
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
      getCoupons(lats, lngs)
    }

  });
  wx.error(function (res) {
    // alert(res.errMsg);
  });

  function getCoupons(lats, lngs) {
    $.ajax({
      type: 'get',
      url: global + "/coupon/pu/queryCouponListByShopId",
      async: true,
      data: {
        "faceValueOrder": 1,
        "userId": localStorage.getItem('userId'),
        "longitude": lngs,
        "latitude": lats
        // "longitude": 116.40114357282636,
        // "latitude": 39.89768063279726,
      },
      success: function (data) {
        let res = data.data;
        console.log(res);
        let str = '';
        for (let index = 0; index < res.length; index++) {
          str += '<div class="activity-coupon-box" couponId="' + res[index].id + '" shopId="' + res[index].shopId + '">'
          if (res[index].usereceive1 == '1') {
            str += '<div class="use">' 
          } else {
            str += '<div class="activity-coupon">' 
          }
            str += '<div class="tit">' + res[index].productLimitTitle + '</div>' +
            '<div class="price">' + res[index].faceValue +
            '<img src="../../images/activity_coupon3.png" alt="">' +
            '</div>' +
            '<div class="name">' +
            '<p style="font-size: 0.26rem;width:100%; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">' + res[index].shopname + '</p>' +
            '<p>距离您' + res[index].rice.toFixed(2) + 'km</p>' +
            '</div>'
          if (res[index].usereceive1 == '1') {
            str += '<div class="btn touse">' +
              '<span>' + '去使用' + '</span>' +
              '</div>'
          } else {
            str += '<div class="btn get">' +
              '<span>' + '领取' + '</span>' +
              '</div>'
          }

          str += '</div>' +
            '</div>'
        }
        $('.main').append(str)
      }
    })
  }

  $('.main').on('click', '.get', function () {
    let that = $(this);
    let couponId = that.parents('.activity-coupon-box').attr('couponId')
    console.log(couponId);
    $.ajax({
      type: 'post',
      url: global + "/coupon/saveCouponByUserId",
      async: true,
      data: {
        "tokenKey": tokenKey,
        "couponId": couponId
      },
      success: function (data) {
        if (data.code == 200) {
          that.parents('.activity-coupon').attr('class', 'use');
          that.children('span').text('去使用')
        } else if (data.code == 400) {
          layer.msg(data.msg)
        }
      }
    })
  })

  $('.main').on('click', '.use', function () {
    let shopId = $(this).parents('.activity-coupon-box').attr('shopId')
    location.href = '../shop_detail.html?shopId=' + shopId;
  })
})
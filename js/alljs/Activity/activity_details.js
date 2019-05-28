$(function () {
  $('.find-shop').click(function () {
    location.href = '../shop_list.html'
  })
  // draw-now
  $('.draw-now').click(function () {
    location.href = './luck_draw.html'
  })
  // find-coupon
  $('.find-coupon').click(function () {
    location.href = './activity_coupon.html'
  })
  $.ajax({
    type: 'get',
    url: global + "/coupon/pu/queryCouponListByShopId",
    async: true,
    data: {
      "faceValueOrder": 1
    },
    success: function (data) {
      let res = data.data;
      console.log(res);
      let str = '';
      for (let index = 0; index < 3; index++) {
        str += '<div class="price-coupon">' +
          '<div class="ptice-coupon-lef">' +
          '<div class="price-coupon-des">' + '太阳镜通用' + '</div>' +
          '<div class="price-coupon-btn">立即领取</div>' +
          '</div>' +
          '<div class="ptice-coupon-rig">' + '亿视界官方旗舰店' + '</div>' +
          '</div>'
      }
      // $('.price-coupon-box').append(str)
    }
  })
})
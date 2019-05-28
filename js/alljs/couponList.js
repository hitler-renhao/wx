$(function () {
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var prodList = localStorage.getItem('crrc')

  prodList = JSON.parse(prodList);
  // 店铺ID
  let shopIds = [];
  if (!prodList) {
    shopIds.push(location.href.split('?')[1].split('&')[1].split('=')[1]);
  } else {
    for (let index = 0; index < prodList.length; index++) {
      shopIds.push(prodList[index].shopId);
    }
  }

  // 价格
  // let prodPrice = [];
  // for (let index = 0; index < prodList.length; index++) {
  //   prodPrice.push(prodList[index].totalPrice);
  // }
  let price = location.href.split('?')[1].split('&')[0].split('=')[1];

  var finish = {
    init: function () {
      location.href.split('?')[1] == 'fill_order' ? this.getCoupon() : this.getCoupons();
    },
    getCoupon() {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < shopIds.length; i++) {
        if (temp.indexOf(shopIds[i]) == -1) {
          temp.push(shopIds[i]);
        }
      }
      // console.log(temp);
      // for (var i = 0; i < temp.length; i++) {
      //   console.log(temp[i])
      //   console.log(shopIds[i]);
      //   for (var j = 0; j < shopIds.length; j++) {
      //     if (temp[i] == shopIds[j]) {

      //     }
      //   }

      // }

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
            let str1 = '';
            console.log(data.data);
            for (var i = 0; i < temp.length; i++) {
              for (var index = 0; index < data.data.length; index++) {
                if (temp[i] == data.data[index].shopid && Number(prodList[i].totalPrice) >= data.data[index].uselimit) {
                  if (data.data[0].shopid == data.data[index].shopid) {
                  str += '<li class="' + data.data[index].shopid + '" couponleftId="' + data.data[index].couponid + '">' +
                    '<div class="fl">' +
                    '<p class="money">¥' + data.data[index].facevalue + '</p>' +
                    '<p class="limit">满' + data.data[index].uselimit + '可用</p>' +
                    '</div>' +
                    '<div class="fr">' +
                    '<p class="shopName">' + (data.data[index].shopName || '店铺名获取中...') + '</p>' +
                    '<img src="../images/couponNoSelect.png" alt="">' +
                    '</div>' +
                    '</li>'
                  } else {
                    str1 += '<li class="' + data.data[index].shopid + '" couponleftId="' + data.data[index].couponid + '">' +
                    '<div class="fl">' +
                    '<p class="money">¥' + data.data[index].facevalue + '</p>' +
                    '<p class="limit">满' + data.data[index].uselimit + '可用</p>' +
                    '</div>' +
                    '<div class="fr">' +
                    '<p class="shopName">' + (data.data[index].shopName || '店铺名获取中...') + '</p>' +
                    '<img src="../images/couponNoSelect.png" alt="">' +
                    '</div>' +
                    '</li>'
                  }
                }
              }
            }
            $('#models').append('<ul>' + str + '</ul>')
            $('#models').append('<ul>' + str1 + '</ul>')
          }
        },
        error: function () {
          layer.alert('您还未登录，请先登录！', function () {
            location.href = 'login.html'
          })
        }
      });
    },
    getCoupons() {
      let ary = [];
      let shopId = location.href.split('?')[1].split('&')[1].split('=')[1];
      ary.push(shopId);
      console.log(ary);


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
            let str = '';
            let str1 = '';
            console.log(data.data);
            for (var index = 0; index < data.data.length; index++) {
              if (price >= data.data[index].uselimit && data.data[index].status == 1) {
                if (data.data[0].shopid == data.data[index].shopid) {
                  str += '<li class="' + data.data[index].shopid + '" couponleftId="' + data.data[index].couponleftId + '">' +
                  '<div class="fl">' +
                  '<p class="money">¥' + data.data[index].facevalue + '</p>' +
                  '<p class="limit">满' + data.data[index].uselimit + '可用</p>' +
                  '</div>' +
                  '<div class="fr">' +
                  '<p class="shopName">' + (data.data[index].shopName || '店铺名获取中...') + '</p>' +
                  '<img src="../images/couponNoSelect.png" alt="">' +
                  '</div>' +
                  '</li>'
                } else {
                  str1 += '<li class="' + data.data[index].shopid + '" couponleftId="' + data.data[index].couponleftId + '">' +
                  '<div class="fl">' +
                  '<p class="money">¥' + data.data[index].facevalue + '</p>' +
                  '<p class="limit">满' + data.data[index].uselimit + '可用</p>' +
                  '</div>' +
                  '<div class="fr">' +
                  '<p class="shopName">' + (data.data[index].shopName || '店铺名获取中...') + '</p>' +
                  '<img src="../images/couponNoSelect.png" alt="">' +
                  '</div>' +
                  '</li>'
                }
                // str += '<li class="' + data.data[index].shopid + '" couponleftId="' + data.data[index].couponleftId + '">' +
                //   '<div class="fl">' +
                //   '<p class="money">¥' + data.data[index].facevalue + '</p>' +
                //   '<p class="limit">满' + data.data[index].uselimit + '可用</p>' +
                //   '</div>' +
                //   '<div class="fr">' +
                //   '<p class="shopName">' + (data.data[index].shopName || '店铺名获取中...') + '</p>' +
                //   '<img src="../images/couponNoSelect.png" alt="">' +
                //   '</div>' +
                //   '</li>'
              }
            }
            $('#models').append('<ul>' + str + '</ul>')
            $('#models').append('<ul>' + str1 + '</ul>')
          }

        },
        error: function () {
          layer.alert('您还未登录，请先登录！', function () {
            location.href = 'login.html'
          })
        }
      });
    }
  };
  finish.init();


  // 不勾选
  $('.noUse').click(function () {
    let that = $(this).children('img')
    that.attr('src') == '../images/couponHasSelect.png' ?
      (that.attr('src', '../images/couponNoSelect.png'),
        localStorage.removeItem('couponleftid')) :
      that.attr('src', '../images/couponHasSelect.png'),
      $('li').children().find('img').attr('src', '../images/couponNoSelect.png');
  })
  // 勾选
  $('#models').on('click', 'li', function () {
    let that = $(this).children().find('img');
    that.attr('src') == '../images/couponHasSelect.png' ?
      that.attr('src', '../images/couponNoSelect.png') :
      that.attr('src', '../images/couponHasSelect.png'),
      $('.noUse').children('img').attr('src', '../images/couponNoSelect.png'),
      $(this).siblings().children().find('img').attr('src', '../images/couponNoSelect.png')
    /* , 
          localStorage.setItem('couponleftid', $(this).attr('couponleftId')) */
    ;
  })
  // 完成
  $('button').click(function () {
    let totalMoney = 0;
    let total = 0;
    let couponleftid = [];
    if ($('.noUse img').attr('src') == '../images/couponNoSelect.png') {
      $('li').each(function (index) {
        let that = $(this).children();
        if (that.find('img').attr('src') == '../images/couponHasSelect.png') {
          totalMoney += Number(that.find('.money').text().split('¥')[1]);
          total++;
          couponleftid.push($(this).attr('couponleftid'))
        }
      })
      localStorage.setItem('couponleftid', couponleftid)
    } else {
      localStorage.removeItem('couponleftid')
    }

    console.log(totalMoney);
    if (location.href.split('?')[1] == 'fill_order') {
      localStorage.setItem('totalMoney', totalMoney)
      localStorage.setItem('total', total);
      location.href = 'fill_order.html'
    } else {
      // localStorage.setItem('totalMoney', totalMoney)
      // localStorage.setItem('total', total);
      // localStorage.setItem('money', price);
      // localStorage.setItem('couponleftId', couponleftid);
      // location.href = 'offlinePay.html'
      location.href = 'offlinePay.html?totalMoney=' + totalMoney + '&total=' + total + '&money=' + price + '&couponleftId=' + couponleftid
    }
    // location.href.split('?')[1] == 'fill_order' ? location.href = 'fill_order.html?totalMoney=' + totalMoney + '&total=' + total : location.href = 'offlinePay.html?totalMoney=' + totalMoney + '&total=' + total + '&money=' + price + '&couponleftId=' + couponleftid

  })
})
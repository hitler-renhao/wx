$(function () {
  // tab栏切换
  $('.soldout-list').css({
    'display': 'none'
  })
  $('.putaway-list').css({
    'display': 'block'
  })
  $('#putaway').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.soldout-list').css({
      'display': 'none'
    })
    $('.putaway-list').css({
      'display': 'block'
    })
  })
  $('#soldout').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.putaway-list').css({
      'display': 'none'
    })
    $('.soldout-list').css({
      'display': 'block'
    })
  })

  // 新增套餐
  $('.add_combo').click(function () {
    location.href = './add_combo.html'
  })

  // 点击进入下架商品页面
  $('.evalist').on('click', 'li', function () {
    var comboId = $(this).attr('combo-id');
    location.href = 'edit_combo.html?comboId=' + comboId;
  })
  // 点击进入重新上架商品页面
  $('.evalists').on('click', 'li', function () {
    var comboId = $(this).attr('combo-id');
    location.href = 'del_combo.html?comboId=' + comboId;
  })

  // 获取已上架套餐
  var shopId = localStorage.getItem('shopId');
  getCombos(1, shopId, $('.evalist'));
  getCombos(0, shopId, $('.evalists'));

  function getCombos(off, shopId, evalist) {
    $.ajax({
      type: 'post',
      url: global + "/ekSetMeal/pu/list",
      async: true,
      data: {
        'pageNum': 1,
        'pageSize': 100,
        'shopId': shopId, // 店铺ID
        'off': off, // 是否商家
      },
      success: function (data) {
        if (data.code == 200) {
          var res = data.data
          console.log(res);
          var str = ''
          for (var i = 0; i < res.length; i++) {
            if (!res[i].file) {
              str +=
                '<li combo-id="' + res[i].setmeal.id + '">' +
                '<a href="javascript:;" class="unseImg">' +
                '<img src="" />' +
                '</a>' +
                '<span class="userInfo">' +
                '<p class="name" style="min-height: 1rem">' + res[i].setmeal.name +
                '</p>' +
                '<p class="price">' +
                '<del>¥' + res[i].setmeal.price + '</del>' +
                '<b class="fr">¥' + res[i].setmeal.nowPrice + '</b>' +
                '</p>' +
                '</span>' +
                '</li>'
            } else {
              str +=
                '<li combo-id="' + res[i].setmeal.id + '">' +
                '<a href="javascript:;" class="unseImg">' +
                '<img src="' + res[i].file.url + '" />' +
                '</a>' +
                '<span class="userInfo">' +
                '<p class="name" style="min-height: 1rem">' + res[i].setmeal.name +
                '</p>' +
                '<p class="price">' +
                '<del>¥' + res[i].setmeal.price + '</del>' +
                '<b class="fr">¥' + res[i].setmeal.nowPrice + '</b>' +
                '</p>' +
                '</span>' +
                '</li>'
            }
          }
          str += '<li style="margin-bottom: .5rem;"></li>'
          evalist.append(str);
        } else if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = '../html/login.html';
          })
        }

      }
    })
  }
})
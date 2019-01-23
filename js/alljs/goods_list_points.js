$(function () {
  // 获取openId
  var tokenKey = localStorage.getItem('tokenKey')
  if (!!tokenKey) {
    getOpenid(1, tokenKey);
    console.log(localStorage.getItem('openId'));
  }
  // 获取购买用户记录
  $.ajax({
    url: global + '/ekIntegralOrder/pu/buyadvert',
    type: 'post',
    dataType: 'json',
    success: function (data) {
      if (data.code == 200) {
        var res = data.data;
        console.log(res);
        var str = '';
        for (var i = 0; i < res.length; i++) {
          str += '<tr>' +
            '<td class="user_name">' + res[i].takePhone + '</td>' +
            '<td class="goods_name">' + res[i].integralProductName + '</td>' +
            '</tr>'
        }
        $('.user_list tbody').append(str)
      }
    }
  })

  // 赚积分
  $('.get_points').click(function () {
    location.href = 'get_point.html'
  })
  // 积分明细
  $('.points_detail').click(function () {
    location.href = 'point_list.html'
  })

  // 积分每一天
  $('.share').click(function () {
    var str = '<div style="width:7.5rem; height: 100%; z-index: 9999; position: fixed; top: 0; left: 0;" class="close">' +
      '<img src="../images/share.jpg" alt="" style="width: 100%; height: 100%;">' +
      '</div>'
    $('body').append(str)
  })
  $('body').on('click', '.close', function () {
    $('.close').remove();
  })

  $.ajax({
    url: global + '/ekIntegralProduct/pu/list',
    type: 'post',
    dataType: 'json',
    data: {
      'pageNum': 1,
      'pageSize': 111
    },
    success: function (data) {
      if (data.code == 200) {
        var res = data.data;
        console.log(res);
        var str = '';
        for (var i = 0; i < res.records.length; i++) {
          str += '<li data-id="' + res.records[i].id + '" class="lists">' +
            '<p class="title">' + res.records[i].name + '</p>' +
            '<h3><i class="stock">' + res.records[i].number + '</i>积分 <span>    剩余<i class="stock shengyu">' + res.records[i].stock + '</i>件</span></h3>' +
            '<img src="' + res.records[i].url + '" alt="">'
          if (res.records[i].stock != 0) {
            str += '<div class="buy">' +
              '<p>积分兑换</p>' +
              '</div>' +
              '</li>'
          } else {
            str += '<div class="buys">' +
              '<p>无法兑换</p>' +
              '</div>' +
              '</li>'
          }

        }
        $('.goods .goods_things').append(str)
      }
    }
  })
  $('.goods ul').on('click', '.lists', function () {
    var goodsId = $(this).attr('data-id');
    if ($(this).children('.buys').children('p').text() == '') {
      location.href = 'order_submit.html?id=' + goodsId;
    }
  })
})
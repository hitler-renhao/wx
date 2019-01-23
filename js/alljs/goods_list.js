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
    location.href = './add_goods.html?a'
  })

  // 点击进入下架商品页面
  $('.evalist').on('click', 'li', function () {
    var comboId = $(this).attr('combo-id');
    location.href = 'edit_goods.html?goodsId=' + comboId+'&q2';
  })
  // 点击进入重新上架商品页面
  $('.evalists').on('click', 'li', function () {
    var comboId = $(this).attr('combo-id');
    location.href = 'del_goods.html?goodsId=' + comboId;
  })

  // 获取已上架套餐
  var shopId = localStorage.getItem('shopId');
  // 全部
  getCombos('on', shopId, $('.evalist'), '1',1,100);
  getCombos('off', shopId, $('.evalists'), '1',1,100);
  $('.swiList a').click(function () {
    $(this).addClass('actives').siblings().removeClass('actives')
    var type = $(this).attr('types')
    $('.evalist').children().remove();
    $('.evalists').children().remove();
    getCombos('on', shopId, $('.evalist'), type,1,100);
    getCombos('off', shopId, $('.evalists'), type,1,100);
  })

  function getCombos(off, shopId, evalist, type,pageNum,pageSize) {
    $.ajax({
      type: 'POST',
      url: global + "/ekProduct/pu/productList",
      async: true,
      data: {
      	"pageNum":pageNum,
      	"pageSize":pageSize,
        'shopId': shopId, // 店铺ID
        'off': off, // 图片
      },
      success: function (data) {
      	console.log(data);
        if (data.code == 200) {
          var res = data.data.records;
          console.log(res);
          var str = '';
          if (type == '1') {
            	console.log(1)
            for (var i = 0; i < res.length; i++) {
              str += publicStr()
            }
           
          } else if (type == '2') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '2') {
                str += publicStr()
              }
            }
           
          } else if (type == '3') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '3') {
                str += publicStr()
              }
            }
           
          } else if (type == '5') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '5') {
                str += publicStr()
              }
            }
           
          } else if (type == '6') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '6') {
                str += publicStr()
              }
            }
           
          } else if (type == '7') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '7') {
                str += publicStr()
              }
            }
           
          }else if (type == '8') {
            for (var i = 0; i < res.length; i++) {
              if (res[i].type == '8') {
                str += publicStr()
              }
             }
          }else {
            for (var i = 0; i < res.length; i++) {
              str += publicStr()
            }
          }
//        str += '<li style="margin-bottom:.6rem;"></li>'
          evalist.append(str);
        } else if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = '../html/login.html';
          })
        }

        function publicStr() {
          return '<li combo-id="' + res[i].id + '">' +
            '<a href="javascript:;" class="unseImg">' +
            '<img src="' + res[i].url + '" />' +
            '</a>' +
            '<span class="userInfo">' +
            '<p class="name" style="min-height: 1rem">' + res[i].productName +
            '</p>' +
            '<p class="price">' +
            '<del>¥' + res[i].beginPrice + '</del>' +
            '<b class="fr">¥' + res[i].nowPrice + '</b>' +
            '</p>' +
            '</span>' +
            '</li>'
        }

      }
    })
  }


})
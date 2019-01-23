$(function () {
  var shopId = localStorage.getItem('shopId');
  var tokenKey = localStorage.getItem('tokenKey');
  var setmealid = location.href.split('?')[1].split('=')[1];

  // 回显套餐详情
  $.ajax({
    type: 'post',
    url: global + "/ekSetMeal/querySetMealinfo",
    async: true,
    data: {
      'tokenKey': tokenKey, // 店铺ID
      'setmealid': setmealid, // 图片
    },
    success: function (data) {
      if (data.code == 200) {
        var res = data.data;
        console.log(res);
        $('#title').val(res.setmeal.name)
        $('#combo_info').val(res.setmeal.explains)
        $('#shop_price').val(res.setmeal.price)
        $('#platform_price').val(res.setmeal.nowPrice)

        // 套餐明细
        var str = '';
        for (var i = 0; i < res.setmealAtt.length; i++) {
          str += '<div class="layui-row layui-col-space1">' +
            '<div class="layui-col-xs1 layui-col-sm1 layui-col-md1 del">' +
            '<i class="iconfont icon-wrong"></i>' +
            '</div>' +
            '<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
            '<input type="text" placeholder="冰纯钛合金镜框" class="name" value="' + res.setmealAtt[i].specName + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="number" placeholder="1" class="sum" value="' + res.setmealAtt[i].specSum + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="text" placeholder="副" class="company" value="' + res.setmealAtt[i].specCompany + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="number" placeholder="299" class="price" value="' + res.setmealAtt[i].specPrice + '">' +
            '</div>' +
            '</div>'
        }
        $('.combo_details').append(str);

        // 有效期
        var time = res.setmeal.time;
        var endTime = new Date(time).getTime();
        var startTime = new Date().getTime();
        console.log(format(endTime));
        $('.end-time').text('到期时间: ' + format(endTime));
        console.log(format(endTime - startTime));
        // var surplus = format(endTime - startTime).split(' ')[0].split('-')[1] + ' 个月 '
        //             + format(endTime - startTime).split(' ')[0].split('-')[2] + ' 日 '
        //             + format(endTime - startTime).split(' ')[1].split(':')[0] + ' 小时'
        var surplus = ((endTime - startTime) / 1000 / 60 / 60 / 24).toFixed(0) + '天';
        $('.surplus-time').text('剩余时间: ' + surplus);

        // 购买须知
        $('#user_know').val(res.setmeal.content);

        // 套餐及详情图
        var imgs = [$('#goods-pic1'), $('#goods-pic2'), $('#goods-pic3')];
        for (var i = 0, j = 0; i < res.setmealFile.length; i++) {
          if (res.setmealFile[i].type == 1) {
            $('#goods-pic').attr('src', res.setmealFile[i].url)
          } else if (res.setmealFile[i].type == 2) {
            imgs[j++].attr('src', res.setmealFile[i].url)
          }
        }

        // 发布须知
        // $('.public_check').attr('src', "../images/checking.png");

      } else if (data == 4400) {
        layer.alert('未登录', function () {
          location.href = '../html/login.html';
        })
      }

    }
  })
  // 时间戳转日期时间
  function add0(m) {
    return m < 10 ? '0' + m : m
  }

  function format(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '年' + add0(m) + '月' + add0(d) + '日';
    // return add0(h) + ':' + add0(mm) +  ':' + add0(s);
  }

  // 删除
  $('.taocan').click(function () {
    layer.confirm('此操作不可撤销，下架后无法恢复，下架后已购买顾客在有效期内仍然可以到店使用，您确定要下架此商品吗？', {
      btn: ['确定', '取消'],
      btn1: function () {
        $.ajax({
          type: 'post',
          url: global + "/ekSetMeal/offSetMeal",
          async: true,
          data: {
            'tokenKey': tokenKey, // 店铺ID
            'setmealid': setmealid, // 图片
            'off': 0
          },
          success: function (data) {
            if (data.code == 200) {
              layer.msg('下架成功', function () {
                location.href = 'combo_list.html'
              })
            }
          }
        })
      }
    })

  })
})
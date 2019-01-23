$(function () {
  //获取tokenKey
  var style1 = '';
  var tokenKey = localStorage.getItem('tokenKey');
  /* 默认展示 */
  $('.all').css({
      'display': 'block'
    }).siblings()
    .css({
      'display': 'none'
    });
  meal('3', $('#all'));
  /* tab切换 */
  /* 
   *
   *    3待接单
   *		4待发货
   *		5,6已完成
   *
   */
  // 待接单
  $('.allOrder').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.all').css({
        'display': 'block'
      })
      .siblings()
      .css({
        'display': 'none'
      });
    meal('3', $('#all'));
  })
  // 加工中
  $('.waitPay').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.waitPay2').css({
        'display': 'block'
      }).siblings()
      .css({
        'display': 'none'
      });
    meal('4', $('#waitPay1'));
  })
  // 已完成
  $('.waitColect').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.waitColect2').css({
        'display': 'block'
      }).siblings()
      .css({
        'display': 'none'
      });
    meal('-2,-1,0,1,5,6', $('#waitColect1'));
  })
  /* tab切换结束 */

  function meal(userType, litxt) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/list',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "pageNum": 1,
        "pageSize": 100,
        "isShop": 'shop',
        "state": userType
      },
      success: function (data) {
        if (data.code == 200) {
          console.log(JSON.parse(data.data.records[0].productJson));
          litxt.empty();
          var res = data.data;
          var str = '';
          var totalCount = 0;
          for (var i = 0; i < res.records.length; i++) {
            var products = JSON.parse(data.data.records[i].productJson);
            var shopJson = JSON.parse(data.data.records[i].shopJson);
            console.log(products);

            switch (userType) {
              case '3':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="3" userid="' + res.records[i].userId + '">'
                break;
              case '4':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="4" userid="' + res.records[i].userId + '">'
                break;
              case '-2,-1,0,1,5,6':
                str += '<div class="content" orderId="' + res.records[i].id + '" status="5" userid="' + res.records[i].userId + '">'
                break;
            }
            str += '<div class="clicks">' +
              '<aside class="man-cloth">'
            if (res.records[i].obtainMode == '0') {
              str += '<strong>' + products[0].productName + '</strong>'
            } else if (res.records[i].obtainMode == '1') {
              str += '<strong>' + shopJson.shopname + '<i class="self">自提订单</i></strong>'
            }
            switch (userType) {
              case '3':
                str += '<span class="exchange">待接单 <i> ></i> </span>'
                break;
              case '4':
                if (res.records[i].obtainMode == '1') {
                  str += '<span class="exchange">未到店取货 <i> ></i> </span>'
                } else if (res.records[i].obtainMode == '0') {
                  str += '<span class="exchange">加工中 <i> ></i> </span>'
                }
                break;
              case '-2,-1,0,1,5,6':
                str += '<span class="exchange">已完成 <i> ></i> </span>'
                break;
            }
            // str += '<span class="exchange">待接单 <i> ></i> </span>' +
            str += '</aside>'
            console.log(products);

            str += '<div class="body_box" style="">'
            for (var j = 0; j < products.length; j++) {

              str += '<div class="payment_center">' +
                '<a href="javascript:;" class="picture">' +
                '<img src="' + products[j].imgUrl + '" alt="" />' +
                '</a>' +
                '<div class="z_word">' +
                '<p>' + products[j].productName + '</p>' +
                '</div>' +
                '<div class="z_word">' +
                '<p>' + products[j].spectName + '</p>' +
                '</div>' +
                '<div class="num">x' + products[j].count + '</div>' +
                '</div>'
              totalCount += products[j].count;
            }

            str += '</div>' +
              '<div class="price">' +
              '<p>共' + totalCount + '件商品 合计: <i> ' + res.records[i].orderTotalPrice.toFixed(2) + '</i></p>' +
              '</div>' +
              '</div>'

            switch (userType) {
              case '3':
                str += '<div class="confirms">' +
                  '<button class="contact confirm">联系顾客</button>' +
                  '<button class="processing">开始加工</button>' +
                  '<button class="cancel">取消订单</button>' +
                  '</div>';
                break;
              case '4':
                str += '<div class="confirms">' +
                  '<button class="contact confirm">联系顾客</button>'
                if (res.records[i].obtainMode == '0') {
                  str += '<button class="sending">发货</button>'
                }
                str += '<button class="cancel">取消订单</button>' +
                  '</div>';
                break;
              case '-2,-1,0,1,5,6':
                '';
                break;

            }

            str += '</div>' +
              '</div>'
          }
          litxt.append(str);
        } else if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = '../html/login.html';
          })
        }
      }
    })
  }
  /* 取消订单 */
  $('#container').on('click', '.cancel', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    // status: 1 可以取消
    // status: 2 不可取消
    let status = $(this).parent().parent().attr('status');
    if (status == '3') {
      let str = '<div class="cancels">' +
        '<ul class="popup1">' +
        '<li class="reason1">' +
        '<img src="../images/before_select.jpg" alt="" class="select">' +
        '<span>  商品缺货</span>' +
        '</li>' +
        '<li class="reason2">' +
        '<img src="../images/before_select.jpg" alt="" class="select">' +
        '<span>  店铺歇业</span>' +
        '</li>' +
        '<li class="reason3">' +
        '<img src="../images/before_select.jpg" alt="" class="select">' +
        '<span>  其他</span>' +
        '</li>' +
        '</ul>' +
        '<textarea name="" id="" class="cancel_txt" placeholder="请说明其他原因"></textarea>' +
        '</div>'
      layer.open({
        type: 1,
        title: '请选择', //不显示标题栏
        closeBtn: false,
        area: '300px;',
        shade: 0.8,
        id: 'LAY_layuipro1' //设定一个id，防止重复弹出
          ,
        btn: ['确定', '取消'],
        btnAlign: 'r',
        moveType: 1 //拖拽模式，0或者1
          ,
        content: str,
        btn1: function (layero) {
          // 确定
          let reason1 = $('.reason1 .select').attr('src');
          let reason2 = $('.reason2 .select').attr('src');
          let reason3 = $('.reason3 .select').attr('src');
          const reason = '../images/before_select.jpg'
          console.log(reason1);
          if (reason1 == reason && reason2 == reason && reason3 == reason) {
            layer.msg('请选择取消订单理由');
          } else if (reason3 != reason && !$('textarea').val()) {
            layer.msg('请输入取消理由')
          } else {
            let reasons = localStorage.getItem('reasons');
            console.log(reasons);

            if (reasons == '  其他') {
              console.log($('.cancel_txt').val());
              reasons = $('.cancel_txt').val()
            }
            $.ajax({
              type: "post",
              url: global + '/ekProductOrder/cancelOrder',
              async: true,
              data: {
                "tokenKey": tokenKey, //_out_153751688979716693
                "orderId": orderId,
                "orderRemark": reasons
              },
              success: function (data) {
                if (data.code == 200) {
                  layer.msg(data.msg);
                  setTimeout(function () {
                    location.reload();
                  }, 1000)
                  // location.reload();
                } else if (data.code == 400) {
                  layer.msg(data.msg)
                }
              }
            })
          }
        }
      });
    } else if (status == '4' || status == '5') {
      layer.open({
        type: 1,
        title: '提示', //不显示标题栏
        closeBtn: false,
        area: '300px;',
        shade: 0.8,
        id: 'LAY_layuipro2' //设定一个id，防止重复弹出
          ,
        btn: ['再想想', '取消订单'],
        btnAlign: 'r',
        moveType: 1 //拖拽模式，0或者1
          ,
        content: '<p>此订单您已经设置为已接单状态，如您选择取消，“e可”会给顾客退款。请与顾客沟通协商后再确认操作。</p>',
        btn2: function (layero) {
          let str = '<div class="cancels">' +
            '<ul class="popup1">' +
            '<li class="reason1">' +
            '<img src="../images/before_select.jpg" alt="" class="select">' +
            '<span>  商品缺货</span>' +
            '</li>' +
            '<li class="reason2">' +
            '<img src="../images/before_select.jpg" alt="" class="select">' +
            '<span>  店铺歇业</span>' +
            '</li>' +
            '<li class="reason3">' +
            '<img src="../images/before_select.jpg" alt="" class="select">' +
            '<span>  其他</span>' +
            '</li>' +
            '</ul>' +
            '<textarea name="" id="" class="cancel_txt" placeholder="请说明其他原因"></textarea>' +
            '</div>'
          layer.open({
            type: 1,
            title: '请选择', //不显示标题栏
            closeBtn: false,
            area: '300px;',
            shade: 0.8,
            id: 'LAY_layuipro1' //设定一个id，防止重复弹出
              ,
            btn: ['确定', '取消'],
            btnAlign: 'r',
            moveType: 1 //拖拽模式，0或者1
              ,
            content: str,
            btn1: function (layero) {
              // 确定
              let reason1 = $('.reason1 .select').attr('src');
              let reason2 = $('.reason2 .select').attr('src');
              let reason3 = $('.reason3 .select').attr('src');
              const reason = '../images/before_select.jpg'
              console.log(reason1);
              if (reason1 == reason && reason2 == reason && reason3 == reason) {
                layer.msg('请选择取消订单理由');
              } else if (reason3 != reason && !$('textarea').val()) {
                layer.msg('请输入取消理由')
              } else {
                let reasons = localStorage.getItem('reasons');
                console.log(reasons);

                if (reasons == '  其他') {
                  console.log($('.cancel_txt').val());
                  reasons = $('.cancel_txt').val()
                }
                $.ajax({
                  type: "post",
                  url: global + '/ekProductOrder/cancelOrder',
                  async: true,
                  data: {
                    "tokenKey": tokenKey, //_out_153751688979716693
                    "orderId": orderId,
                    "orderRemark": reasons
                  },
                  success: function (data) {
                    if (data.code == 200) {
                      layer.msg(data.msg);
                      setTimeout(function () {
                        location.reload();
                      }, 1000)
                      // location.reload();
                    } else if (data.code == 400) {
                      layer.msg(data.msg)
                    }
                  }
                })
              }
            }
          });
        }
      });
    }
  })
  // 选择取消订单理由
  $('body').on('click', '.popup1 li', function () {
    if ($(this).children('.select').attr('src') == '../images/before_select.jpg') {
      $(this).children('.select').attr('src', '../images/selected.jpg');
      // console.log($(this).children('span').text());
      localStorage.setItem('reasons', $(this).children('span').text())
      $(this).siblings().children('.select').attr('src', '../images/before_select.jpg')
    } else {
      $(this).children('.select').attr('src', '../images/before_select.jpg');
      $(this).siblings().children('.select').attr('src', '../images/selected.jpg')
    }
    // console.log($('.popup1').children(':last'));

    if ($('.popup1').children(':last').children('.select').attr('src') == '../images/selected.jpg') {
      $('.cancel_txt').show();
      // localStorage.setItem('reasons', $('.cancel_txt').val())
    } else {
      $('.cancel_txt').hide();
    }
  })
  /* 取消订单结束 */

  /* 开始加工 */
  $('#container').on('click', '.processing', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    // 请求成功跳转到'待发货列表中'
    // 请求失败提示请求失败
    updateOrderState('4', orderId);
  })

  /* 联系顾客 */
  $('#container').on('click', '.contact', function () {
    let userid = $(this).parents('.content').attr('userid')
    let str = '<div class="cancels">' +
      '<ul class="popup2">' +
      '<li class="msg">' +
      '<a href="javascript:;">  发送在线消息</a>' +
      '</li>' +
      '<li class="tel">' +
      '<a href="tel:' + 18310215054 + '">  拨打电话</a>' +
      '</li>' +
      '</ul>' +
      '</div>'
    layer.open({
      type: 1,
      title: '请选择', //不显示标题栏
      closeBtn: false,
      area: '300px;',
      shade: 0.8,
      id: 'LAY_layuipro3' //设定一个id，防止重复弹出
        ,
      btn: ['取消'],
      btnAlign: 'r',
      moveType: 1 //拖拽模式，0或者1
        ,
      content: str,
      success: function (layero) {
        // 确定
        sendMessage(userid)
      }
    });
  })

  function sendMessage(userid) {
    $('body').on('click', '.msg', function () {
      location.href = 'Online_Service_B.html?user=' + userid
    })
  }


  /* 发货 */
  $('#container').on('click', '.sending', function () {
    let orderId = $(this).parent().parent().attr('orderid')
    let str = '<div class="cancels">' +
      '<ul class="popup3">' +
      '<li class="logistic">' +
      '<div class="layui-form-item">' +
      '<label class="layui-form-label">物流公司</label>' +
      '<select name="interest" lay-filter="aihao" class="logistics">' +
      '<option value="">-请选择物流公司-</option>' +
      '<option value="0">顺丰</option>' +
      '<option value="1">圆通</option>' +
      '<option value="2">申通</option>' +
      '<option value="3">中通</option>' +
      '<option value="4">韵达</option>' +
      '<option value="5">邮政</option>' +
      '<option value="6">EMS</option>' +
      '</select>' +
      '</div>' +
      '</li>' +
      '<li class="number">' +
      '<label class="layui-form-label">运单号码</label>' +
      '<input type="text" class="waybill">' +
      '</li>' +
      '</ul>' +
      '</div>'
    layer.open({
      type: 1,
      title: '请选择', //不显示标题栏
      closeBtn: false,
      area: '300px;',
      shade: 0.8,
      id: 'LAY_layuipro4' //设定一个id，防止重复弹出
        ,
      btn: ['确认', '取消'],
      btnAlign: 'r',
      moveType: 1 //拖拽模式，0或者1
        ,
      content: str,
      btn1: function (layero) {
        console.log($('select').val())
        if (!$('select').val()) { // 未选择物流公司
          layer.msg('请选择物流公司')
        } else if (!$('.waybill').val()) {
          layer.msg('请填写运单号码')
        } else {
          let expressName = $('select').val() // 物流公司
          let waybillNumber = $('.waybill').val() // 运单号
          console.log(expressName);
          console.log(waybillNumber);
          sendGoods(expressName, waybillNumber, orderId);
        }
        // 确定

      }
    });
  })

  function updateOrderState(state, productOrderId) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/updateOrderState',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "state": state,
        "productOrderId": productOrderId
      },
      success: function (data) {
        if (data.code == 200) {
          if (state == '3') {
            layer.msg('订单已取消', function () {
              location.reload();
            })
          } else if (state == '4') {
            layer.msg('接单成功', function () {
              location.reload();
            })
          }
        } else if (data.code == 400) {
          layer.msg(data.msg, function () {
            location.reload();
          })
        }

      }
    })
  }

  function sendGoods(expressName, waybillNumber, productOrderId) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/sendGoods',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "expressName": expressName,
        "waybillNumber": waybillNumber,
        "productOrderId": productOrderId
      },
      success: function (data) {
        if (data.code == 200) {
          layer.msg(data.msg, function () {
            location.reload();
          })
        } else if (data.code == 400) {
          layer.msg(data.msg, function () {
            location.reload();
          })
        }

      }
    })
  }

  /* 跳转订单详情页 */
  $('body').on('click', '.clicks', function () {
    let orderId = $(this).parent().attr('orderid');
    location.href = 'goods_order_detail_B.html?orderId=' + orderId;
  })
})
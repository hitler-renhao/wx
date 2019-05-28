$(function () {
  orderId = location.href.split('?')[1].split('=')[1];
  tokenKey = localStorage.getItem('tokenKey');
  var finish = {
    init: function () {
      this.orderId = location.href.split('?')[1].split('=')[1];
      this.tokenKey = localStorage.getItem('tokenKey');
      console.log(this.orderId)
      this.orderFinish(); // 页面渲染
      this.contact(); // 联系顾客
      this.cancelOrder(); // 取消订单
      this.rightOrder(); // 确认订单
      this.sending(); // 发货
    },
    orderFinish: function () {
      var that = this;
      $.ajax({
        type: "post",
        url: global + '/ekProductOrder/productOrderInfo',
        dataType: "json",
        async: false,
        data: {
          "tokenKey": that.tokenKey,
          "productOrderId": that.orderId,
        },
        success: function (data) {
          var res = data.data;
          console.log(data);
          var str = '';
          str += '<!-- 商品信息 -->' +
            '<ul id="goods_infor">'

          switch (res.order.orderStatus) {
            case '-2':
            case '-1':
            case '0':
            case '1':
            case '5':
            case '6':
              str += '<h2><i style="float:left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">已完成</i></h2>'
              break;
            case '3':
              str += '<h2><i style="float:left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待接单</i></h2>'
              break;
            case '4':
              str += '<h2><i style="float:left;">订单编号: </i><i>' + res.order.id + '</i> <i class="fr" style="margin-right: .24rem;">待发货</i></h2>'
              break;
          }

          let productJson = JSON.parse(res.order.productJson);
          for (var i = 0; i < productJson.length; i++) {

            str += '<li goods_id="123456">' +
              '<div class="goodsImg">' +
              '<img src="' + productJson[i].imgUrl + '">' +
              '</div>' +
              '<div class="infor">' +
              '<p class="name">' + productJson[i].productName + '</p>' +
              '<p class="name">' + productJson[i].spectName + '</p>' +
              '<p class="price red">￥' + productJson[i].totalPrice + '</p>' +
              '<p class="num">x' + productJson[i].count + '</p>' +
              '</div>' +
              '</li>'
          }
          
          if(res.order.orderPayPrice===null){
            res.order.orderPayPrice='0.00';       
          }
          str += '</ul>' +
            '<!-- 订单信息 -->' +
            '<ul id="order_infor">' +
            '<li class="total">' +
            '<p>优惠券优惠金额: <span class="fr order_info">￥'+res.order.orderPayPrice+'</span></p>' +
            // '<p>满减金额: <span class="fr order_info">¥0.00</span></p>' +
            '<p>运费: <span class="fr order_info">¥0.00</span></p>' +
            '<p>订单总金额: <span class="fr order_info">¥' + res.order.orderTotalPrice.toFixed(2) + '</span></p>' +
            '</li>' +
            '<li>' +
            '<span class="payable">应付金额：</span>' +
            '<span class="money fr">¥' + res.order.orderTotalPrice.toFixed(2) + '</span>' +
            '</li>' +
            '</ul>'
          var address = JSON.parse(res.order.addrJson);
          str += '<!-- 买家信息 -->' +
                      '<ul id="way">' +
                        '<aside>买家信息</aside>' +
                        '<li>' +
                          '<p><i>收货人: </i> <i>' + res.order.buyUserName + '</i> </p>' +
                        '</li>'

            if (res.order.obtainMode == '0') {
              str +=    '<li>' +
                          '<p><i>收货地址: </i> <i>' + address.receiverAddress + '</i> </p>' +
                        '</li>'
            }
            str +=      '</li>' +
                        '<li>' +
                          '<p><i>下单时间: </i> <i>' + data.data.order.createTime.split('T')[0] + ' ' + data.data.order.createTime.split('T')[1] + '</i> </p>' +
                        '</li>' +


                        '<li class="fl phone" style="border-top: 1px solid #f2f2f3; width: 49%; text-align: center">' +
                          '<a href="tel:' + res.order.buyUserPhone + '">' +
                            '<img src="../images/tel_blue.jpg" alt="" style="width: .4rem;">' +
                            '<span>拨打电话</span>' +
                          '</a>' +
                        '</li>' +
                        '<li class="fl" style="border-top: 1px solid #f2f2f3; border: 1px solid #f2f2f3; padding: .3rem 0; height: .2rem; width: 0;">' +

                        '</li>' +
                        '<li class="fl message" userid="' + res.order.userId + '" style="width: 49%; margin: 0; padding: 0; border: none; text-align: center; border-top: 1px solid #f2f2f3;">' +
                          '<img src="../images/gps.png" alt="" style="width: .4rem;">' +
                          '<span>进店导航</span>' +
                        '</li>' +
                      '</ul>'
          console.log(res.order.obtainMode);
          if (res.order.obtainMode == '0') {
            str += '<!-- 收货人信息 -->' +
              '<ul id="infor">' +
              '<aside>收货信息</aside>' +
              '<li>' +
              '<p>' +
              '<i>收货人: </i>' +
              '<i>' + address.receiverName + '</i>' +
              '&nbsp;&nbsp;' +
              '<i>' + address.receiverPhone + '</i>' +
              '</p>' +
              '</li>' +
              '<li>' +
              '<p><i>收货地址: </i> <i>' + address.receiverAddress + '</i> </p>' +
              '</li>' +
              '</ul>'
          }
          switch (res.order.orderStatus) {
            case '3':
              str += '<ul id="balance">' +
                '<li class="fr right">' +
                '<p>确认接单</p>' +
                '</li>' +
                '<li class="fr cancel" status="' + res.order.orderStatus + '" orderid="' + res.order.id + '">' +
                '<p>取消订单</p>' +
                '</li>' +
                '</ul>';
              break;
            case '4':
              str += '<ul id="balance">'
              if (res.order.obtainMode == '0') {
                str += '<li class="fr sending">' +
                  '<p>发货</p>' +
                  '</li>'
              }
              str += '<li class="fr cancel" status="' + res.order.orderStatus + '" orderid="' + res.order.id + '">' +
                '<p>取消订单</p>' +
                '</li>' +
                '</ul>'
              break;
            default:
              str += ''
          }

          $('#container').append(str)
        }


      })
    },
    contact: function () {
      /* 联系顾客 */
      $('#container').on('click', '.message', function () {
        let userid = $(this).attr('userid')
        location.href = 'Online_Service_B.html?user=' + userid
      })
    },
    cancelOrder: function () {
      /* 取消订单 */
      $('#container').on('click', '.cancel', function () {
        // status: 1 可以取消
        // status: 2 不可取消
        let status = $(this).attr('status');
        let orderid = $(this).attr('orderid');
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
          localStorage.setItem('reasons', $(this).children('span').text())
          $(this).siblings().children('.select').attr('src', '../images/before_select.jpg')
        } else {
          $(this).children('.select').attr('src', '../images/before_select.jpg');
          $(this).siblings().children('.select').attr('src', '../images/selected.jpg')
        }
        if ($('.popup1').children(':last').children('.select').attr('src') == '../images/selected.jpg') {
          $('.cancel_txt').show();
        } else {
          $('.cancel_txt').hide();
        }
      })
      /* 取消订单结束 */
    },
    rightOrder: function () {
      /* 确认订单 */
      $('.right').click(function () {
        updateOrderState('4');
      })
    },
    sending: function () {
      $('#container').on('click', '.sending', function () {
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
    }

  }
  finish.init();

  function updateOrderState(state) {
    $.ajax({
      type: "post",
      url: global + '/ekProductOrder/updateOrderState',
      async: true,
      data: {
        "tokenKey": tokenKey, //_out_153751688979716693
        "state": state,
        "productOrderId": orderId
      },
      success: function (data) {
        if (data.code == 200) {
          if (state == '0') {
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
})
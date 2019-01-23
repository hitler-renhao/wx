$(function () {
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  var address = {
    init: function () {
      this.rightsAddress();    // 选中地址
      this.listShow();    // 展示
      this.changeState(); // 更改默认设置
      this.setDefault();  //更改默认设置
      this.removeAddress();  // 删除地址
      this.editAddress();    // 修改地址
    },
    listShow: function () {
      $.ajax({
        type: "get",
        url: global + "/optometrist/userAddressList",
        dataType: "json",
        data: {
          "tokenKey": tokenKey,
          "userId": userId
        },
        success: function (data) {
          console.log(data);
          var res = data.data;
          var str = '';
          for (var i = 0; i < res.length; i++) {
            str += '<li addressId="' + res[i].id + '">' +
              '<span class="li_box">' +
              '<span class="li_top">' +
              '<p>' + res[i].receiverName + '</p>'
            if (res[i].defaultTag == '1') {
              str += '<div class="default" id="actives">默认</div>'
            } else {
              str += '<div class="default">默认</div>'
            }

            str += '<p>' + res[i].receiverPhone + '</p>' +
              '</span>' +
              '<text class="address">' +
              '<b>' + res[i].receiverState + '</b><b>' + res[i].receiverCity + '</b><b>' + res[i].receiverDistrict + '</b>' +
              '<b>' + res[i].receiverAddress + '</b>' +
              '</text>' +
              '</span>' +
              '<span class="li_bottombox">' +
              '<text class="leftone">'
            if (res[i].defaultTag == '1') {
              str += '<img src="http://wx.bjysjglasses.com/static/wxshop/images/moren.png" class="default_click" />'
            } else {
              str += '<img src="http://wx.bjysjglasses.com/static/wxshop/images/z_check.png" class="default_click" />'
            }

            str += '<p>默认地址</p>' +
              '</text>' +
              '<ul class="li_right">' +
              '<text class="z_edit">' +
              '<a href="javascript:;" class="bianji">编辑</a>' +
              '</text>' +
              '<text class="del">' +
              '<a href="javascript:;" class="delete">删除</a>' +
              '</text>' +
              '</ul>' +
              '</span>' +
              '</li>'
          }
          $('#list').append(str);
          address.changeState();
          address.setDefault();
          address.removeAddress();
          address.editAddress();

        }
      });
    },
    // 设置默认地址
    changeState: function () {
      $('#list').find('li').each(function () {
        var stateVal = $(this).find('.ipt2').val();
        if (stateVal == 'y') {
          $(this).find('img').attr('src', '../images/moren.png');
          $(this).find('.default').css('display', 'block');
        } else if (stateVal == 'n') {
          $(this).find('img').attr('src', '../z_check.png')
          $(this).find('.default').css('display', 'none');
        }
      });
    },
    setDefault: function () {
      $("#list").find("li .default_click").click(function (event) {
        //alert(1);
        $(this).attr({
          src: 'http://wx.bjysjglasses.com/static/wxshop/images/moren.png'
        });
        $(this).parents('li').siblings().find('.default_click').attr({
          src: 'http://wx.bjysjglasses.com/static/wxshop/images/z_check.png'
        });
        $(this).parents('.li_bottombox').siblings('.li_box').find('.default').css('display', 'block');
        $(this).parents('li').siblings().find('.default').css('display', 'none');
        var addressId = $(this).parents('li').attr('addressid');

        $(this).parents('.li_bottombox').siblings('.ipt2').val(1);
        $(this).parents('li').siblings().find('.ipt2').val(0);
        $.ajax({
          type: "post",
          url: global + "/optometrist/updateDefaultTag",
          dataType: "json",
          data: {
            "tokenKey": tokenKey,
            "userId": userId,
            "addressId": addressId
          },
          success: function (data) {
            console.log(data);
          }
        });

      });
    },
    // 删除地址
    removeAddress: function () {
      $('.li_right .del').click(function () {
        var that = this;
        var addressId = $(this).parents('li').attr('addressid');
        $('.bigbox').show();
        $('.word .yes').click(function () {
          $.ajax({
            type: "post",
            url: global + "/optometrist/delUserAddress",
            dataType: "json",
            data: {
              "tokenKey": tokenKey,
              "addressId": addressId
            },
            success: function(data) {
              console.log(data.msg);
              layer.msg(data.msg)
            }
          })
          $('.bigbox').hide();
          $(that).parents('li').remove();
        });
      })
      $('.word .no').unbind('click').click(function () {
        $('.bigbox').hide();
      })
    },
    // 编辑地址
    editAddress: function () {
      $('.z_edit').click(function (event) {
        var addressId = $(this).parents('li').attr('addressid');
          location.href = 'add_address.html?addressId=' + addressId;
      });
    },
    // 选择地址
    rightsAddress: function () {
      $('#list').on('click', '.li_box', function() {
        var id = $(this).parent().attr('addressid')
        location.href = 'fill_order.html?id=' + id;
      })
    }
  }
  address.init();
})
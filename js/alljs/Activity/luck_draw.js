if (!localStorage.getItem('tokenKey')) {
  layer.alert('您还未登录，请先登录', function () {
    location.href = '../login.html';
  })
}
function getUsers() {
  $.ajax({
    type: 'get',
    url: global + "/ekActivityTurntableUserAward/pu/queryTurntableUserAward",
    async: true,
    data: {},
    success: function (data) {
      console.log(data);
      if (data.code == 200) {
        let str = '';
        for (let i = 0; i < data.data.length; i++) {
          let cellphone = data.data[i].cell_phone_number;
          str += '<div class="swiper-slide">' +
            '<div class="tip">' + cellphone.substring(0, 3) + '****' + cellphone.substring(7, 11) + '用户获得了"' + data.data[i].name + '"奖励</div>' +
            '</div>'
        }
        $('.swiper-wrapper').append(str)
        var swiper = new Swiper('.swiper-container', {
          direction: 'vertical',
          loop: true, // 循环模式选项
          autoplay: true, //等同于以下设置
          height: 37.5, //你的slide高度
        });
      }
    }
  })
}
getUsers();

function getCounts() {
  $.ajax({
    type: 'get',
    url: global + "/ekActivityTurntable/queryTurntableCount",
    async: true,
    data: {
      "tokenKey": localStorage.getItem('tokenKey')
    },
    success: function (data) {
      console.log(data);
      if (data.code == 200) {
        if (data.data) {
          $('.num').text('剩余抽奖次数：' + data.data.count + '次')
        } else {
          $('.num').text('剩余抽奖次数：0次')
        }
      }
    }
  })
}
getCounts();

$('.load-content-btn').on('click', function () {
  let name, cellPhoneNumber, deliveryAddress;
  console.log(userAwardId);
  console.log(type);
  if (type == 1) {
    cellPhoneNumber = $('.load2 input').val()
    sendPhone($('.load2'));
  } else {
    name = $('.name').val()
    cellPhoneNumber = $('.phone').val()
    deliveryAddress = $('#city').val() + ' ' + $('.city').val()
    sendPhone($('.load1'));
  }

  function sendPhone(box) {
    $.ajax({
      type: 'get',
      url: global + "/ekActivityTurntableDeliveryAddress/saveAddress",
      async: true,
      data: {
        "tokenKey": localStorage.getItem('tokenKey'),
        "userAwardId": userAwardId,
        "type": type,
        "name": name,
        "cellPhoneNumber": cellPhoneNumber,
        "deliveryAddress": deliveryAddress

      },
      success: function (data) {
        console.log(data);
        if (data.code == 200) {
          box.hide();
          getUsers();
          layer.msg('奖品领取成功');
        } else if (data.code == 400) {
          layer.msg(data.msg);
        }
      }
    })
  }

})
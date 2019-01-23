$(function () {
  var tokenKey = localStorage.getItem('tokenKey')
  var userId = localStorage.getItem('userId')
  $.ajax({
    url: global + "/optometrist/capitalAccountDetailList",
    type: "get",
    data: {
      'tokenKey': tokenKey,
      'userId': userId
    },
    success: function (data) {
      var res = data.data;
      var str = '';
      for(var i = 0; i < res.length; i++) {
        if (res[i].budgetType == '0') {
          money = '+ ' + res[i].money;
          drawal = '核销收入'
        } else if(res[i].budgetType == '1') {
          money =  '- ' + res[i].money
          drawal = '提现成功'
        }
        if (res[i].tradeType == '-1') {
          tradeType = '提现'
        } else if (res[i].tradeType == '1') {
          tradeType = '订单'
        } else if (res[i].tradeType == '-2') {
          tradeType = '退款';
          drawal = '用户退款'
        }
        str +=  '<li user-name="">' +
                  '<div class="first clearfix">' +
                    '<span class="to-bank">' + tradeType + '</span>' +
                    '<span class="much-money">' + money + '</span>' +
                  '</div>' +
                  '<div class="second clearfix">' +
                    '<span class="timer">' + res[i].createTime.split('T')[0] + ' ' + res[i].createTime.split('T')[1] + '</span>' +
                    '<span class="state">' + drawal + '</span>' +
                  '</div>' +
                '</li>'
      }
      $('.evalist').append(str)
    }
  });
})
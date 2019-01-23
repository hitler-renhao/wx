$(function () {
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  // 获取银行卡
  $.ajax({
    url: global + "/optometrist/userBankCard",
    type: "get",
    data: {
      'tokenKey': tokenKey,
      'userId': userId,
    },
    success: function (data) {
      console.log(data);
      if (data == 4400) {
        layer.alert('未登录', function () {
          location.href = 'login.html';
        })
      } else if (data.code == 200) {
        switch (data.data.openingBank) {
          case '建设银行':
            $('.bank').prepend('<i class="iconfont icon-jiansheyinhang bank-logo" style="color: #0E3484"></i><span class="bank-name">中国建设银行(' + data.data.bankCard + ')</span>');
            break;
          case '招商银行':
            $('.bank').append('<i class="iconfont icon-zhaoshangyinhang bank-logo" style="color: #E50012"></i><span class="bank-name">招商银行(' + data.data.bankCard + ')</span>');
            break;
          case '上海银行':
            $('.bank').append('<i class="iconfont icon-shanghaiyinxing bank-logo" style="color: #FFCA02"></i><span class="bank-name">上海银行(' + data.data.bankCard + ')</span>');
            break;
          case '兴业银行':
            $('.bank').append('<i class="iconfont icon-xingyeyinhang bank-logo" style="color: #004187"></i><span class="bank-name">兴业银行(' + data.data.bankCard + ')</span>');
            break;
          case '青岛银行':
            $('.bank').append('<i class="iconfont icon-qingdaoyinhang bank-logo" style="color: #D8353B"></i><span class="bank-name">青岛银行(' + data.data.bankCard + ')</span>');
            break;
          case '徽商银行':
            $('.bank').append('<i class="iconfont icon-huishangyinhang bank-logo" style="color: #E50012"></i><span class="bank-name">徽商银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国光大银行':
            $('.bank').append('<i class="iconfont icon-guangdayinhang bank-logo" style="color: #FBE900"></i><span class="bank-name">中国光大银行(' + data.data.bankCard + ')</span>');
            break;
          case '广发银行':
            $('.bank').append('<i class="iconfont icon-guangfayinhang bank-logo"></i><span class="bank-name">广发银行(' + data.data.bankCard + ')</span>');
            break;
          case '华夏银行':
            $('.bank').append('<i class="iconfont icon-huaxiayinhang bank-logo" style="color: #E60012"></i><span class="bank-name">华夏银行(' + data.data.bankCard + ')</span>');
            break;
          case '浦东发展银行':
            $('.bank').append('<i class="iconfont icon-pufayinhang bank-logo"></i><span class="bank-name">浦东发展银行(' + data.data.bankCard + ')</span>');
            break;
          case '台州银行':
            $('.bank').append('<i class="iconfont icon-taizhouyinhang bank-logo" style="color: #7ECEF4"></i><span class="bank-name">台州银行(' + data.data.bankCard + ')</span>');
            break;
          case '温州银行':
            $('.bank').append('<i class="iconfont icon-wenzhouyinhang bank-logo" style="color: #FAA61A"></i><span class="bank-name">温州银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国邮政储蓄银行':
            $('.bank').append('<i class="iconfont icon-zhongguoyouzhengchuxuyinhang bank-logo" style="color: #108C3E"></i><span class="bank-name">中国邮政储蓄银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国民生银行':
            $('.bank').append('<i class="iconfont icon-minshengyinhang bank-logo" style="color: #1D2088"></i><span class="bank-name">中国民生银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国农业银行':
            $('.bank').append('<i class="iconfont icon-nongyeyinhang bank-logo" style="color:#008566"></i><span class="bank-name">中国农业银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国银行':
            $('.bank').append('<i class="iconfont icon-zhongguoyinhang bank-logo" style="color: #AF2434"></i><span class="bank-name">中国银行(' + data.data.bankCard + ')</span>');
            break;
          case '中信银行':
            $('.bank').append('<i class="iconfont icon-zhongxinyinhang bank-logo" style="color: #D7000F"></i><span class="bank-name">中信银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国工商银行':
            $('.bank').prepend('<i class="iconfont icon-gongshangyinhang bank-logo" style="color: #C42B25"></i><span class="bank-name">中国工商银行(' + data.data.bankCard + ')</span>');
            break;
          case '中国交通银行':
            $('.bank').append('<i class="iconfont icon-jiaotongyinhang bank-logo" style="color: #00367A"></i><span class="bank-name">中国交通银行(' + data.data.bankCard + ')</span>');
            break;
        }
      } else if (data.code == 400) {
        layer.alert('您还未绑定银行卡,请先绑定银行卡', function() {
          location.href = 'improve_shop.html?edit=3';
        })
      }
    },
  });
  // 获取余额
  $.ajax({
    url: global + "/optometrist/userCapitalAccount",
    type: "get",
    data: {
      'tokenKey': tokenKey,
      'userId': userId,
    },
    success: function (data) {
      console.log(data);
      if (data == 4400) {
        layer.alert('未登录', function () {
          location.href = 'login.html';
        })
      } else if (data.code == 200) {
        $('.putmoney').append('<span class="most">您最多可提现' + data.data.money + '元</span>')
      }
    },
  });
  // 提现
  $('.submit').click(function () {
    var money = $('.ipt').val()
    $.ajax({
      url: global + "/optometrist/userFinanceWithdraw",
      type: "POST",
      data: {
        'tokenKey': tokenKey,
        'userId': userId,
        'money': money
      },
      success: function (data) {
        console.log(data);
        if (data.code == 200) {
          layer.msg(data.msg, function () {
            location.href = 'mineB.html'
          })
        } else if (data.code == 400) {
          if (data.msg == "{money=提现金额不能小于100元}") {
            layer.msg('提现金额不能小于100元')
          } else if (data.msg == "您尚未支持提现！") {
            layer.msg('网络错误,请稍后再试')
          } else {
            layer.msg(data.msg)
          }
        }
        if (data == 4400) {
          layer.alert('未登录', function () {
            location.href = 'login.html';
          })
        }
      },
    });
  })
})
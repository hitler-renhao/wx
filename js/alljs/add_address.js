$(function () {

  var edit = location.href.split('?')[1];
  var tokenKey = localStorage.getItem('tokenKey');
  var userId = localStorage.getItem('userId');
  if (!!edit) { // 修改地址
    var addressId = edit.split('=')[1];
    console.log(addressId);
    // 回显
    $.ajax({
      type: 'get',
      url: global + "/optometrist/userAddressDetails",
      async: true,
      data: {
        'tokenKey': tokenKey,
        'addressId': addressId
      },
      success: function (data) {
        let res = data.data;
        console.log(res);
        $('#shopName').val(res.receiverName)
        $('#shopPhone').val(res.receiverPhone)
        let area = res.receiverState + ',' + res.receiverCity + ',' + res.receiverDistrict
        $('#city').val(area)
        $('#shopAddress').val(res.receiverAddress)
        switch (res.defaultTag) {
          case '1':
            $('.defaults').attr('src', '../images/default.png');
            break;
          case '0':
            $('.defaults').attr('src', '../images/not_default.png');
            break;
        }
      }
    })
    publics('edit', addressId);
  } else { // 添加地址
    publics('add', '');
  }

  // 提交
  function publics(state, id) {
    $('footer p').click(function () {
      var shopName = $('#shopName').val(); //姓名
      var shopPhone = $('#shopPhone').val(); // 电话
      var shopArea = $('#city').val(); //地区
      var province = shopArea.split(',')[0]; // 省
      var city = shopArea.split(',')[1]; //市
      var area = shopArea.split(',')[2]; //区
      var shopAddress = $('#shopAddress').val(); //详细地址
      var defaultTag = '';
      switch ($('.defaults').attr('src')) {
        case '../images/default.png':
          defaultTag = '1';
          break;
        case '../images/not_default.png':
          defaultTag = '0';
          break;
      }

      var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机号正则
      var telephone = /\d{3}\d{8}|\d{4}\d{7}/;

      // 判断信息是否完整
      if (!shopName || !shopArea || !shopAddress || !shopPhone) {
        alert('请将必填信息填写完整！');
      } else {
        // 验证手机号是否正确
        if (!pattern.test(shopPhone) && !telephone.test(shopPhone)) {
          alert("请输入正确的手机号");
          // 验证地址是否够
        } else if (shopAddress.length < 4) {
          alert('详细地址不得少于4个汉字或字母')
        } else {
          var msg = {
            'tokenKey': tokenKey,
            'userId': userId,
            'receiverName': shopName, // 姓名
            'receiverPhone': shopPhone, // 电话
            'receiverState': province, //地区
            'receiverCity': city, //城市
            'receiverDistrict': area, // 区县
            'receiverAddress': shopAddress, // 收货地址
            'defaultTag': defaultTag, // 默认地址
            "id": id
          }
          switch (state) {
            case 'add':
              publicAjax('/optometrist/addUserAddress', msg);
              break;
            case 'edit':
              publicAjax('/optometrist/updateUserAddress', msg);
              break;
          }

        }
      }
    })
  }

  // 公共ajax请求
  function publicAjax(url, msg) {
    $.ajax({
      type: 'post',
      url: global + url,
      async: true,
      data: msg,
      success: function (data) {
        console.log(data);
        layer.msg('操作成功!')
        setTimeout(function () {
          location.href = "address.html";
        },1000)
      }
    })
  }

  /* 设置默认值 */
  $('.defaults').click(function () {
    if ($(this).attr('src') == '../images/default.png') {
      $(this).attr('src', '../images/not_default.png')
    } else {
      $(this).attr('src', '../images/default.png')
    }
  })
})
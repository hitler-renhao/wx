$(function () {
	// 获取openId
	var tokenKey = localStorage.getItem('tokenKey')
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	}
	// 验光师证书隐藏
	var flag = 1;
//	$('.all').click(function() {
//		flag++;
//		if (flag % 2 == 0) {
//			$('.book').addClass('pic-active');
//			$('.span1').addClass('span-active')
//			$('.span2').removeClass('span-active')
//		} else {
//			$('.book').removeClass('pic-active')
//			$('.span2').addClass('span-active')
//			$('.span1').removeClass('span-active')
//		}
//		
//	})
	//注销
	$('.delete-info').click(function() {
		localStorage.clear();
		location.reload();
	})
	var type = 3;
	// var optometristId = '123';
	localStorage.setItem("typeId", type); //用户类型判断
	// localStorage.setItem("openId", openId); // 判断店铺
	//判断是否登录     获取tokenKey
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证
	var shopId = localStorage.getItem('shopId');
	var userId = localStorage.getItem('userId');
	// 查看消息
	$('#addCar').click(function () {
		// layer.alert('系统升级中，敬请期待！', {
		// 	title: '温馨提示'
		// })
		location.href = 'message_list.html';
	})
	var optometrist = {
		init: function () {
			this.optometristList();
			this.shopname();
		},
		//根据id获取店铺名称
		shopname:function(){
			$.ajax({
				type: "post",
				url: global + "/shop/queryShopByShopId",
				async: true,
				data: {					
					"shopId": shopId
				},
				success: function(data) {
					console.log(data);
					var res = data.data.shop;
					$('.evaluate').text('所属店铺:'+res.shopname);
				}
			});
		},
		//验光师回显
		optometristList: function () {
			$.ajax({
				type: "get",
				url: global + "/optometrist/optometristDetails",
				async: true,
				data: {
					"id": userId,
					"tokenKey": tokenKey,
					// 'typeId': type
				},
				success: function (data) {
					console.log(data);
					if (data.code == 200) {
						var res = data.data;
						if (!res) {
							layer.alert(
								'您的店长还没有将您添加到门店验光师列表中，您暂时无法使用此功能！马上联系您的店长，将您添加到门店验光师后再来体验吧！',
								{title:'温馨提示'}
								)
						} else {
							// var href = '../html/optometrist_enter.html?optometristId=' + optometristId + '&edit=1'
							$('.name').text(res.name);
							$('.book').attr('src', res.certificateImage);
							$('.style1').css({
								'background': 'url(' + res.image + ') no-repeat',
								'background-size': 'cover',
								'background-position': 'center center',
							});
							$('.begoodat').text(res.introduction);
							$('.createby').text(res.specialty);
							// $('.edit-info').attr('href', href)
							var res = JSON.parse(data.data.optometristSkills);
							var str = '';
							console.log(res);
							for(var i = 0;i<res.length;i++){
								str += '<li>'+ res[i].title +'</li>'
							}
							$('.proList').append(str);
						}

					} else if (data == 4400) {
						// console.log(data);
						layer.alert('未登录', function () {
							location.href = 'login.html';
						})
					}

				},
				error: function () {
					layer.alert('未登录', function () {
						location.href = 'login.html';
					})
				}
			});
		}
	}
	optometrist.init();
})
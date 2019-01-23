$(function () {
	var href = window.location.href;
	// 获取门店验光师id
	var optometristId = href.split('?')[1].split('=')[1];

	// var type = href.split('?')[1].split('&')[0].split('=')[1]; // 用户类型
	// var openId = href.split('?')[1].split('&')[1].split('=')[1]; // 微信用户账号
	var type = 3;
	var openId = '123';
	localStorage.setItem("typeId", type); //用户类型判断
	// localStorage.setItem("openId", openId); // 判断店铺
	//判断是否登录     获取tokenKey
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证	
	var shopId = localStorage.getItem('shopId');

	var optometrist = {
		init: function () {
			this.optometristList();
		},
		optometristList: function () {
			$.ajax({
				type: "get",
				url: global + "/optometrist/shopOptometristDetails",
				async: true,
				data: {
					"id": optometristId,
					"tokenKey": tokenKey,
					// 'typeId': type
				},
				success: function (data) {
					if (data.code == 200) {
						console.log(data);
						var res = data.data;
						var href = '../html/optometrist_enter.html?optometristId=' + optometristId + '&edit=1'
						$('.name').text(res.ekOptometrist.name);
						$('.book').attr('src', res.ekOptometrist.certificateImage);
						$('.style1').css({
							'background': 'url(' + res.ekOptometrist.image + ') no-repeat',
							'background-size':'cover',
							'background-position': 'center center',
						});
						$('.begoodat').text(res.ekOptometrist.introduction);
						$('.createby').text(res.ekOptometrist.specialty);
						$('.edit-info').attr('href', href)
					} else if (data == 4400) {
						layer.alert('未登录', function() {
							location.href = 'login.html';
						})
					}
					
				}
			});
		}
	}
	optometrist.init();
	// 删除验光师
	$('#edit-optometrist').click(function () {
		$.ajax({
			type: "post",
			url: global + "/optometrist/expelShopOptometrist",
			async: true,
			data: {
				"id": optometristId,
				"tokenKey": tokenKey,
				"shopId": shopId
				// 'typeId': type
			},
			success: function (data) {
				location.href = './shop_info.html'
			}
		})
	})
})
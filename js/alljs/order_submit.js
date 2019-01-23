$(function () {
	// 获取openId
	var tokenKey = localStorage.getItem('tokenKey')
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	}

	var productId = location.search.substring(1).split('=')[1];

	//获取当前积分
	$.ajax({
		type: "post",
		url: global + "/ekIntegral/list",
		async: true,
		data: {
			"tokenKey": tokenKey,
			"pageNum": 1,
			"pageSize": 100
		},
		success: function (data) {
			if (data.code == 200) {
				integral = data.data.integral;
				$('.has-point').text('您当前拥有：' + integral + '积分');
			} else if (data == 4400) {
				layer.alert('未登录', function () {
					location.href = 'login.html'
				})
			}
		}
	})
	var order = {
		init: function () {
			this.getgoodsInfo();
			this.submit();
		},
		//根据id获取商品信息
		getgoodsInfo: function () {
			$.ajax({
				type: "POST",
				url: global + "/ekIntegralProduct/pu/queryProductByid",
				async: true,
				data: {
					"productId": productId
				},
				success: function (data) {
					var res = data.data;
					var str = '';
					//获取图片
					//					for(var i=0;i<res.url.length;i++){
					//						str += '<div class="swiper-slide">'
					//						    +      '<img src="'+ res.url[i]+'" alt="" class="head-img">'
					//						    +   '</div>'
					//					}
					//					$('#shopHeaderList .swiper-wrapper').append(str);
					//					var mySwiper = new Swiper('.swiper-container', {
					//				        autoplay: true, //可选选项，自动滑动
					//				        loop: true,
					//				    })
					$('.head-img').attr('src', res.url);
					// $('.has-point').text('您当前拥有：' + integral + '积分');
					$('.need-point strong').text(res.name);
					$('.need-point p span').text(res.number + '分');
					$('.shopcon p').text(res.content);
				}
			});
		},
		//兑换商品
		submit: function () {
			$('footer p').on('click', function () {
				var takeName = $('#shopName').val();
				var takePhone = $('#shopPhone').val();
				var city = $('#city').val();
				var addressInfo = $('#shopAddress').val();
				var address = city.split(',');
				var takeAddress = address[0] + address[1] + address[2] + addressInfo;
				var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机号正则
				if (!takeName || !takePhone || !city || !addressInfo) {
					layer.alert('请将信息填写完整！');
				} else {
					if (pattern.test(takePhone)) {
						$.ajax({
							type: "POST",
							url: global + "/ekIntegralOrder/buyProduct",
							async: true,
							data: {
								"tokenKey": tokenKey,
								"productId": productId,
								"takeName": takeName,
								"takePhone": takePhone,
								"takeAddress": takeAddress //不知道是不是完整地址
							},
							success: function (data) {
								console.log(data);
								if (data.code == 200) {
									layer.msg("兑换成功");
									setTimeout(function () {
										location.href = 'order_list.html';
									}, 500)
								} else if (data.code == 400) {
									layer.msg(data.msg)
								}
							}
						})
					} else {
						layer.msg("请输入正确的手机号");
					}
				}
			})
		}
	}
	order.init();

})
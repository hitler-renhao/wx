$(function () {
	var href = location.href;
	var getOpenId = href.split('?')[1].split('=')[1];
	var setmealid = localStorage.getItem('setmealid');
	var tokenKey = localStorage.getItem('tokenKey')
	var setmealid = localStorage.getItem('setmealid');
	$.ajax({
		type: 'post',
		url: global + "/ekSetMeal/pu/setMealinfo",
		async: true,
		data: {
			'setmealid': setmealid, // 店铺ID
		},
		success: function (data) {
			if (data.code == 200) {
				var res = data.data
				console.log(res);
				// 渲染顶部轮播图
				var strSwiper = '';
				for (var i = 0; i < res.setmealFile.length; i++) {
					if (res.setmealFile[i].type == 1) {
						$('.swiper-wrapper').append('<div class="swiper-slide"><img src="' + res.setmealFile[i].url + '" alt="" class="head-img"></div>');
					}
				}
				for (var i = 0; i < res.setmealFile.length; i++) {
					if (res.setmealFile[i].type == 2) {
						strSwiper += '<div class="swiper-slide">' +
							'<img src="' + res.setmealFile[i].url + '" alt="" class="head-img">' +
							'</div>'
					}
				}
				$('.swiper-wrapper').append(strSwiper);
				// 图片轮播
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: true, //可选选项，自动滑动
					loop: true,
				})

				// 基本信息渲染
				var strNav = '';
				strNav = '<div class="combo_title">' +
					'<h3 class="shop-name">' + res.shop.shop.shopname + '</h3>' +
					'<p>' + res.setmeal.explains + '</p>' +
					'</div>' +
					'<div class="combo_money">' +
					'<span class="nowPrice">¥ <i>' + res.setmeal.nowPrice + '</i></span>' +
					'<span class="oldPrice">原价: ¥ <i>' + res.setmeal.price + '</i></span>' +
					'<div id="consult" class="btn fr">' +
					'<a href="javascript:;" class="buyNow">立即购买</a>' +
					'</div>' +
					'</div>' +
					'<div class="refund">' +
					'<span><i class="iconfont icon-chenggong"></i>随时退</span>' +
					'<span><i class="iconfont icon-chenggong"></i>过期自动退</span>' +
					'</div>'
				$('#popularList').append(strNav);

				// 商家信息
				var shopInfo = '';
				var addresInfo = '';
				for (var i = 0; i < 3; i++) {
					addresInfo += res.shop.shop.addresInfo.split(',')[i]
				}
				shopInfo = '<li class="shop-name-detail">' +
					'<p>' + res.shop.shop.shopname + '</p>' +
					'</li>' +
					'<li class="shop-address">' +
					'<p>地址: ' + addresInfo + res.shop.shop.addres + '</p>' +
					'</li>' +
					'<li class="shop-tel">' +
					'<p>电话: ' + res.shop.shop.phone + '</p>' +
					'</li>'
				$('.detail-ul').append(shopInfo)
				$('.telphone').attr('href', 'tel:' + res.shop.shop.phone)

				// 套餐详细信息
				var comboDetail = '';
				var endTime = res.setmeal.time.split('T')[0];
				comboDetail = '<h3 class="shop-name">套餐(' + endTime + ')</h3>' +
					'<table>' +
					'<tbody>'
				var totalPrice = 0;
				for (var i = 0; i < res.setmealAtt.length; i++) {
					comboDetail += '<tr>' +
						'<td><p>' + res.setmealAtt[i].specName + '</p></td>' +
						'<td><p>' + res.setmealAtt[i].specSum + res.setmealAtt[i].specCompany + '</p></td>' +
						'<td align="right"><p>' + res.setmealAtt[i].specPrice.toFixed(2) + '元</p></td>' +
						'</tr>'
					totalPrice += res.setmealAtt[i].specPrice;
				}
				comboDetail += '</tbody>' +
					'</table>' +
					'<ul>' +
					'<li align="right" class="money">总价: ' + totalPrice.toFixed(2) + '元</li>' +
					'<li align="right" class="money">现价: ' + res.setmeal.nowPrice.toFixed(2) + '元</li>' +
					'</ul>'
				$('.combo-detail').append(comboDetail);
			} else if (data == 4400) {
				layer.alert('未登录', function () {
					location.href = '../html/login.html';
				})
			}
		}
	})


	if (getOpenId == 2) {
		getOpenid();
	}

	$('#popularList').on('click', '.buyNow', function () {
		var setmealid = localStorage.getItem('setmealid');
		$.ajax({
			type: "post",
			url: global + "/ekSetMeal/buySetMeal",
			dataType: "json",
			async: 'true',
			data: {
				"tokenKey": tokenKey,
				"setmealid": setmealid,
			},
			success: function (data) {
				if (data == 4400) {
					layer.alert('未登录', function () {
						location.href = './login.html';
					})
				} else if (data.code == 200) {
					var orderId = data.data.id;
					setTimeout(function () {
						H5Pay(orderId);
					}, 500)
				} else if (data.code == 400) {
					layer.msg(data.msg)
				}

			}
		});
	})
	// 获取openId
	// 购买套餐生成订单号



	function H5Pay(orderId) {
		var openid = localStorage.getItem('openId');
		$.ajax({
			type: "post",
			url: global + "/wechatpay/weChatH5Pay",
			dataType: "json",
			async: 'true',
			data: {
				"body": "套餐订单-" + orderId,
				"openId": openid,
				'outTradeNo': orderId,
				'tokenKey': tokenKey
			},
			success: function (data) {
				if (data.code == 200) {
					var res = data.data;
					setTimeout(function () {
						onBridgeReady(res);
					}, 500)
				} else {
					layer.msg('您所处的网络环境不佳!')
				}
			}
		});

		function onBridgeReady(res) {
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId": res.appId,
					"timeStamp": res.timeStamp,
					"nonceStr": res.nonceStr,
					"package": res.package,
					"signType": 'MD5',
					"paySign": res.paySign
				},
				function (res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						location.href = 'My_mealCoupon.html'
					} else if (res.err_msg == "total_fee") {
						alert('付款失败!')
					}
				}
			);
		}
		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			// onBridgeReady();
		}
	}
})
$(function () {
	var href = location.href;
	var setmealid = href.split('?')[1].split('=')[1];
	var tokenKey = localStorage.getItem('tokenKey')
	// var setmealid = '455f4f25-3dae-4f2b-8862-4a7137df0a66';
	// 获取二维码
	$.ajax({
		url: global + '/ekSetMealOrder/querySetmealOrderImg',
		type: 'post',
		async: true,
		data: {
			'tokenKey': tokenKey,
			'orderId': setmealid
		},
		success: function (data) {
			var res = data.data;
			console.log(res);
			$('.imgs img').attr('src', res.path);
			$('.code').text(res.code);
		}
	})
	$.ajax({
		type: 'post',
		url: global + "/ekSetMealOrder/querySetmealOrderInfo",
		async: true,
		data: {
			'tokenKey': tokenKey,
			'orderId': setmealid,
		},
		success: function (data) {
			if (data.code == 200) {
				// 暂存经纬度
				localStorage.setItem('longitude', data.data.setmealinfo.shop.shop.longitude)
				localStorage.setItem('latitude', data.data.setmealinfo.shop.shop.latitude)
				var type = data.data.order.userType;
				if (type == 'use' || type == 'expired') {
					$('.userd').show();
					$('.combo-detail').on('click', '.draw_back', function () {
						$(this).css({
							'disabled': true
						})
					})
				} else if (type == 'unuse') {
					// 申请退款
					$('.combo-detail').on('click', '.draw_back', function () {
						//alert(1);
						$.ajax({
							type: "POST",
							url: global + "/ekSetMealOrder/setMealRefund",
							async: true,
							data: {
								'tokenKey': tokenKey,
								"orderId": setmealid
							},
							success: function (data) {
								console.log(data);
								//alert(JSON.stringify(data));
								if (data.code == 200) {
									layer.confirm('确认要退款吗', {
										btn: ['确定', '取消'],
										btn1: function () {
											layer.alert('退款成功', function () {
												location.href = 'My_mealCoupon.html'
											});
										}
									});
								} else if (data.code == 400) {
									layer.msg('系统繁忙, 请稍后再试');
								}
							}
						});
					})
				}
				var res = data.data;
				console.log(res);
				// 商家信息
				var shopInfo = '';
				var addresInfo = '';
				for (var i = 0; i < 3; i++) {
					addresInfo += res.setmealinfo.shop.shop.addresInfo.split(',')[i]
				}
				shopInfo = '<li class="shop-name-detail">' +
					'<p>' + res.setmealinfo.shop.shop.shopname + '</p>' +
					'</li>' +
					'<li class="shop-address">' +
					'<p>地址: ' + addresInfo + res.setmealinfo.shop.shop.addres + '</p>' +
					'</li>' +
					'<li class="shop-tel">' +
					'<p>电话: ' + res.setmealinfo.shop.shop.phone + '</p>' +
					'</li>'
				$('.detail-ul').append(shopInfo)
				$('.telphone').attr('href', 'tel:' + res.setmealinfo.shop.shop.phone)
				localStorage.setItem('shop_address', addresInfo + res.setmealinfo.shop.shop.addres)
				localStorage.setItem('shop_name', res.setmealinfo.shop.shop.shopname)

				// 套餐详细信息
				var comboDetail = '';
				// var endTime = res.setmeal.time.split('T')[0];
				comboDetail = '<h3 class="shop-name">套餐</h3>' +
					'<table>' +
					'<tbody>'
				var totalPrice = 0;
				for (var i = 0; i < res.setmealinfo.setmealAtt.length; i++) {
					comboDetail += '<tr>' +
						'<td><p>' + res.setmealinfo.setmealAtt[i].specName + '</p></td>' +
						'<td><p>' + res.setmealinfo.setmealAtt[i].specSum + res.setmealinfo.setmealAtt[i].specCompany + '</p></td>' +
						'<td align="right"><p>' + res.setmealinfo.setmealAtt[i].specPrice + '元</p></td>' +
						'</tr>'
					totalPrice += res.setmealinfo.setmealAtt[i].specPrice;
				}
				comboDetail += '</tbody>' +
					'</table>' +
					'<ul>' +
					'<li align="right" class="money">总价: ' + totalPrice + '元</li>' +
					'<li align="right" class="money">现价: ' + res.setmealinfo.setmeal.nowPrice + '元</li>' +
					'</ul>' +
					'<div class="back" align="right"><a href="javascript:;" class="draw_back">申请退款</a></div>'
				$('.combo-detail').append(comboDetail);
			} else if (data == 4400) {
				layer.alert('未登录', function () {
					location.href = '../html/login.html';
				})
			}
		}
	})


	// 进店导航
	$('.submit').click(function () {

		wx.ready(function () {

			// 获取用户自己位置
			wx.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					var latitude = localStorage.getItem('latitude') // 纬度，浮点数，范围为90 ~ -90
					var longitude = localStorage.getItem('longitude') // 经度，浮点数，范围为180 ~ -180。
					bMapTransWXMap(longitude, latitude)
				}
			});


			// 百度地图加密经纬度BD09 转 国测局加密GCJ02 算法
			function bMapTransWXMap(lng, lat) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = lng - 0.0065;
				let y = lat - 0.006;
				let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
				let lngs = z * Math.cos(theta);
				let lats = z * Math.sin(theta);

				console.log('GCJ02-----' + lngs)
				console.log('GCJ02-----' + lats)
				navigation(lats, lngs)
			}

			// 调起导航
			function navigation(latitude, longitude) {
				var shop_name = localStorage.getItem('shop_name');
				var shop_address = localStorage.getItem('shop_address');
				wx.openLocation({
					latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
					longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
					name: shop_name, // 位置名
					address: shop_address, // 地址详情说明
					scale: 25, // 地图缩放级别,整形值,范围从1~28。默认为最大
					// infoUrl: 'https://www.baidu.com/' // 在查看位置界面底部显示的超链接,可点击跳转
				});
			}

		});
		wx.error(function (res) {
			alert(res.errMsg);
		});
	})
})
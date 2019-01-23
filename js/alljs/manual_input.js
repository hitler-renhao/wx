$(function () {
	//获取tokenKey
	var tokenKey = localStorage.getItem('tokenKey');
	//手动输入获取套餐券
	$('.sure').click(function () {
		var code = $('#code').val();
		$.ajax({
			type: "POST",
			url: global + "/ekSetMealOrder/setMealOrderDetails",
			async: true,
			data: {
				"tokenKey": tokenKey,
				"code": code
			},
			success: function (data) {
				if (data.code == 400) {
					layer.alert('套餐优惠码已过期或无效优惠码')
				}
				//状态    use 使用，unuse未使用，expired过期
				var type = data.data.order.userType;
				var res = data.data.setmealinfo.setmealAtt;
				var str = '';
				var shophead = data.data.setmealinfo.shop.imgs;
				var strprice = data.data.setmealinfo.setmeal;
				for (var j = 0; j < shophead.length; j++) {
					if (shophead[j].type == '1') {
						$('.input').attr('src', shophead[j].imagePath);
					}
				}
				//未使用状态
				if (type == 'unuse') {
					$('.usedresults').hide();
					$('.acacac').show();
					for (var i = 0; i < res.length; i++) {
						str += '<li>' +
							'<p>' + res[i].specName + '</p>' +
							'<p>' + res[i].specSum + res[i].specCompany + '</p>' +
							'<p>' + res[i].specPrice + '元</p>' +
							'</li>'
					}
					$('.mealList').append(str);
					$('.money i').text(strprice.nowPrice);
					$('#allprice').text('总价:' + strprice.price + '元');
					$('#nowprice').text('现价:' + strprice.nowPrice + '元');
					$('.sureUse').on('click', function () {
						//搜索套餐券
						$.ajax({
							type: "POST",
							url: global + "/ekSetMealOrder/verificationSetMeal",
							async: true,
							data: {
								"tokenKey": tokenKey,
								"code": code
							},
							success: function (data) {
								if (data.code == 200) {
									layer.msg('核销成功！');
									//核销成功跳转
									setTimeout(function() {
										location.href = 'shop_info.html';
									},500)
								} else if (data.code == 400) {
									layer.msg('优惠码已失效');
								}
							}
						});
					})
					//已使用、过期状态
				} else if (type == 'use' || type == 'expired') {
					var str2 = '';
					$('.usedresults').hide();
					$('.usedResult').show();
					for (var i = 0; i < res.length; i++) {
						str2 += '<li>' +
							'<p>' + res[i].specName + '</p>' +
							'<p>' + res[i].specSum + res[i].specCompany + '</p>' +
							'<p>' + res[i].specPrice + '元</p>' +
							'</li>'
					}
					$('#mealList').append(str2);
					$('.moneyused i').text(strprice.nowPrice);
					$('#allP').text('总价:' + strprice.price + '元');
					$('#nowP').text('现价:' + strprice.nowPrice + '元');
					//回主页
					$('.sureUsed').on('click', function () {
						location.href = 'shop_info.html';
					})
				}
			}

		});

	})
	/*
	 * 注意：
	 * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
	 * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
	 * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
	 *
	 * 如有问题请通过以下渠道反馈：
	 * 邮箱地址：weixin-open@qq.com
	 * 邮件主题：【微信JS-SDK反馈】具体问题
	 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
	 */

	wx.ready(function () {
		// 9 微信原生接口
		// 9.1.2 扫描二维码并返回结果
		document.querySelector('#scanQRCode1').onclick = function () {
			show();
		};
		document.querySelector('#scanQRCode2').onclick = function () {
			show();
		};

		function show() {
			wx.scanQRCode({
				needResult: 1,
				desc: 'scanQRCode desc',
				success: function (res) {
					//获取code;
					var result = res.resultStr;

					$.ajax({
						type: "POST",
						url: global + "/ekSetMealOrder/setMealOrderDetails",
						async: true,
						data: {
							"tokenKey": tokenKey,
							"code": result
						},
						success: function (data) {
							// alert(JSON.stringify(data))
							if (data.code == 400) {
								layer.alert('二维码已过期或无效二维码')
							}
							//状态    use 使用，unuse未使用，expired过期
							var type = data.data.order.userType;
							var res = data.data.setmealinfo.setmealAtt;
							var str = '';
							var shophead = data.data.setmealinfo.shop.imgs;
							var strprice = data.data.setmealinfo.setmeal;

							for (var j = 0; j < shophead.length; j++) {
								if (shophead[j].type == '1') {
									$('.input').attr('src', shophead[j].imagePath);
								}
							}
							//未使用状态
							if (type == 'unuse') {
								$('.usedresults').hide();
								$('.acacac').show();
								for (var i = 0; i < res.length; i++) {
									str += '<li>' +
										'<p>' + res[i].specName + '</p>' +
										'<p>' + res[i].specSum + res[i].specCompany + '</p>' +
										'<p>' + res[i].specPrice + '元</p>' +
										'</li>'
								}
								$('.mealList').append(str);

								$('.money i').text('￥' + strprice.nowPrice);
								$('#allprice').text('总价:' + strprice.price + '元');
								$('#nowprice').text('现价:' + strprice.nowPrice + '元');
								$('.sureUse').on('click', function () {
									//搜索套餐券
									$.ajax({
										type: "POST",
										url: global + "/ekSetMealOrder/verificationSetMeal",
										async: true,
										data: {
											"tokenKey": tokenKey,
											"code": result
										},
										success: function (data) {
											if (data.code == 200) {
												layer.msg('核销成功！');
												setTimeout(function () {
													location.href = 'shop_info.html';
												}, 500)
											} else if (data.code == 400) {
												layer.msg('优惠码已失效');
											}
										}
									});
								})
								//已使用、过期状态
							} else if (type == 'use' || type == 'expired') {
								var str2 = '';
								$('.usedresults').hide();
								$('.usedResult').show();
								for (var i = 0; i < res.length; i++) {
									str2 += '<li>' +
										'<p>' + res[i].specName + '</p>' +
										'<p>' + res[i].specSum + res[i].specCompany + '</p>' +
										'<p>' + res[i].specPrice + '元</p>' +
										'</li>'
								}
								$('#mealList').append(str2);
								//回主页
								$('.sureUsed').on('click', function () {
									location.href = 'shop_info.html';
								})
							}

						}
					});
				},
				//识别失败
				fail: function (res) {
					//location.href = 'scan_reaultsError.html'
					$('.resultError').show();
					$('.usedresults').hide();
					$('.resultError').parents().css({
						'background': '#fff'
					})
				}
			})
		}

	});

	wx.error(function (res) {
		alert(res.errMsg);
	});

})
$(function () {
	var tokenKey = localStorage.getItem('tokenKey')
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	} else {
		layer.msg('未登录', function () {
			location.href = 'login.html'
		})
	}


	$('#scroller, .imgbox').click(function () {
		$('#shop-details').addClass('active').siblings().removeClass('active');
		$('#products').css({
			'display': 'none'
		})
		$('#shopdel').css({
			'display': 'inherit'
		})
	})

	// tab栏切换
	$('#product-display').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#shopdel').css({
			'display': 'none'
		})
		$('#products').css({
			'display': 'inherit'
		})
	})
	$('#shop-details').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#products').css({
			'display': 'none'
		})
		$('#shopdel').css({
			'display': 'inherit'
		})
	})
	$(function () {
		$(window).scroll(function () {
			// console.log($(window).scrollTop());
			if ($(window).scrollTop() >= 450) {
				$('.left-tab').css({
					'position': 'fixed',
					'top': '0',
					'left': 0
				})
			} else {
				$('.left-tab').css({
					'position': 'absolute',
					'top': '9.2rem',
					'left': 0
				})
			}
		});
	});

	// 商品展示
	$('.left-tab > a').click(function () {
		$(this).addClass('actives').siblings().removeClass('actives');
	})
	$('.left-tab > li').click(function () {
		$(this).addClass('actives').siblings().removeClass('actives');
	})
	// var href = window.location.href;
	// var type = href.split('?')[1].split('&')[0].split('=')[1]; // 用户类型
	var type = 1;
	// var openId = href.split('?')[1].split('&')[1].split('=')[1]; // 微信用户账号
	var openId = '123';
	localStorage.setItem("typeId", type); //获取判断
	localStorage.setItem("openId", openId); // 判断店铺
	var shopId = localStorage.getItem('shopId'); // 获取商家信息ID
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证

	// 注销
	$('.delete-info').click(function () {
		localStorage.clear();
		location.reload();
	})
	localAjax(shopId, global + "/shop/queryShopByUser");

	function localAjax(shopIds, url) {

		var flag = localStorage.getItem('flag');
		//获取门店id
		var infoId = location.search.substring(1);
		var shop = {
			init: function () {
				this.shopList();
				this.optmerist();
			},
			// 获取商家信息
			shopList: function () {
				$.ajax({
					type: "post",
					url: url,
					data: {
						'tokenKey': tokenKey
					},
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							// console.log(data.data.shop.id);
							localStorage.setItem('shopId', data.data.shop.id)
							var res = data.data.shop;
							var result = data.data.imgs;
							$('.name').text(res.shopname); // 店铺名
							$('#shoptel').append('<a href="tel:' + res.phone + '" class="telephone" style="color:#1E9FFF">电话:' + res.phone + ' </a>'); // 电话
							//							$('#shoptel').text('tel:' + res.phone); // 电话
							var address = res.addresInfo.split(',');
							$('.address span').text('地址：' + address[0] + address[1] + address[2] + res.addres); // 区域加详细地址
							localStorage.setItem('area', address[0] + ',' + address[1] + ',' + address[2]);
							localStorage.setItem('address', res.addres)
							$('.shop').text(res.introduce); // 商铺介绍
							$('#shoptime i').text('营业时间：' + res.businessHours); // 营业时间
							localStorage.setItem('businessHours', res.businessHours);
							var str = ''
							for (var i = 0; i < result.length; i++) {
								if (result[i].type == '1') {
									$('.user').attr('src', result[i].imagePath);
									$('.style1').css({
										"background": "url(" + result[i].imagePath + ") no-repeat",
										"background-size": "cover",
										"background-position": "center center"
									})
								} else if (result[i].type == '2') {
									str += '<img src="' + result[i].imagePath + '" class="shopdel1" />'
								}
							}
							$('.shopdel').append(str);

						} else if (data == 4400) {
							layer.alert('未登录', function () {
								location.href = 'login.html';
							})

						} else if (data.code == 400) {
							layer.alert('请完善店铺信息！', function () {
								location.href = '../html/shop_enter.html?edit=1'
							})
						}

					}
				});
			},
			// 渲染验光师
			optmerist: function () {
				$.ajax({
					type: "get",
					url: global + "/optometrist/shopOptometristList",
					// url: "http://192.168.1.8:8181/shop/shopOptometristList",	// 万里
					async: true,
					data: {
						'shopId': shopIds,
						'tokenKey': tokenKey,
						'typeId': type
					},
					success: function (data) {
						console.log(data);

						if (data.code == 200) {
							// var res = data.data.shop;
							// console.log(data);
							var str = '';
							for (var i = 0; i < data.data.length; i++) {
								if (!data.data[i].name) {} else {
									str +=
										'<dl class="edit-optometrist" data-id="' + data.data[i].id + '">' +
										'<dt><img src="' + data.data[i].image + '"></dt>' +
										'<dd>' +
										'<p>' + data.data[i].name + '</p>' +
										'<p>' + data.data[i].introduction + '</p>' +
										'</dd>' +
										'</dl>'
								}

							}
							$('.comment_list').append(str);
						} else if (data == 4400) {
							// console.log(data);
							layer.alert('未登录', function () {
								location.href = '../html/login.html';
							})

						}

					}
				});
			}
		}
		shop.init();
	}
	$('html').on('click', '.edit-optometrist', function () {
		var optometristId = $(this).attr('data-id');
		// console.log(optometristId);
		location.href = './optometrist_info.html?id=' + optometristId;
	})
	$('html').on('click', '.add-optometrist', function () {
		var optometristId = localStorage.getItem('shopId');
		location.href = './optometrist_enter.html?optometristId=' + optometristId + '&edit=2';
	})
	// 跳转消息列表
	$('.message_list').click(function () {
		location.href = 'message_list.html';
	})
	// 跳转店铺主页
	$('.shop_info').click(function () {
		location.href = 'shop_info.html';
	})
	// 跳转我的
	$('.mine').click(function () {
		location.href = 'mineB.html';
	})

	// 商品展示
	// 店内设商品列表
	var url1 = global + "/ekProduct/pu/productList";

	//	getIds('preferentialTpl', '#preferentialList');
	getIds('mirrorTpl', '#mirrorList');
	getIds('contactLensesTpl', '#contactLensesList');
	getIds('lensTpl', '#lensList');
	getIds('sunGlassesTpl', '#sunGlassesList');
	getIds('presbyopicGlassesTpl', '#presbyopicGlassesList');
	getIds('niceGlassesTpl', '#niceGlassesList');

	function getIds(Tpl, List) {
		var ordersTpl1 = document.getElementById(Tpl).innerHTML;
		var ordersList1 = $(List);
		publicAjax(ordersTpl1, ordersList1, url1, shopId, tokenKey, 1, 100);
	}

	// var ordersTpl2 = document.getElementById('mirrorTpl').innerHTML;
	// var ordersList2 = $('#mirrorList');
	// publicAjax(ordersTpl2, ordersList2, url1, '', tokenKey);

	function publicAjax(tpl, list, url, shopId, tokenKey, pageNum, pageSize, leftId) {
		$.ajax({
			type: 'post',
			url: url,
			async: true,
			data: {
				'tokenKey': tokenKey,
				'shopId': shopId,
				'pageNum': pageNum,
				'pageSize': pageSize,
				'leftId': leftId,
				'off': 'on'
			},
			success: function (data) {
				console.log(data);
				var html = template(tpl, data);
				list.html(html);
			}
		});
	}

	// 新增商品
	$('.add-products').click(function () {
		location.href = 'add_goods.html';
	})
	$('.shop-goods').on('click', '.textttt', function () {
		console.log($(this))
		var id = $(this).attr('data-id');
		location.href = 'edit_goods.html?id=' + id + '&q';
	})

	//获取服务项目	
	$.ajax({
		type: 'post',
		url: global + '/shop/queryShopByShopId',
		async: true,
		data: {
			'shopId': shopId
		},
		success: function (data) {
			console.log(data);
			if (data.code == 200) {
				var str = '';
				var res = JSON.parse(data.data.shop.shopSkills);
				console.log(res);
				for (var i = 0; i < res.length; i++) {
					str += '<li>' + res[i].title + '</li>'
				}
				$('.proList').append(str);
			}

		}
	})
	//配镜套餐
	$.ajax({
		type: 'post',
		url: global + "/ekSetMeal/pu/list",
		async: true,
		data: {
			'pageNum': 1,
			'pageSize': 100,
			'shopId': shopId, //'020208ac-866b-4bb7-9d30-10a01aed7591', // 店铺ID
			'off': 1 //上架
		},
		success: function (data) {
			if (data.code == 200) {
				var res = data.data;
				console.log(res);
				var str = ''
				var url = '';
				for (var i = 0; i < res.length; i++) {
					if (!res[i].file) {
						url = '';
					} else {
						url = res[i].file.url;
					}
					str += '<li class="textLi" data-id="' + res[i].setmeal.id + '">' +
						'<img src="' + url + '" alt="假装有图">' +
						'<p class="product-text1">' + res[i].setmeal.name + '</p>' +
						'<p class="product-text">' +
						'<del>原价:¥<span>' + res[i].setmeal.price.toFixed(2) + '</span></del><span class="space"></span>' +
						'<span class="now-price">现价:¥<b>' + res[i].setmeal.nowPrice.toFixed(2) + '</b></span>' +
						'</p>' +
						'</li>'
				}
				$('#hotList').append(str);
				//点击套餐跳转
				$('#hotList li').click(function () {
					var editId = $(this).attr('data-id');
					console.log(editId);
					location.href = "edit_combo.html?editId=" + editId + "";
				})
			} else if (data == 4400) {
				layer.alert('未登录', function () {
					// location.href = '../html/login.html';
				})
			}
		}
	})

})
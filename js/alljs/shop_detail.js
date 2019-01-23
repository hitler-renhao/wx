$(function() {
	// 获取openId
	var tokenKey = localStorage.getItem('tokenKey')
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	}
	
	$('.goodsNone').css({
		'display': 'none'
	})
	localStorage.setItem('typeId', 6);
	//新加   写评价判断是否登录
	var shopId = localStorage.getItem('shopId');
	var leftId = localStorage.getItem('shopId');
	var infoId = $(this).attr('data-id');
	
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证
	$('#evaluate').click(function() {
		if(tokenKey == null || tokenKey == "") {
			layer.alert('您还未登录，请先登录', function() {
				localStorage.setItem('typeId', '5')
				location.href = 'login.html?shopId=' + shopId;
			})
		} else {
			var infoId = $(this).attr('data-id');
			location.href = 'shop_evaluation.html?shopId=' + shopId + '&infoId=' + infoId;
		}
	})
	$('#consult').click(function() {
		localStorage.getItem('tokenKey')
		if(!tokenKey) {
			layer.alert('登录之后才能进行咨询', function() {
				location.href = 'login.html';
			})
		} else {
			location.href = 'Online_Service_C.html?shopId=' + shopId;
		}
	})
	//以上会会加

	// tab栏切换
	$('#product-display').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('#mall-detail').css({
			'display': 'none'
		})
		$('#products').css({
			'display': 'block'
		})
	})
	$('#shop-details').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('#products').css({
			'display': 'none'
		})
		$('#mall-detail').css({
			'display': 'block'
		})
	})
	$('#shopStaffList').on('click', '.shop-staff-detail', function() {
		var infoId = $(this).attr('data-id');
		location.href = 'optometrist_detail.html?shopId=' + shopId + '&infoId=' + infoId;
	})
	// 左侧tab栏定位
	$(function() {
		$(window).scroll(function() {
			// console.log($(window).scrollTop());
			//			if($(window).scrollTop() >= 500) {
			//				$('.swiList').css({
			//					'position': 'fixed',
			//					'top': 0,
			//					'left': 0
			//				})
			//			} else {
			//				$('.swiList').css({
			//					'position': 'absolute',
			//					'top': '8.9rem',
			//					'left': 0
			//				})
			//			}
		});
	});
	// 商品展示
	$('.left-tab > a').click(function() {
		$(this).addClass('actives').siblings().removeClass('actives');
	})

	// 获取店铺Id
	var href = location.href;
	var shopId = href.split('?')[1].split('=')[1].split('#')[0].split('&')[0];
	var tokenKey = localStorage.getItem('tokenKey'); // 获取用户tokenKey
	// 基本信息
	var ordersTpl1 = document.getElementById('popularTpl').innerHTML;
	var ordersList1 = $('#popularList');
	var url1 = global + "/shop/queryShopByShopId";
	publicAjax('post', ordersTpl1, ordersList1, url1, shopId)

	// 顶部图片
	var ordersTpl2 = document.getElementById('shopHeaderTpl').innerHTML;
	var ordersList2 = $('#shopHeaderList');
	var url2 = global + "/shop/queryShopByShopId";
	publicAjax('post', ordersTpl2, ordersList2, url2, shopId);


	// 店内设施介绍
	var ordersTpl4 = document.getElementById('shopDetailTpl').innerHTML;
	var ordersList4 = $('#shopDetailList');
	var url4 = global + "/shop/queryShopByShopId";
	publicAjax('post', ordersTpl4, ordersList4, url4, shopId);

	// 店内设施图片
	var ordersTpl5 = document.getElementById('introducePicTpl').innerHTML;
	var ordersList5 = $('#introducePicList');
	var url5 = global + "/shop/queryShopByShopId";
	publicAjax('post', ordersTpl5, ordersList5, url5, shopId);

	// 店内验光师
	var ordersTpl6 = document.getElementById('shopStaffTpl').innerHTML;
	var ordersList6 = $('#shopStaffList');
	var url6 = global + "/optometrist/shopOptometristList";
	publicAjax('get', ordersTpl6, ordersList6, url6, shopId);

	// 用户评价
	var index = 1;
	var ordersTpl7 = document.getElementById('evalistTpl').innerHTML;
	var ordersList7 = $('#evalistList');
	var url7 = global + "/comment/queryList";
	//console.log(leftId)
	publicAjax('post', ordersTpl7, ordersList7, url7, '', '', 1, 3, leftId);

	// 用户评价分页展示
	$('.evalist').on('click', '.more', function() {
		publicAjax('post', ordersTpl7, ordersList7, url7, '', '', 1, ++index * 3, leftId);
		location.href = 'evaluation_list.html';
	})

	// 商品展示
	// 店内设商品列表
	var urls = global + "/ekProduct/pu/productList";
	var urlss = global + "/ekSetMeal/pu/list"; 
//	getIds('preferentialTpl', '#preferentialList');
	getIds('mirrorTpl', '#mirrorList');
	getIds('contactLensesTpl', '#contactLensesList');
	getIds('lensTpl', '#lensList');
	getIds('sunGlassesTpl', '#sunGlassesList');
	getIds('presbyopicGlassesTpl', '#presbyopicGlassesList');
	getIds('niceGlassesTpl', '#niceGlassesList');
	function getIds(Tpl, List) {
		var ordersTpl = document.getElementById(Tpl).innerHTML;
		var ordersList = $(List);
		publicAjax('post', ordersTpl, ordersList, urls, shopId, tokenKey,1,100);
	}

	//配镜套餐
//	var shopId = '020208ac-866b-4bb7-9d30-10a01aed7591';
	getIdss('hotTpl', '#hotList');

	function getIdss(Tpl, List) {
		var sTpla = document.getElementById(Tpl).innerHTML;
		var orderLista = $(List);
		combo('post', sTpla, orderLista, urlss, shopId,1,100);
	}

	function combo(type, tpl, list, url, shopId, pageNum, pageSize) {
		$.ajax({
			type: type,
			url: url,
			async: true,
			data: {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'shopId': shopId, //shopId,// // 店铺ID
				'off': 1 //上架
			},
			success: function(data) {
				console.log(data);
				if(data.code == 200) {
					if(!data.data) {
						$('.goodsNone').show();
						$('.swiList').hide();
					} else {
						var html = template(tpl, data);
						list.html(html);
					}
					
				}
				
			}
		})
	}

	function getIds(Tpl, List) {
		var ordersTpl = document.getElementById(Tpl).innerHTML;
		var ordersList = $(List);
		publicAjax('post', ordersTpl, ordersList, urls, shopId, tokenKey, 1, 100);
	}

	function publicAjax(type, tpl, list, url, shopId, tokenKey, pageNum, pageSize, leftId) {
		$.ajax({
			type: type,
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
			success: function(data) {
				console.log(data);
				if(data.code == 200) {
					if(!data.data) {
						$('.goodsNone').show();
						$('.swiList').hide();
						$('#product-display').click(function() {
							$(this).addClass('active').siblings().removeClass('active');
							$('.goodsNone').css({
								'display': 'block'
							})
						})
						$('#shop-details').click(function() {
							$(this).addClass('active').siblings().removeClass('active');
							$('.goodsNone').css({
								'display': 'none'
							})
						})
					} else {
						var html = template(tpl, data);
						list.html(html);
					}

				}

			}
		});
	}
	//获取服务项目
	$.ajax({
		type: 'post',
		url: global + '/shop/queryShopByShopId',
		async: true,
		data: {
			'shopId': shopId
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				var str = '';
				var res = JSON.parse(data.data.shop.shopSkills);
				console.log(res);
				for(var i = 0; i < res.length; i++) {
					str += '<li>' + res[i].title + '</li>'
				}
				$('.proList').append(str);
			}

		}
	})


	// 导航
	$('#popularList').on('click', '.address', function () {
		wx.ready(function () {
			// 获取用户自己位置
			wx.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					var latitude = localStorage.getItem('lat') // 纬度，浮点数，范围为90 ~ -90
					var longitude = localStorage.getItem('lon') // 经度，浮点数，范围为180 ~ -180。
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
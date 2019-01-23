$(function() {
	$('#divstyletab a').click(function(e) {
		e.preventDefault();
		$(this).tab('show')
	});

	

	

	show("", "asc", "", $('#tab11'));
	show("", "", "asc", $('#tab12'));
	$('#ipt').on('keyup', function() {
		var searchipt = $('.ipt').val();
		if(!searchipt) {
			show("", "asc", "", $('#tab11'));
			show("", "", "asc", $('#tab12'));
		} else {
			show(searchipt, "asc", "", $('#tab11'));
			show(searchipt, "", "asc", $('#tab12'));
		}
	})
	// 销量排序
	var ordernum = 'desc';
	$('.sales').off('click').on('click', function () {
		ordernum = ordernum == 'asc' ? 'desc' : 'asc'
		show("", "", ordernum, $('#tab12'));
	})

	// 好评排序
	var shopstart = 'desc';
	$('.reputation').off('click').on('click', function () {
		shopstart = shopstart == 'asc' ? 'desc' : 'asc'
		show("", shopstart, "", $('#tab11'));
	})
	
	$('#ipt').on('keyup', function () {
		var searchipt = $('#ipt').val();
		console.log(searchipt);
		if (!searchipt) {
			$('.sales').off('click').on('click', function () {
				ordernum = ordernum == 'asc' ? 'desc' : 'asc'
				show("", "", ordernum, $('#tab12'));
			})
			
			$('.reputation').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show("", shopstart, "", $('#tab11'));
			})
		}else{
			$('.sales').off('click').on('click', function () {
				ordernum = ordernum == 'asc' ? 'desc' : 'asc'
				show(searchipt, "", ordernum, $('#tab12'));
			})
			
			$('.reputation').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt, shopstart, "", $('#tab11'));
			})
		}
	})
	function show(productName, productStart, sales, listbox) {
		$.ajax({
			type: "POST",
			url: global + "/index/pu/productList",
			async: true,
			data: {
				"pageNum": 1,
				"pageSize": 100,
				"productName": productName,
				"productStart": productStart, //好评
				"sales": sales //销量
			},
			success: function(data) {
				console.log(data);
				var res = data.data;
				var str = '';
				var none = '';
				var result = '';
				console.log(res.length);
				if(res.length == 0) {
					$('.nonegoods').css({
						"display": "block"
					})

					//店铺
					//HTML5与百度地图相关方法
					var nowTime = new Date().getTime();
					var startTime = localStorage.getItem('startTime');
					// console.log(endTime);
					localStorage.setItem('startTime', nowTime);
					if(nowTime - startTime >= 600000) {
						getBaiduArea();
					} else {
						var lon = localStorage.getItem('lon');
						var lat = localStorage.getItem('lat');
						sendShopInfo(lon, lat);
					}

					function getBaiduArea() {
						var typeId = 4;
						var map = new BMap.Map("allmap");
						var point = new BMap.Point(116.331398, 39.897445);

						var geolocation = new BMap.Geolocation();
						// 开启SDK辅助定位
						geolocation.enableSDKLocation();
						geolocation.getCurrentPosition(function(r) {
							if(this.getStatus() == BMAP_STATUS_SUCCESS) {
								var mk = new BMap.Marker(r.point);
								map.addOverlay(mk);
								map.panTo(r.point);
								var lon = r.point.lng;
								var lat = r.point.lat;
								localStorage.setItem('lon', lon);
								localStorage.setItem('lat', lat);
								var myGeo = new BMap.Geocoder();
								// 根据坐标得到地址描述    
								myGeo.getLocation(new BMap.Point(lon, lat), function(r) {
									if(r) {
										// alert(r.address); 
										for(var a in r.addressComponents) {
											// alert(a);
										}
										geoProvince = r.addressComponents.province;
										//alert(geoProvince)
										geoCity = r.addressComponents.city;
										setCookie('geoProvince', geoProvince, 30);
										setCookie('geoCity', geoCity, 30);
										//geoAddress=r.address;
										if(geoProvince == geoCity) {
											$('.address').text(geoProvince);
										} else {
											$('.address').text(geoProvince + geoCity);
										}

										$('#allmap').css('display', "none");
										//var infoWindow = new BMap.InfoWindow(sContent);
										//map.openInfoWindow(infoWindow, point);
										var optistId = getCookie("loginUserId"); //用户ID
										sendShopInfo(lon, lat)
									}
								});

							} else {
								alert('failed' + this.getStatus());
							}
						});
					}

					function sendShopInfo(lon, lat) {
						$.ajax({
							type: 'post',
							url: global + "/index/pu/shopList",
							async: true,
							data: {
								'longitude': lon,
								'latitude': lat,
								"shopstart": 'desc'
							},
							success: function(data) {
								console.log(data);

								var starpng = ''
								var res = data.data;

								for(var i = 0; i < 2; i++) {
									$('.contenta').empty();
									var address = res[i].addres_info.split(',');
									var starNum = res[i].start;
									if(starNum > 0 && starNum <= 1) {
										starpng = '<i></i>';
									} else if(starNum > 1 && starNum <= 2) {
										starpng = '<i></i><i></i>';
									} else if(starNum > 2 && starNum <= 3) {
										starpng = '<i></i><i></i><i></i>';
									} else if(starNum > 3 && starNum <= 4) {
										starpng = '<i></i><i></i><i></i><i></i>';
									} else if(starNum > 4 && starNum <= 5) {
										starpng = '<i></i><i></i><i></i><i></i><i></i>';
									}
									var rice = ''
									if(res[i].rice < 0.1) {
										rice = '< 100m';
									} else {
										rice = res[i].rice.toFixed(2) + 'km';
									}
									result += '<li shopId=' + res[i].id + '>' +
										'<a href="javascript:;" class="style" style="background:url(' + res[i].imgpath +
										') 0 0 no-repeat;background-size:100% 100%;background-position: center center;"></a>' +
										'<span class="opboxa">' +
										'<span class="nameboxa">' +
										'<p class="namea">' + res[i].shopname + '</p>' +
										'<span class="stara">' + starpng + '</span>' +
										'<p class="evaluate1">营业时间：' + res[i].business_hours + '</p>' +
										'<b class="bta">平台已认证</b>' +
										'<span class="renza">' +
										'<p>' + address[0] + address[1] + address[2] + res[i].addres + '</p>' +
										'<p>' + rice + '</p>' +
										'</span>' +
										'</span>' +
										'</span>' +
										'</li>'
								}
								$('.contenta').append(result);
								$('.contenta li').click(function() {
									var shopId = $(this).attr('shopId');
									location.href = '../html/shop_detail.html?shopId=' + shopId;
								})
							}
						});
					}

					none = '<div class="nonegoods">' +
						'<div class="nonebpx">' +
						'<img src="../images/nonesearch.png" />' +
						'<p>抱歉，没有发现的相关内容</p>' +
						'<p class="search">换个关键词试试吧</p>' +
						'</div>' +
						'<div class="yousel">' +
						'<h3 class="goodstui">推荐搜索</h3>' +
						'<span class="goodsname">' +
						'<a href="javascript:;">太阳镜</a>' +
						'<a href="javascript:;">隐形眼镜</a>' +
						'<a href="javascript:;">镜片</a>' +
						'<a href="javascript:;">镜框</a>' +
						'</span>' +
						'</div>' +
						'<div class="yousel">' +
						'<h3 class="goodstui">推荐店铺</h3>' +
						'<ul class="contenta khfxPane" id="popular">' +
						result +
						'</ul>' +
						'</div>' +
						'</div>'

					listbox.html(none);
					//推荐搜索
					$('.goodsname a').click(function() {
						$(this).addClass('active').siblings().removeClass('active');
						for(var i = 0; i < $(this).length; i++) {
							var goodsN = $(this)[i].text;
							console.log($(this)[i].text);
							$('.ipt').val(goodsN);
							show(goodsN, "asc", "", $('#tab11'));
							show(goodsN, "", "asc", $('#tab12'));
						}
					})
				} else {
					//							$('.nonegoods').css({
					//								"display": "none"
					//							});
					for(var i = 0; i < res.length; i++) {
						listbox.empty();
						str += '<li goodsId=' + res[i].id + '>' +
							'<a href="javascript:;" class="style" style="background:url(' + res[i].imgpath +
							') 0 0 no-repeat;background-size: 2.3rem 2.3rem;"></a>' +
							'<span class="opbox">' +
							'<p class="product_name">' + res[i].product_name + ' </p>' +
							'<span class="namebox">' +
							'<p>￥<b>' + res[i].now_price + '</b></p>'
						if(!res[i].sales) {
							str += '<p>' + 0 + '人购买</p>'
						} else {
							str += '<p>' + res[i].sales + '人购买</p>'
						}
						str += '</span>' +
							'<p class="shop">' + res[i].shopname + '</p>' +
							'</span>' +
							'</li>'
					}
					listbox.html(str);
					listbox.on('click','li',function(){
						var goodsId = $(this).attr('goodsId');
						location.href="goods_detail.html?goodsId="+goodsId;
					})
				}
			}
		});
	}

})
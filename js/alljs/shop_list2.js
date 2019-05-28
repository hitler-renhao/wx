$(function () {

	var flag = location.search.substring(1);
	var cityname = localStorage.getItem('cityname')
	sendShopInfo("", "", "", 'desc', "", $('#tab11'));
	wx.ready(function () {
		// 获取用户自己位置
		wx.getLocation({
			type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function (res) {
				var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				// bMapTransWXMap(longitude, latitude)
				console.log(!flag)
				if (!flag) {
					//全部
					sendShopInfo("", longitude, latitude, "", "", $('#tab11'));
					//好评量
					sendShopInfo("", longitude, latitude, "", "asc", $('#tab12'));
					//销量
					sendShopInfo("", longitude, latitude, "asc", "", $('#tab13'));
					//距离
					sendShopInfo("", longitude, latitude, "", "", $('#tab14'));
				} else {
					//全部
					sendShopInfo("", "", "", "", "", $('#tab11'));
					//好评量
					sendShopInfo("", "", "", "", "asc", $('#tab12'));
					//销量
					sendShopInfo("", "", "", "asc", "", $('#tab13'));
					//距离
					sendShopInfo("", '', '', "", "", $('#tab14'));
				}
			}
		});
	});
	wx.error(function (res) {
		// alert(res.errMsg);
	});

	// function bMapTransWXMap(lon, lat) {
	// 	var geolocation = new BMap.Geolocation();
	// 	// 开启SDK辅助定位
	// 	geolocation.getCurrentPosition(function (r) {
	// 		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
	// 			var myGeo = new BMap.Geocoder();
	// 			// 根据坐标得到地址描述    
	// 			myGeo.getLocation(new BMap.Point(lon, lat), function (r) {
	// 				if (r) {
	// 					geoProvince = r.addressComponents.province;
	// 					geoCity = r.addressComponents.city;
	// 					if (geoProvince == geoCity) {
	// 						$('.addressbox p').text(geoProvince);
	// 						localStorage.setItem('cityname', geoProvince)
	// 						sendShopInfo("", longitude, latitude, "", "", $('#tab14'));
	// 					} else {
	// 						$('.addressbox p').text(geoCity);
	// 						localStorage.setItem('cityname', geoCity)
	// 						sendShopInfo("", longitude, latitude, "", "", $('#tab14'));
	// 					}
	// 					$('#allmap').css('display', "none");
	// 					sendShopInfo("", lon, lat, "", "", $('#tab14'));
	// 				}
	// 			});
	// 		} else {
	// 			alert('failed' + this.getStatus());
	// 		}
	// 	});
	// }



	// //全部
	// sendShopInfo("", "", "", "", "", $('#tab11'));
	// //好评量
	// sendShopInfo("", "", "", "", "asc", $('#tab12'));
	// //销量
	// sendShopInfo("", "", "", "asc", "", $('#tab13'));
	// //距离
	// sendShopInfo("", lon, lat, "", "", $('#tab14'));
	//搜索
	$('#ipt').on('keyup', function () {
		var searchipt = $('#ipt').val();
		console.log(searchipt);
		if (!searchipt) {
			sendShopInfo("", "", "", "", "", $('#tab11'));
			//好评量
			sendShopInfo("", "", "", "", "asc", $('#tab12'));
			//销量
			sendShopInfo("", "", "", "asc", "", $('#tab13'));
			//距离
			sendShopInfo("", lon, lat, "", "", $('#tab14'));
		} else {
			sendShopInfo(searchipt, "", "", "", "", $('#tab11'));
			//好评量
			sendShopInfo(searchipt, "", "", "", "asc", $('#tab12'));
			//销量
			sendShopInfo(searchipt, "", "", "asc", "", $('#tab13'));
			//距离
			sendShopInfo(searchipt, lon, lat, "", "", $('#tab14'));
		}
	});

	// 销量排序
	var ordernum = 'desc';
	$('.sales').off('click').on('click', function () {
		ordernum = ordernum == 'asc' ? 'desc' : 'asc'
		sendShopInfo("", "", "", ordernum, "", $('#tab13'));
	})

	// 好评排序
	var shopstart = 'desc';
	$('.reputation').off('click').on('click', function () {
		shopstart = shopstart == 'asc' ? 'desc' : 'asc'
		sendShopInfo("", "", "", "", shopstart, $('#tab12'));
	})

	$('#ipt').on('keyup', function () {
		var searchipt = $('#ipt').val();
		console.log(searchipt);
		if (!searchipt) {
			$('.sales').off('click').on('click', function () {
				ordernum = ordernum == 'asc' ? 'desc' : 'asc'
				sendShopInfo("", "", "", ordernum, "", $('#tab13'));
			})

			$('.reputation').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				sendShopInfo("", "", "", "", shopstart, $('#tab12'));
			})
		} else {
			$('.sales').off('click').on('click', function () {
				ordernum = ordernum == 'asc' ? 'desc' : 'asc'
				sendShopInfo(searchipt, "", "", ordernum, "", $('#tab13'));
			})

			$('.reputation').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				sendShopInfo(searchipt, "", "", "", shopstart, $('#tab12'));
			})
		}
	})

	function sendShopInfo(shopName, lon, lat, ordernum, shopstart, libox) {
		$.ajax({
			type: "POST",
			url: global + "/index/pu/shopList",
			async: true,
			data: {
				"shopName": shopName,
				"longitude": lon,
				"latitude": lat,
				"ordernum": ordernum,
				"shopstart": shopstart,
				"addresInfo": cityname,
			},
			success: function (data) {
				libox.empty();
				console.log(data);
				var res = data.data;
				var result = '';
				var starpng = '';
				var data = '';
				if (res.length == 0) {
					$('.nonegoods').show();
					dataq = '<div class="nonegoods">' +
						'<div class="nonebpx">' +
						'<img src="../images/nonesearch.png" />' +
						'<p>抱歉，没有发现的相关内容</p>' +
						'<p class="searcha">换个关键词试试吧</p>' +
						'</div>' +
						'</div>'
					libox.append(dataq);
				} else {
					$('.nonegoods').hide();
					for (var i = 0; i < res.length; i++) {
						var address = res[i].addres_info.split(',');
						var starNum = res[i].start;
						if (!starNum) {
							$('.star').css({
								"dsiplay": "none"
							});
						} else {
							if (starNum > 0 && starNum <= 1) {
								starpng = '<i></i>';
							} else if (starNum > 1 && starNum <= 2) {
								starpng = '<i></i><i></i>';
							} else if (starNum > 2 && starNum <= 3) {
								starpng = '<i></i><i></i><i></i>';
							} else if (starNum > 3 && starNum <= 4) {
								starpng = '<i></i><i></i><i></i><i></i>';
							} else if (starNum > 4 && starNum <= 5) {
								starpng = '<i></i><i></i><i></i><i></i><i></i>';
							}
						}
						var shopN = res[i].shopname;
						console.log(shopN);


						var rice = ''
						if (!!res[i].rice) {
							if (res[i].rice < 0.1) {
								rice = '< 100m';
							} else {
								rice = res[i].rice.toFixed(2) + 'km';
							}
						}
						var address1 = '';
						var address2 = '';
						if (!address[1]) {
							address1 = ''
						} else {
							address1 = address[1];
						}
						if (!address[2]) {
							address2 = ''
						} else {
							address2 = address[2];
						}
						result += '<li shopId=' + res[i].id + '>' +
							'<a href="javascript:;" class="style" style="background:url(' + res[i].imgpath +
							') 0 0 no-repeat;background-size:100% 100%;background-position: center center;"></a>' +
							'<span class="opbox">' +
							'<span class="namebox">' +							
							'<p class="name">' + shopN.replace(/(.{6})(.*)/g,"$1...")+ '</p>' +
							'<span class="star">' + starpng + '</span>' +							
							'</span>' +
							'<p class="evaluate1">营业时间：' + res[i].business_hours + '</p>' +
							'<b class="bt">平台已认证</b>' +
							'<span class="renz">' +
							'<p>' + address[0] + address1 + address2 + res[i].addres + '</p>' +
							'<p>' + rice + '</p>' +
							'</span>' +
							'</span>' +
							'</li>'
					}
					libox.append(result);
					libox.on('click', 'li', function () {
						var shopId = $(this).attr('shopId');
						//localStorage.setItem('shopId', shopId);
						location.href = '../html/shop_detail.html?shopId=' + shopId;
					})
				}

			}
		});
	}
})

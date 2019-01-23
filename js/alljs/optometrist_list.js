$(function () {

	// 判断是否超过10分钟
	var nowTime = new Date().getTime();
	var startTime = localStorage.getItem('startTime');
	// console.log(endTime);
	if (!startTime) {
		localStorage.setItem('startTime', nowTime);
	} else {
		if (nowTime - startTime >= 600000) {
			// 已超时, 请求百度API获取经纬度
			getBaiduArea();
		} else {
			// 未超时, 获取localStorage经纬度
			var lon = localStorage.getItem('lon');
			var lat = localStorage.getItem('lat');
			sendShopInfo(lon, lat);
		}
	}


	// 调用百度API获取经纬度
	function getBaiduArea() {

		var map = new BMap.Map("allmap");
		var point = new BMap.Point(116.331398, 39.897445);

		var shopId = '';
		var geolocation = new BMap.Geolocation();
		// 开启SDK辅助定位
		geolocation.enableSDKLocation();
		geolocation.getCurrentPosition(function (r) {
			if (this.getStatus() == BMAP_STATUS_SUCCESS) {
				var mk = new BMap.Marker(r.point);
				map.addOverlay(mk);
				map.panTo(r.point);
				// alert('您的位置：'+r.point.lng+','+r.point.lat);
				var lon = r.point.lng;
				var lat = r.point.lat;
				localStorage.setItem('lon', lon);
				localStorage.setItem('lat', lat);
				var myGeo = new BMap.Geocoder();
				// 根据坐标得到地址描述    
				myGeo.getLocation(new BMap.Point(lon, lat), function (r) {

					if (r) {
						// alert(r.address); 
						for (var a in r.addressComponents) {
							// alert(a);
						}
						geoProvince = r.addressComponents.province;
						geoCity = r.addressComponents.city;
						setCookie('geoProvince', geoProvince, 30);
						setCookie('geoCity', geoCity, 30);
						//geoAddress=r.address;
						if (geoProvince == geoCity) {
							$('.address').text(geoProvince);
						} else {
							$('.address').text(geoProvince + geoCity);
						}
						$('#allmap').css('display', "none");
						sendShopInfo(lon, lat);
					}
				});

			} else {
				alert('failed' + this.getStatus());
			}
		});
	}



	function sendShopInfo(lon, lat) {

		$.ajax({
			type: "post",
			url: global + "/optometrist/list",
			async: true,
			data: {
				"longitude": lon,
				"latitude": lat,
				"pageNum": 1,
				"pageSize": 100
			},
			success: function (data) {
				console.log(data);
				var str = '';
				var res = data.data.result;
				var page = data.data.total;
				//console.log(page);
				//tabLenghtArray.push(page);
				var itemIndex = 0;
				var num = 0;
				var tabLoadEndArray = [false, false, false];
				var tabLenghtArray = [page];
				var tabScroolTopArray = [0, 0, 0];

				// dropload
				var dropload = $('.khfxWarp').dropload({
					scrollArea: window,
					domDown: {
						domClass: 'dropload-down',
						domRefresh: '<div class="dropload-refresh" style="text-align:center">上拉加载更多</div>',
						domLoad: '<div class="dropload-load" style="text-align:center"><span class="loading"></span>加载中...</div>',
						domNoData: '<div class="dropload-noData">已无数据</div>'
					},
					loadDownFn: function (me) {

						setTimeout(function () {
							if (tabLoadEndArray[itemIndex]) {
								me.resetload();
								me.lock();
								me.noData();
								me.resetload();
								return;
							}
							var result = '';
							for (var index = 0; index < 5; index++, num++) {
								if (tabLenghtArray[itemIndex] > 0) {
									tabLenghtArray[itemIndex]--;
								} else {
									tabLoadEndArray[itemIndex] = true;
									break;
								}
								shopId = res[num].shopId;
								//											localStorage.setItem('shopId',shopId);
								result += '<li shop-id="' + res[num].shopId + '" id="' + res[num].id + '">' +
									'<a href="javascript:;" class="style1" style="background:url(' + res[num].image + ') 0 0 no-repeat;background-size:100% 100%;background-position: center center;"></a>' +
									//												'<img src="'+res[num].image+'" class="user" style="border-radius:50%;width:1rem;height:1rem;"/>' +
									'<span class="opboxa">' +
									'<span class="namebox">' +
									'<p class="name">' + res[num].name + '</p>' +
									'</span>' +
									'<span class="nameboxa">' +
									'<p class="title1">好评：</p>' +
									'<span class="star">' +
									'<i></i>' +
									'<i></i>' +
									'<i></i>' +
									'<i></i>' +
									'<i></i>' +
									'</span>' +
									'</span>' +
									'<p class="evaluate"><i>已实名认证</i>&nbsp;&nbsp;<i>资质已实名</i></p>' +
									'</span>' +
									'</li>'
							}
							$('.khfxPane').eq(itemIndex).append(result);
							//跳转详情
							$('.khfxPane li').click(function () {
								var shopId = $(this).attr('shop-id');
								var infoId = $(this).attr('id');
								// console.log(infoId);
								localStorage.setItem('infoId', infoId);
								window.location.href = './optometrist_detail.html?shopId=' + shopId + '&id=' + infoId;
							})
							me.resetload();
						}, 500);

					}
				});

				$('.tabHead span').on('click', function () {

					tabScroolTopArray[itemIndex] = $(window).scrollTop();
					var $this = $(this);
					itemIndex = $this.index();
					$(window).scrollTop(tabScroolTopArray[itemIndex]);

					$(this).addClass('active').siblings('.tabHead span').removeClass('active');
					$('.tabHead .border').css('left', $(this).offset().left + 'px');
					$('.khfxPane').eq(itemIndex).show().siblings('.khfxPane').hide();

					if (!tabLoadEndArray[itemIndex]) {
						dropload.unlock();
						dropload.noData(false);
					} else {
						dropload.lock('down');
						dropload.noData();
					}
					dropload.resetload();
				});
			}
		})
	}

});
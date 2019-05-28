$(function () {
	var tokenKey = localStorage.getItem("tokenKey");
	var shopId = localStorage.getItem("shopId"); 
	var userId = localStorage.getItem("userId"); 
	var cityname = localStorage.getItem('cityname'); // 山东
	var lon = localStorage.getItem('lon'); // 山东
	var lat = localStorage.getItem('lat'); // 山东
	var flag = location.search.substring(1);
	if (!cityname) {
		wx.ready(function () {
			// 获取用户自己位置
			wx.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					bMapTransWXMap(longitude, latitude)
				}
			});
		});
		wx.error(function (res) {
			alert(res.errMsg);
		});
	} else {
		mainPage(lon, lat, cityname)
	}
	
	

	function bMapTransWXMap(lon, lat) {
		var geolocation = new BMap.Geolocation();
		// 开启SDK辅助定位
		geolocation.getCurrentPosition(function (r) {
			if (this.getStatus() == BMAP_STATUS_SUCCESS) {
				var myGeo = new BMap.Geocoder();
				// 根据坐标得到地址描述    
				myGeo.getLocation(new BMap.Point(lon, lat), function (r) {
					if (r) {
						geoProvince = r.addressComponents.province;
						geoCity = r.addressComponents.city;
						if (!flag) {
							if (geoProvince == geoCity) {
								localStorage.setItem('cityname', geoProvince)
								localStorage.setItem('locationCity', geoProvince)
								localStorage.setItem('lon', lon)
								localStorage.setItem('lat', lat)
								mainPage(lon, lat, geoProvince)
							} else {
								localStorage.setItem('cityname', geoCity)
								localStorage.setItem('locationCity', geoCity)
								localStorage.setItem('lon', lon)
								localStorage.setItem('lat', lat)
								mainPage(lon, lat, geoCity)
							}
						} else {
							localStorage.setItem('cityname', cityname)
							localStorage.setItem('lon', lon)
							localStorage.setItem('lat', lat)
							mainPage(lon, lat, cityname)
						}

						$('#allmap').css('display', "none");
					}
				});
			} else {
				alert('failed' + this.getStatus());
			}
		});
	}

	// //跳转换城市
	// if (flag == 'c1') {
	// 	$('.addressbox p').text(cityname);
	// } else {
	// 	$('.addressbox p').text(cityName);
	// }

	function mainPage(lon, lat, cityname) {
		$('.addressbox p').text(cityname);
		var home = {
			init: function () {
				//				this.bannerList();
				this.goodsList(cityname, '', '');
				this.comboList(cityname, '', '');
				this.shopList(lon, lat, cityname);
			},
			/*banner*/
			bannerList: function () {
				$.ajax({
					type: "POST",
					url: global + "/index/pu/queryBanner",
					async: true,
					success: function (data) {
						console.log(data);
						var bannerStr = '';
						var res = data.data;
						//					for(var i=0;i<res.length;i++){
						bannerStr += '<div class="swiper-slide" shopId="' + res[0].shopId + '"><img src="' + res[0].imagePath + '" alt="图片1" class="bannerimg" /></div>'
						//					}
						$('.bannerbox .swiper-wrapper').html(bannerStr);
						$('.bannerbox').on('click', '.swiper-slide', function () {
							var shopId = $(this).attr('shopId');
							location.href = '../html/shop_detail.html?shopId=' + shopId;
						})
						//					var swiper = new Swiper('.bannerbox .swiper-container', {
						//					 	autoplay: {
						//					 		delay: 2000,
						//					 	}
						//	//				    pagination: {
						//	//				        el: '.swiper-pagination',
						//	//				    },
						//				    });
					}
				});
			},
			/*人气商品*/
			goodsList: function (cityname) {
				$.ajax({
					type: "POST",
					url: global + "/index/pu/productList",
					async: true,
					data: {
						"pageNum": 1,
						"pageSize": 100,
						"sales": 'desc',
						"addresInfo": cityname
					},
					success: function (data) {
						var res = data.data;
						// console.log(res[0].imgpath);
						var goodsStr = '';
						if (res.length < 4) {
							var len = res.length
						} else {
							var len = 4;
						}
						for (var i = 0; i < len; i++) {
							goodsStr += '<div class="swiper-slide" style="width:2.8rem;" id="' + res[i].id + '">' +
								'<img src="' + res[i].imgpath + '" class="img" />' +
								'<span class="goodinfo">' +
								'<p class="goodsname">' + res[i].product_name + '</p>' +
								'<span class="imgbox">' +
								'<p class="pricebox"><h5>￥</h5><i>' + res[i].now_price + '</i><b>￥' + res[i].begin_price + '</b></p>' +
								'</span>' +
								'</span>' +
								'</div>'
							//							if (!res[i].sales) {
							//								goodsStr += '<p>' + 0 + '人已买</p>'
							//							} else {
							//								goodsStr += '<p>' + res[i].sales + '人已买</p>'
							//							}
							//							goodsStr += '</span>' +
							//								'</span>' +
							//								'</div>'
						}
						$('.tabbox .swiper-wrapper').append(goodsStr);
						$('.tabbox .swiper-wrapper .swiper-slide').click(function () {
							var goodsId = $(this).attr('id');
							location.href = "goods_detail.html?goodsId=" + goodsId;
						})
					}
				});
			},
			/*优惠套餐*/
			comboList: function (cityname) {
				$.ajax({
					type: "POST",
					url: global + "/index/pu/setmealList",
					async: true,
					data: {
						"pageNum": 1,
						"pageSize": 100,
						"mealnum": 'asc',
						"addresInfo": cityname,
					},
					success: function (data) {
						console.log(data);
						var res = data.data;
						var setmealStr = '';
						var url = '';
						var urla = '';
						var urlb = '';
						if (res.length >= 3) {
							if (!res[0].imgpath) {
								url = '';
							} else {
								url = res[0].imgpath;
							}
							if (!res[1].imgpath) {
								urla = '';
							} else {
								urla = res[1].imgpath;
							}
							if (!res[2].imgpath) {
								urlb = '';
							} else {
								urlb = res[2].imgpath;
							}
							setmealStr += '<div class="comboleft" id="' + res[0].id + '">' +
								'<p>' + res[0].name + '</p>' +
								'<p>￥' + res[0].now_price + '</p>' +
								'<a href="javascript:;" class="buynow">立刻购买</a>' +
								'<img src="' + url + '" alt="" class="sun" />' +
								'</div>' +
								'<div class="comboright">' +
								'<div class="comborighttop" ida="' + res[1].id + '">' +
								'<span class="sunbox">' +
								'<p>' + res[1].name + '</p>' +
								'<p>￥' + res[1].now_price + '</p>' +
								'</span>' +
								'<img src="' + urla + '" alt="" class="sunone" />' +
								'</div>' +
								'<div class="comborightbottom" idb="' + res[2].id + '">' +
								'<span class="sunbox">' +
								'<p>' + res[2].name + '</p>' +
								'<p>￥' + res[2].now_price + '</p>' +
								'</span>' +
								'<img src="' + urlb + '" alt="" class="suntwo" />' +
								'</div>' +
								'</div>'
							$('.combo').html(setmealStr);
							$('.comboleft').click(function () {
								var combolId = $(this).attr('id');
								localStorage.setItem('setmealid', combolId);
								location.href = "combo_detail.html?getopenid=1";
							})
							$('.comborighttop').click(function () {
								var combolIda = $(this).attr('ida');
								localStorage.setItem('setmealid', combolIda);
								location.href = "combo_detail.html?getopenid=1";
							})
							$('.comborightbottom').click(function () {
								var combolIdb = $(this).attr('idb');
								localStorage.setItem('setmealid', combolIdb);
								location.href = "combo_detail.html?getopenid=1";
							})
						} else {
							$('.heads').remove();
							$('.combo').remove();
						}

					}
				});
			},
			/*优选商家*/
			shopList: function (lon, lat, cityname) {
				$.ajax({
					type: 'post',
					url: global + "/index/pu/shopList",
					async: true,
					data: {
						'longitude': lon,
						'latitude': lat,
						"shopstart": 'desc',
						"addresInfo": cityname,
					},
					success: function (data) {
						console.log(data);
						var result = '';
						var starpng = ''
						var res = data.data;
						let len = res.length < 2 ? res.length : 2; // 店铺数量不少于两个, 展示两个; 店铺数量少于两个, 有几个展示几个
						for (var i = 0; i < len; i++) {
							var address = res[i].addres_info.split(',');
							var starNum = res[i].start;
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
							var rice = ''
							if (res[i].rice < 0.1) {
								rice = '< 100m';
							} else {
								rice = res[i].rice.toFixed(2) + 'km';
							}

							result += '<li shopId=' + res[i].id + '>' +
								'<a href="javascript:;" class="style" style="background:url(' + res[i].imgpath +
								') 0 0 no-repeat;background-size:100% 100%;background-position: center center;"></a>' +
								'<span class="opbox">' +
								'<span class="namebox">' +
								'<p class="name">' + res[i].shopname + '</p>' +
								'<span class="star">' + starpng + '</span>' +
								'<p class="evaluate1">营业时间：' + res[i].business_hours + '</p>' +
								'<b class="bt">平台已认证</b>' +
								'<span class="renz">' +
								'<p>' + address[0] + address[1] + address[2] + res[i].addres + '</p>'

							if (!flag) {
								result += '<p>' + rice + '</p>'
							}
							'</span>' +
							'</span>' +
							'</span>' +
							'</li>'
						}

						$('.content').append(result);
						$('.content li').click(function () {
							var shopId = $(this).attr('shopId');
							location.href = '../html/shop_detail.html?shopId=' + shopId;
						})
					}
				});
			}
		}
		home.init(lon, lat, cityname);
	}

	$('.more-shop').on('click', function () {
		if (!flag) {
			location.href = 'shop_list.html'
		} else {
			location.href = 'shop_list.html?c1'
		}
	})

    // 去除活动按钮
	$("#luckDel").on("click",function(){
		$(".loading").hide();
	})
	$("#luckBtn").on("click",function(){
		location.href="Activity/activity_details.html"
	})
	// 查看更多
	$("#more").on("click",function(){
		location.href="Activity/activity_coupon.html";
	})


	// 优惠券列表
	function getCouponlist(){
		$.ajax({
			type: 'GET',
			url: global + '/coupon/pu/queryCouponListByShopId',
			async: true,
			data: {
				shopId: shopId,
				userId: userId,
				longitude: lon,
				latitude: lat,
				faceValueOrder:"1"
			},
			success:function(data){
			   console.log(data)
			   if(data.code===200){
				   str="";
				   if(data.data.length===0){
					 $(".activity-coupon").hide();
				   }
				   for(var i=0;i<data.data.length;i++){
					   var oData=data.data[i];
						str+='<div class="con">'+
							'<div class="price">¥'+oData.faceValue+'</div>'+
							'<div class="limit">'+oData.productLimitTitle+'</div>'+
							'<div class="btn" couponId="' + oData.id + '">立即领取</div>'+
						'</div>'+
						'<div class="line"><img src="../images/line.png" alt=""></div>'
				   }
				   $("#activityInfo").html(str);
			   }
			}
		});
	}
	getCouponlist();
	$("#activityInfo").on("click",".btn",function(){
		if(tokenKey == null || tokenKey == "") {
			layer.alert('您还未登录，请先登录！', function() {
				localStorage.removeItem('tokenKey');
				location.href = 'login.html';
			})
			return;
		}
		var oAttr=$(this).attr("couponId");
		$.ajax({
			type: 'post',
			url: global + '/coupon/saveCouponByUserId',
			async: true,
			data: {
				// 'tokenKey': "3b49a49011cb43db9f63f7519f03f8a41551939572999",
				'tokenKey': tokenKey,
				'couponId': oAttr,
			},
			success: function (data) {
				console.log(data)
				if (data.code === 200) {
					layui.use('layer', function () {
						var layer = layui.layer;
						layer.msg(data.msg);
					});
					getCouponlist();
				} else {
					if (data == 4400) {
						layer.alert('您还未登录，请先登录！', function () {
							location.href = 'login.html'
						})
					} else {
						layui.use('layer', function () {
							var layer = layui.layer;
							layer.msg(data.msg);
						});
					}
				}
			},
			error:function(error){
				console.log(error);
			}
		})
	})
	
})
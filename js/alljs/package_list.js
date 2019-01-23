$(function () {
	var cityname = localStorage.getItem('cityname'); // 山东
	$('#minsmall2').css({
		"display": "block"
	});
	show('0', '200', $('#minsmall2'));
	$('#minsmall').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#minsmall2').css({
			"display": "block"
		}).siblings().css({
			"display": "none"
		});
		show('0', '200', $('#minsmall2'));
	})
	$('#middle').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#middle2').css({
			"display": "block"
		}).siblings().css({
			"display": "none"
		});
		show('200', '500', $('#middle2'));
	})
	$('#big').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#big2').css({
			"display": "block"
		}).siblings().css({
			"display": "none"
		});
		show('500', '1000', $('#big2'));
	})
	$('#maxbig').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('#maxbig2').css({
			"display": "block"
		}).siblings().css({
			"display": "none"
		});
		show('1000', '10000', $('#maxbig2'));
	})

	function show(beginPrice, endPrice, libox) {
		$.ajax({
			type: "POST",
			url: global + "/index/pu/setmealList",
			async: true,
			data: {
				"pageNum": 1,
				"pageSize": 100,
				"beginPrice": beginPrice,
				"endPrice": endPrice,
				"addresInfo": cityname,
			},
			success: function (data) {
				console.log(data);
				var res = data.data;
				var str = '';
				var url = '';
				if (res.length == 0) {
					$('.nonegoods').css({
						"display": "block"
					})
					libox.css({
						"display": "none"
					})
				} else {
					$('.nonegoods').css({
						"display": "none"
					})
					libox.css({
						"display": "block"
					})
					for (var i = 0; i < res.length; i++) {
						libox.empty();
						if (!res[i].imgpath) {
							url = '';
						} else {
							url = res[i].imgpath;
						}
						str += '<li id="' + res[i].id + '">' +
							'<img src="' + url + '" class="style"/>' +
							'<p class="product_name">' + res[i].name + ' </p>' +
							'<span class="namebox">' +
							'<p>￥<b>' + res[i].now_price + '</b></p>' +
							'<p>原价:' + res[i].price + '</p>' +
							'</span>' +
							'</li>'
					}
					libox.append(str);
				}
				//跳转详情
				libox.on('click', 'li', function () {
					var combolIdb = $(this).attr('id');
					localStorage.setItem('setmealid', combolIdb);
					location.href = "combo_detail.html?getopenid=1";
				})
			}
		})
	}

	/*function show(beginPrice,endPrice,libox) {
		$.ajax({
			type: "POST",
			url: global + "/index/pu/setmealList",
			async: true,
			data: {
				"pageNum": 1,
				"pageSize": 100,
				"beginPrice": beginPrice,
				"endPrice": endPrice
			},
			success: function(data) {
				console.log(data);
				var res = data.data;
				var page = data.data.length;
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
//						domLoad: '<div class="dropload-load" style="text-align:center"><span class="loading"></span>加载中...</div>',
						domNoData: '<div class="dropload-noData" style="text-align:center;padding:0.2rem 0">已无数据</div>'
					},
					loadDownFn: function(me) {
						setTimeout(function() {
							if(tabLoadEndArray[itemIndex]) {
								me.resetload();
								me.lock();
								me.noData();
								me.resetload();
								return;
							}
							var str = '';
							var url = '';
							if(res.length == 0) {
								$('.nonegoods').css({
									"display": "block"
								})								
								libox.css({
									"display": "none"
								})
							} else {
								$('.nonegoods').css({
									"display": "none"
								})
								libox.css({
									"display": "block"
								})
								for(var index = 0; index < 4; index++, num++) {

									if(tabLenghtArray[itemIndex] > 0) {
										tabLenghtArray[itemIndex]--;
									} else {
										tabLoadEndArray[itemIndex] = true;
										break;
									}
									if(!res[num].file) {
										url = '';
									} else {
										url = res[num].file.url;
									}
									str += '<li id="' + res[num].id + '">' +
										'<img src="' + url + '" class="style"/>' +
										'<p class="product_name">' + res[num].name + ' </p>' +
										'<span class="namebox">' +
										'<p>￥<b>' + res[num].now_price + '</b></p>' +
										'<p>原价:' + res[num].price + '</p>' +
										'</span>' +
										'</li>'
								}
								libox.eq(itemIndex).append(str);
							}
							//跳转详情
							libox.on('click','li',function(){							
								var combolIdb = $(this).attr('id');
								localStorage.setItem('setmealid', combolIdb);
								location.href="combo_detail.html?getopenid=1";
							})
							me.resetload();
						}, 500);

					}
				});

				$('.tabHead span').on('click', function() {

					tabScroolTopArray[itemIndex] = $(window).scrollTop();
					var $this = $(this);
					itemIndex = $this.index();
					$(window).scrollTop(tabScroolTopArray[itemIndex]);

					$(this).addClass('active').siblings('.tabHead span').removeClass('active');
					$('.tabHead .border').css('left', $(this).offset().left + 'px');
					$('.khfxPane').eq(itemIndex).show().siblings('.khfxPane').hide();

					if(!tabLoadEndArray[itemIndex]) {
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
	}*/

})
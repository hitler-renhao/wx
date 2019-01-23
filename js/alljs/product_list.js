$(function () {
	var cityname = localStorage.getItem('cityname'); // 山东
	var classify = location.search.substring(1);
	console.log(classify);
		$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	$('#divstyletab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});	
	
	switch (classify) {
		case 'sunglasses':
			cutTab($('.sunglasses'))
			break;
		case 'frame':
			cutTab($('.frame'))
			break;
		case 'contact':
			cutTab($('.contact'))
			break;
		case 'careproduct':
			cutTab($('.careproduct'))
			break;
	}

	function cutTab(lists) {
		lists.addClass('active').siblings().removeClass('active')
	}
	

	show("", "asc", "", $('#tab11'), '2');
	show("", "", "desc", $('#tab12'), '2');
	show("", "asc", "", $('#tab21'), '3');
	show("", "", "desc", $('#tab22'), '3');
	show("", "asc", "", $('#tab31'), '5');
	show("", "", "desc", $('#tab32'), '5');
	show("", "asc", "", $('#tab41'), '6');
	show("", "", "desc", $('#tab42'), '6');
	show("", "asc", "", $('#tab51'), '7');
	show("", "", "desc", $('#tab52'), '7');
	show("", "asc", "", $('#tab61'), '8');
	show("", "", "desc", $('#tab62'), '8');
	$('.ipt').on('keyup', function () {
		var searchipt = $('.ipt').val();
		if (!searchipt) {			
			show("", "asc", "", $('#tab11'), '2');
			show("", "", "desc", $('#tab12'), '2');
			show("", "asc", "", $('#tab21'), '3');
			show("", "", "desc", $('#tab22'), '3');
			show("", "asc", "", $('#tab31'), '5');
			show("", "", "desc", $('#tab32'), '5');
			show("", "asc", "", $('#tab41'), '6');
			show("", "", "desc", $('#tab42'), '6');
			show("", "asc", "", $('#tab51'), '7');
			show("", "", "desc", $('#tab52'), '7');
			show("", "asc", "", $('#tab61'), '8');
			show("", "", "desc", $('#tab62'), '8');
		} else {			
			show(searchipt, "asc", "", $('#tab11'), '2');
			show(searchipt, "", "asc", $('#tab12'), '2');
			show(searchipt, "asc", "", $('#tab21'), '3');
			show(searchipt, "", "asc", $('#tab22'), '3');
			show(searchipt, "asc", "", $('#tab31'), '5');
			show(searchipt, "", "asc", $('#tab32'), '5');
			show(searchipt, "asc", "", $('#tab41'), '6');
			show(searchipt, "", "asc", $('#tab42'), '6');
			show(searchipt, "asc", "", $('#tab51'), '7');
			show(searchipt, "", "asc", $('#tab52'), '7');
			show(searchipt, "asc", "", $('#tab61'), '8');
			show(searchipt, "", "asc", $('#tab62'), '8');
		}
	});
	
	
	var shopstart = 'desc';
//	var ordernum = 'desc'; 
//	sales();
	productStart()
	// 销量排序
//	function sales(){		
//		$('.sales1').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab12'), '2');	
//		})
//		$('.sales2').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab22'), '3');
//		})
//		$('.sales3').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab32'), '5');	
//		})
//		$('.sales4').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab42'), '6');
//		})
//		$('.sales5').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab52'), '7');
//		})
//		$('.sales6').off('click').on('click', function () {
//			ordernum = ordernum == 'asc' ? 'desc' : 'asc'
//			show("", "", ordernum, $('#tab62'), '8');
//		})
//	}
	// 好评排序
	function productStart(){		
		$('.reputation1').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab11'), '2');	
		})		
		$('.reputation2').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab21'), '3');	
		})
		$('.reputation3').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab31'), '5');	
		})
		$('.reputation4').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab41'), '6');	
		})
		$('.reputation5').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab51'), '7');	
		})
		$('.reputation6').off('click').on('click', function () {
			shopstart = shopstart == 'asc' ? 'desc' : 'asc'
			show("",shopstart,"", $('#tab61'), '8');	
		})
	}
	
	
	$('.ipt').on('keyup', function () {
		var searchipt = $('.ipt').val();
		if (!searchipt) {
//			sales();
			productStart();
		}else{
			$('.reputation1').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab11'), '2');	
			})			
			$('.reputation2').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab21'), '3');	
			})
			$('.reputation3').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab31'), '5');	
			})
			$('.reputation4').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab41'), '6');	
			})
			$('.reputation5').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab51'), '7');	
			})
			$('.reputation6').off('click').on('click', function () {
				shopstart = shopstart == 'asc' ? 'desc' : 'asc'
				show(searchipt,shopstart,"", $('#tab61'), '8');	
			})
		}
	})


	function show(productName, productStart, sales, listbox, productType) {
		$.ajax({
			type: "POST",
			url: global + "/index/pu/productList",
			async: true,
			data: {
				"pageNum": 1,
				"pageSize": 100,
				"productName": productName,
				"productStart": productStart, //好评
				"sales": sales, //销量
				"productType": productType,
				"addresInfo": cityname
			},
			success: function (data) {

				console.log(data);
				var res = data.data;
				var str = '';
				console.log(res.length);
				if (res.length == 0) {
//										$('.nonegoods').show();
					str += '<!--搜索无商品-->' +
						'<div class="nonegoods">' +
						'<div class="nonebpx">' +
						'<img src="../images/nonesearch.png" />' +
						'<p>抱歉，没有发现的相关内容</p>' +
						'<p class="search">换个关键词试试吧</p>' +
						'</div>' +
						'</div>'
					listbox.html(str)
				} else {
//					$('.nonegoods').hide();
					listbox.empty();
					for (var i = 0; i < res.length; i++) {
						listbox.empty();
						str += '<li goodsId=' + res[i].id + '>' +
							'<a href="javascript:;" class="style" style="background:url(' + res[i].imgpath + ') 0 0 no-repeat;background-size: 2.3rem 2.3rem;"></a>' +
							'<span class="opbox">' +
							'<p class="product_name">' + res[i].product_name + ' </p>' +
							'<span class="namebox">' +
							'<p>￥<b>' + res[i].now_price + '</b></p>'
						if (!res[i].sales) {
							str += '<p>' + 0 + '人购买</p>'
						} else {
							str += '<p>' + res[i].sales + '人购买</p>'
						}
						'</span>' +
						'<p class="shop">' + res[i].shopname + '</p>' +
							'</span>' +
							'</li>'
					}
					listbox.append(str);
					listbox.on('click', 'li', function () {
						var goodsId = $(this).attr('goodsId');
						location.href = "goods_detail.html?goodsId=" + goodsId;
					})
				}

			}
		});
	}
});
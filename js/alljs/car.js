$(function () {

	var account = getCookie("account");
	var openid = getCookie("openid");
	var tokenKey = localStorage.getItem('tokenKey')
	var userId = localStorage.getItem('userId')
	var car = {
		init: function () {
			this.getData();
			this.pay();
			this.shopping();
			this.arr = [];
		},
		getData: function () {

			$.ajax({
				url: global + '/cart/cartList',
				type: 'get',
				dataType: 'json',
				data: {
					'tokenKey': tokenKey,
					'userId': userId
				},
				success: function (data) {

					var res = data.data;
					console.log(res);

					// 取出对象的属性值, 用作该对象的索引
					var shopIdNames = Object.keys(res); //shopnames    c38f7d91-463e-40b6-8cb0-e039e2003764,亿视界测试

					var str = '',
						len = 0;
					for (index in shopIdNames) { // 遍历店铺
						len += Object.keys(res[shopIdNames[index]]).length;

						str += '<ul shopId="' + shopIdNames[index].split(',')[0] + '" shopName="' + shopIdNames[index].split(',')[1] + '">' +
							'<aside>' +
							'<img src="../images/before_select.jpg" alt="" class="before_select">' +
							'<img src="../images/house.jpg" alt="" class="house">' +
							'<a href="shop_detail.html?shopId=' + shopIdNames[index].split(',')[0] + '">' +
							'<article>' + shopIdNames[index].split(',')[1] + '</article>' +
							'<img src="../images/8.png" alt="" class="to_right">' +
							'</a>' +
							'</aside>'
						for (key in res[shopIdNames[index]]) { //  遍历店铺内部商品信息, 对象索引为字符串, 故使用数组解析方式		res['c38f7d91-463e-40b6-8cb0-e039e2003764,亿视界测试'[0]]
							for (k in res[shopIdNames[index]][key]) {
								console.log(key.split(',')[0]);

								str += '<li prodId="' + key.split(',')[0] + '" specId="' + k + '" number="' + res[shopIdNames[index]][key][k].number + '" prodName="' + key.split(',')[1] + '" specName="' + res[shopIdNames[index]][key][k].specName + '" price="' + res[shopIdNames[index]][key][k].specPrice + '" totalPrice="' + res[shopIdNames[index]][key][k].totalPrice + '" imgUrl="' + res[shopIdNames[index]][key][k].specImage + '" class="num' + k + '">' +
									'<div class="goods_check">' +
									'<img src="../images/before_select.jpg" alt="" class="before_select1">' +
									'</div>' +

									'<a href="goods_detail.html?goodsId=' + key.split(',')[0] + '" class="goodsss">' +
									'<div class="goodsImg">' +
									'<img src="' + res[shopIdNames[index]][key][k].specImage + '">' +
									'</div>' +
									'<div class="infor">' +
									'<p class="name">' + key.split(',')[1] + '</p>' +
									'<p class="color">规格: ' + res[shopIdNames[index]][key][k].specName + '</p>' +
									'<p class="price red">¥' + res[shopIdNames[index]][key][k].specPrice + '</p>' +
									'<p class="sum_price" style="display: none;">' + res[shopIdNames[index]][key][k].totalPrice + '</p>' +
									'</div>' +
									'</a>' +

									'<div class="change_num">' +
									'<input class="reduce reSty" type="submit" value="-" />' +
									'<input class="num" type="text" value="' + res[shopIdNames[index]][key][k].number + '" readonly>' +
									'<input class="add" type="submit" value="+" />' +
									'</div>' +
									'</li>'
							}
						}
						str += '</ul>'
					}
					$('.totalNum').text(len)
					$('#items').append(str)
					car.shopping();
				}
			});
		},
		/* 去结算 */
		pay: function () {
			var that = this;
			$('#balance .right .pay').click(function (event) {
				var allMoney = $('#balance .center p i').html();
				var money = Number(allMoney.substring(1));
				var arrs = new Array();
				var arra = [];
				var specLists = {};
				var specList = [];
				var productLists = {};
				var productList = [];
				var shopLists = {};
				var shopList = [];
				$('#items li').each(function () {
					if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
						var brrb = {
							prodId: $(this).attr('prodid'), // 商品id
							specId: $(this).attr('specid'), // 规格ID
							prodName: $(this).attr('prodname'), // 商品名称
							specName: $(this).attr('specname'), // 规格名称
							prodImgUrl: $(this).attr('imgurl'), // 商品图片
							number: $(this).children().find('.num').val(), // 数量
							prodPrice: $(this).attr('price'), // 单价
							totalPrice: $(this).attr('totalprice'), // 总价
							shopId: $(this).parent().attr('shopid'), // 店铺id
							shopName: $(this).parent().attr('shopName')
						}
						arra.push(brrb);
						var crrc = JSON.stringify(arra);
						localStorage.setItem("crrc", crrc);
						console.log(crrc);
					}
				})
				// 是否已勾选商品
				var count = 0;
				$('#items li').each(function () {
					if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
						count++;
					}
				})
				if (count == 0) {
					layer.msg('请勾选商品再结算')
				} else { // 已勾选
					location.href = 'fill_order.html';
				}
			});
		},
		shopping: function () {

			var that = this;
			/*选中状态*/
			var goodsCounts = 0; // 记录已选中商品数量
			$('.before_select1').click(function () {
				if ($(this).attr('src') == '../images/before_select.jpg') {
					$(this).attr('src', '../images/selected.jpg');
					// 遍历判断该商品是否被选中
					$(this).parents('li').each(function () {
						if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
							goodsCounts++;
						}
					})

				} else {
					$(this).attr('src', '../images/before_select.jpg');
					// 遍历判断该商品是否被选中
					$(this).parents('li').each(function () {
						if ($(this).children().find('.before_select1').attr('src') == '../images/before_select.jpg') {
							goodsCounts--;
						}
					})
				}
				// console.log(goodsCounts);

				// 标志值与选中数量相同, 店铺被选中
				// console.log($(this).parents('ul').children('li').length);

				if (goodsCounts == $(this).parents('ul').children('li').length) {
					$(this).parents('ul').children().find('.before_select').attr('src', '../images/selected.jpg');
					goodsCounts = 0;
				} else {
					$(this).parents('ul').children().find('.before_select').attr('src', '../images/before_select.jpg');
				}
				car.totalMoney();
			});
			/*单一店铺商品全选,反选*/
			$('.before_select').click(function () {
				if ($(this).attr('src') == '../images/before_select.jpg') {
					$(this).attr('src', '../images/selected.jpg');
					$(this).parent().siblings().each(function (index) {
						if ($(this).children().find('.before_select1').attr('src') == '../images/before_select.jpg') {
							$(this).children().find('.before_select1').attr('src', '../images/selected.jpg')
						}
					})

				} else {
					$(this).attr('src', '../images/before_select.jpg');
					$(this).parent().siblings().each(function (index) {
						if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
							$(this).children().find('.before_select1').attr('src', '../images/before_select.jpg')
						}
					})
				}
				car.totalMoney();
			});

			/*整页全选,反选*/
			$('#balance').off('click', '.whole_check').on('click', '.whole_check', function (e) {
				var shop = $(this).parents('#balance').siblings('#items').children();
				if ($(this).attr('src') == '../images/before_select.jpg') {
					// 未选中
					$(this).attr('src', '../images/selected.jpg');
					// 店铺
					shop.each(function (index) {
						if ($(this).children().find('.before_select').attr('src') == '../images/before_select.jpg') {
							$(this).children().find('.before_select').attr('src', '../images/selected.jpg')
						}
						// 商品
						$(this).children('li').each(function (index) {
							if ($(this).children().find('.before_select1').attr('src') == '../images/before_select.jpg') {
								$(this).children().find('.before_select1').attr('src', '../images/selected.jpg')
							}
						})

					})
				} else {
					// 已选中
					$(this).attr('src', '../images/before_select.jpg');
					// 店铺
					shop.each(function (index) {
						if ($(this).children().find('.before_select').attr('src') == '../images/selected.jpg') {
							$(this).children().find('.before_select').attr('src', '../images/before_select.jpg')
						}
						// 商品
						$(this).children('li').each(function (index) {
							if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
								$(this).children().find('.before_select1').attr('src', '../images/before_select.jpg')
							}
						})

					})
				}
				// 阻止事件冒泡
				e.stopPropagation()
				car.totalMoney();
			});

			/*增加商品数量*/
			$('.change_num .add').click(function () {
				// 获取input框
				var iptVal = $(this).prev('input');
				// 数量加 1
				var count = Number(iptVal.val()) + 1;
				// 获取减一按钮
				var obj = $(this).parents('.change_num').find('.reduce');
				// 获取隐藏域, 用于计算总价
				var priceTotalObj = $(this).parents('.change_num').siblings('.goodsss').find('.sum_price');
				// 计算总价
				var price = $(this).parents('.change_num').siblings('.goodsss').find('.price').html();

				var priceTotal = count * Number(price.substring(1));
				// 商品id
				var productId = $(this).parents('li').attr('prodid');
				// 渲染到input框
				iptVal.val(count);
				priceTotalObj.html(priceTotal);
				// 数量大于一, 减一按钮生效
				if (iptVal.val() > 1 && obj.hasClass('reSty')) {
					obj.removeClass('reSty');
				}
				// 获取商品ID
				var productId = $(this).parents('li').attr('specid');
				// 获取商品数量
				var goodsNum = $(this).siblings('.num').val();
				console.log(goodsNum);
				editCartCount(productId, 1, goodsNum)
				car.totalMoney();
			});
			/*减少商品数量*/
			$('.change_num .reduce').click(function () {
				var iptVal = $(this).next('input');
				var count = Number(iptVal.val()) - 1;
				var priceTotalObj = $(this).parents('.change_num').siblings('.goodsss').find('.sum_price');
				var price = $(this).parents('.change_num').siblings('.goodsss').find('.price').html();
				var priceTotal = count * Number(price.substring(1));
				if (iptVal.val() > 1) {
					iptVal.val(count);
					priceTotalObj.html(priceTotal);
				}
				if (iptVal.val() == 1 && !$(this).hasClass('reSty')) {
					$(this).addClass('reSty');
				}
				// 获取商品ID
				var productId = $(this).parents('li').attr('specid');
				// 获取商品数量
				var goodsNum = $(this).siblings('.num').val();
				editCartCount(productId, 0, goodsNum)
				car.totalMoney();
			});

			// 更改商品数量
			function editCartCount(productId, edit, goodsNum) {
				$.ajax({
					url: global + '/cart/editCartCount',
					type: 'post',
					dataType: 'json',
					data: {
						"tokenKey": tokenKey,
						"userId": userId,
						"specId": productId,
						"sign": edit,
						"count": goodsNum
					},
					success: function (data) {
						$()
					}
				});
			}

			/*显示,隐藏模态框*/
			$('#del').click(function () {
				$('#model').fadeIn();
			});
			$('#model .box .no').click(function () {

				$('#model').fadeOut();
			});
			/*确定按钮,删除商品*/
			$('#model').off('click', '.yes').on('click', '.yes', function (e) {
				var prodid = '',
					specid = '';
				$('li').each(function (i) {
					console.log($(this));
					if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
						prodid += $(this).attr('prodid') + ','
						specid += $(this).attr('specid') + ','
						// arrs.push($(this).attr('prodid'))
					}
				});
				prodid = prodid.slice(0, prodid.length - 1);
				specid = specid.slice(0, specid.length - 1);
				// arrs.push(strs);

				$.ajax({
					url: global + '/cart/removeCartProduct',
					type: 'post',
					dataType: 'json',
					data: {
						'productId': prodid,
						'specIds': specid,
						'tokenKey': tokenKey,
						'userId': userId
					},
					success: function (data) {
						car.getData();
						$('#model').fadeOut();
						window.location.reload()
					}
				});
				e.stopPropagation()
			});
		},
		totalMoney: function () {
			var total_money = 0;
			var total_count = 0;
			$('li').each(function () {
				if ($(this).children().find('.before_select1').attr('src') == '../images/selected.jpg') {
					var goods = parseFloat($(this).children().find('.sum_price').html());
					total_money += goods;
				}
			});
			$('#balance .center p i').html('￥' + total_money);
		}
	}
	car.init();
})
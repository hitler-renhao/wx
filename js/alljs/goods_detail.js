$(function () {
	var tokenKey = localStorage.getItem('tokenKey');
	var userId = localStorage.getItem('userId');
	var shopId = localStorage.getItem('shopId');
	var productId = location.search.substring(1).split('=')[1];
	//	var productId = "63c54768-1761-4c9f-a1a2-9392f439e095";

	var goodsDetails = {
		init: function () {
			this.goodsinfo();
			this.goodSpec();
			this.enterShop();
		},
		goodsinfo: function () {
			var spc, spcnum;
			/*基础保障弹框显示隐藏*/
			$('#goodsInfor li p').click(function () {
				$('#hero').show();
			})
			$('.cancel').click(function () {
				$('#hero').hide();
				$('#goodsCan').hide();
				$('#ref').hide();
			})
			/*参数弹框显示隐藏*/
			$('.canShu').click(function () {
				$('#goodsCan').show();
			})
			/*规格弹框显示隐藏*/
			$('.choiceRef').click(function (event) {
				$('#ref').show();
			});
			$('.comBtn').click(function (event) {
				$('#ref').show();
			});

			var colorList;

			/*---ajax获取-----*/
			$.ajax({
				type: 'POST',
				url: global + '/ekProduct/pu/productInfo',
				async: true,
				data: {
					"productId": productId
				},
				success: function (data) {
					localStorage.setItem('type', data.data.product.type)
					console.log(data);
					var res = data.data;
					localStorage.setItem('shopId', res.product.shopId);
					localStorage.setItem('goodPic', res.productFile[0].url);
					/*详情图展示*/
					var strImg = '';
					var showStr = '';
					var mainImg = '';
					for (var i = 0; i < res.productFile.length; i++) {
						if (res.productFile[i].type == '1') {
							mainImg = '<div class="swiper-slide"><img src="' + res.productFile[i].url + '"></div>';
						} else if (res.productFile[i].type == '2') {
							strImg += '<div class="swiper-slide"><img src="' + res.productFile[i].url + '"></div>';
						} else if (res.productFile[i].type == '3') {
							showStr += '<img src="' + res.productFile[i].url + '" />'
						}
					}
					mainImg += strImg;
					$('.swiper-wrapper').append(mainImg);

					//介绍图
					$('.showbox .goodshow').append(showStr);
					$('#goodsInfor .name').html(res.product.productName);
					$('#goodsInfor .price').html('￥' + res.product.nowPrice);
					var mySwiper = new Swiper('.swiper-container', {
						direction: 'horizontal',
						autoplay: false,
						loop: true,
						pagination: {
							el: '.swiper-pagination',
						},
					});

					/* 商品参数 */
					var paramStr = '';
					var str = '';
					for (var i = 0; i < res.productParam.length; i++) {
						paramStr += '<li>' +
							'<p>' + res.productParam[i].dictKey + '</p>' +
							'<p>' + res.productParam[i].dictValue + '</p>' +
							'</li>'
						str += res.productParam[i].dictKey + '　'
					}
					$('.parameter ul').append(paramStr);
					$('#productparm').append(str);
					//					var aa = $('#productparm').text().slice(0,str.length-1);
					//					$('#productparm').append(aa);
					/* 商品参数 -----end---*/

					/* 商品规格 */
					var specStr = '';
					$('.goodsInfor p:first-child').text('￥' + res.product.nowPrice);
					$('.skuce').text('库存：---');
					//$('.skuce').text()
					for (var k = 0; k < res.productSpec.length; k++) {

						var style1 = '';
						if (res.productSpec[k].stock == 0) {
							style1 = 'color:#999;pointer-events:none';
						} else {
							style1 = 'color:#333';
						}
						specStr += '<li style=' + style1 + ' liindex=' + k + ' specId=' + res.productSpec[k].id + '>' + res.productSpec[k].spectName + '</li>'


					}
					$('.chooseCon .ref ul').append(specStr);
					//选规格
					$('.chooseCon .ref ul li').click(function (event) {
						if (tokenKey == null || tokenKey == "") {
							layer.alert('您还未登录，请先登录', function () {
								localStorage.setItem('typeId', '10');
								location.href = 'login.html?productId=' + productId;
							})
						} else {
							$(this).addClass('style').siblings().removeClass('style');
							var liindex = $(this).attr('liindex');
							//console.log(liindex);
							$('.goodsInfor p:first-child').text('￥' + res.productSpec[liindex].price);
							$('.skuce').text('库存：' + res.productSpec[liindex].stock + '件');
							spc = $('.chooseCon .ref ul .style').text();
							//console.log(spc);
							$('.choiceRef .goodsshow').text(spc);
						}
					});
					/* 商品规格 ------end------- */
					/*套餐搭配*/
					var mealList = '';
					for (var j = 0; j < res.setMealList.length; j++) {
						var mealImg = '';
						if (!res.setMealList[j].file) {
							mealImg = '';
						} else {
							mealImg = res.setMealList[j].file.url;
						}
						mealList += '<li setmeal=' + res.setMealList[j].setmeal.id + '>' +
							'<img src="' + mealImg + '" />' +
							'<p>' + res.setMealList[j].setmeal.name + '</p>' +
							'<p class="goodPrice">￥' + res.setMealList[j].setmeal.nowPrice + '</p>' +
							'</li>'
					}
					$('#mealList').append(mealList);
					$('#mealList li').click(function () {
						var setmealId = $(this).attr('setmeal');
						localStorage.setItem('setmealid', setmealId)
						console.log(setmealId);
						location.href = "combo_detail.html?getOpenId=1";
					})
					/*套餐搭配  --- end -----*/
					/* 猜你喜欢 */
					var likeList = '';
					for (var h = 0; h < res.otherProduct.records.length; h++) {
						likeList += '<li likeid=' + res.otherProduct.records[h].id + '>' +
							'<img src="' + res.otherProduct.records[h].url + '" />' +
							'<p>' + res.otherProduct.records[h].productName + '</p>' +
							'<p class="goodPrice">￥' + res.otherProduct.records[h].nowPrice + '</p>' +
							'</li>'
					}
					$('#likeList').append(likeList);
					$('#likeList li').click(function () {
						var likeid = $(this).attr('likeid');
						console.log(likeid);
						location.href = "goods_detail.html?likeid=" + likeid + "";
					})
					/* 猜你喜欢---end--- */
					//添加购物车
					$('#addCar').click(function (event) {
						var goodsNum = res.sunglassNum;
						var typeId = res.typeId;
						let type = localStorage.getItem('type')
						if (type == '6') {
							layer.msg('根据相关法律规定，该商品暂时仅支持到店购买，您可到店挑选购买！给您带来的不便敬请谅解！');
							$('.model').hide();
						} else {
							var num = $('.change_num .num').val();
							var colorId = '';
							if ($('.chooseCon .ref ul li').hasClass('style')) {
								var specName = $('.chooseCon .ref ul li.style').text();
								console.log(specName);
								var specId = $('.chooseCon .ref ul li.style').attr('specId');
								$.ajax({
									type: 'POST',
									url: global + '/cart/addCart',
									async: true,
									data: {
										"tokenKey": tokenKey,
										"userId": userId,
										"productId": productId,
										"specId": specId,
										"number": num
									},
									success: function (data) {
										console.log(data);
										if (data.code == 200) {
											layer.msg('加入购物车成功');
											$('#ref').hide();
										} else if (data == 4400) {
											layer.msg('未登录', function () {
												location.href = '../html/login.html';
											})
										}
									},
									error: function () {
										layer.msg('未登录', function () {
											location.href = '../html/login.html';
										})
									}
								});
							} else {
								layer.msg('请选择商品规格');
							}
						}

					});
					//添加购物车  结束
					/*立即购买*/
					$('#payNow').click(function (event) {
						let type = localStorage.getItem('type')
						if (type == '6') {
							layer.msg('根据相关法律规定，该商品暂时仅支持到店购买，您可到店挑选购买！给您带来的不便敬请谅解！')
							$('.model').hide()
						} else {
							var arra = [];
							$.ajax({
								type: 'POST',
								url: global + '/shop/queryShopByShopId',
								async: true,
								data: {
									"shopId": localStorage.getItem('shopId'),
								},
								success: function (data) {
									localStorage.setItem('shopName', data.data.shop.shopname)
								},
							});
							$('.flex li').each(function () {
								if ($(this).attr('class') == 'style') {
									var brrb = {
										prodId: productId, // 商品id
										specId: $(this).attr('specid'), // 规格ID
										prodName: $('#goodsInfor').children('.name').text(), // 商品名称
										specName: $(this).text(), // 规格名称
										prodImgUrl: localStorage.getItem('goodPic'), // 商品图片
										number: $('.num').val(), // 数量
										prodPrice: $('.buyNumber').text().split('￥')[1], // 单价
										totalPrice: Number($('.num').val()) * Number($('.buyNumber').text().split('￥')[1]), // 总价
										shopId: localStorage.getItem('shopId'), // 店铺id
										shopName: localStorage.getItem('shopName').replace(/^\s*|\s*$/g, "")
									}
									arra.push(brrb);
									var crrc = JSON.stringify(arra);
									localStorage.setItem("crrc", crrc);
									console.log(crrc);
								}
							})
							if ($('.chooseCon .ref ul li').hasClass('style')) {
								location.href = "fill_order.html";
							} else {
								layer.msg('请选择商品规格');
							}
						}

					});
				}
			});
		},
		/* 商品规格 */
		goodSpec: function () {
			var colorList;
			$('#ref .cancel').click(function (event) {
				$('#ref').hide();
			});
			$("#ref").on("click", function () {
				$(this).hide();
			});
			$("#ref .chooseCon").on("click", function (e) {
				e.stopPropagation();
			})
			/*增加商品数量*/
			$('.add').click(function () {
				var iptVal = $(this).prev('input');
				var count = parseInt(iptVal.val()) + 1;
				var obj = $(this).parents('.change_num').find('.reduce');
				iptVal.val(count);
				if (iptVal.val() > 1 && obj.hasClass('reSty')) {
					obj.removeClass('reSty');
				}
			});
			/*减少商品数量*/
			$('.reduce').click(function () {
				var iptVal = $(this).next('input');
				var count = parseInt(iptVal.val()) - 1;
				if (iptVal.val() > 1) {
					iptVal.val(count);
				}
				if (iptVal.val() == 1 && !$(this).hasClass('reSty')) {
					$(this).addClass('reSty');
				}
			});
		},
		/* 进店 */
		enterShop: function () {
			$('footer').on('click', '#enterShop', function (e) {
				e.preventDefault();
				let shopId = localStorage.getItem('shopId');
				location.href = 'shop_detail.html?shopId=' + shopId;
			});

			/* 咨询 */
			$('footer').on('click', '.news', function (e) {
				e.preventDefault();
				if (!tokenKey) {
					layer.alert('登录之后才能进行咨询', function () {
						location.href = 'login.html';
					})
				} else {
					let shopId = localStorage.getItem('shopId');
					location.href = 'Online_Service_C.html?shopId=' + shopId;
				}
			})
		}
	}
	goodsDetails.init();
})
$(function () {
	//获取tokenKey
	var style1 = '';
	var tokenKey = localStorage.getItem('tokenKey');
	/* 默认展示 */
	$('.all').css({
			'display': 'block'
		}).siblings()
		.css({
			'display': 'none'
		});
	meal('', $('#all'));
	/* tab切换 */
	/* 
	 *
	 *   4待付款
	 *		6已发货
	 *		8待评价
	 *		10已完成
	 *
	 */
	// 全部
	$('.allOrder').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.all').css({
				'display': 'block'
			})
			.siblings()
			.css({
				'display': 'none'
			});
		meal('', $('#all'));
	})
	// 待付款
	$('.waitPay').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.waitPay2').css({
				'display': 'block'
			}).siblings()
			.css({
				'display': 'none'
			});
	})
	// 待收货
	$('.waitColect').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.waitColect2').css({
				'display': 'block'
			}).siblings()
			.css({
				'display': 'none'
			});
		meal('6', $('.waitColect2'));
	})
	// 待评价
	$('.evaluated').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.evaluated2').css({
				'display': 'block'
			}).siblings()
			.css({
				'display': 'none'
			});
		meal('8', $('.evaluated2'));
	})
	// 已完成
	$('.completed').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.completed2').css({
				'display': 'block'
			}).siblings()
			.css({
				'display': 'none'
			});
		meal('10', $('.completed2'));
	})
	/* tab切换结束 */

	function meal(userType, litxt) {
		$.ajax({
			type: "post",
			url: global + '/ekIntegralOrder/list',
			async: true,
			data: {
				"tokenKey": tokenKey, 
				// "tokenKey": '_out_153751688979716693', //_out_153751688979716693
				"pageNum": 1,
				"pageSize": 100,
				"state": userType
			},
			success: function (data) {
				if (data.code == 200) {
					litxt.empty();
					var res = data.data;
					var str = '';
					for (var i = 0; i < res.length; i++) {
						str += '<div class="content" id="wrapper" orderId=' + res[i].id + '>' +
							'<aside class="man-cloth">' +
							'<strong>' + res[i].integralProductName + '</strong>' +
							'<span class="exchange">兑换成功 <i>></i> </span>' +
							'</aside>' +
							'<div class="body_box" style="">' +
							'<div class="payment_center">' +
							'<a href="javascript:;" class="picture">' +
							'<img src="' + res[i].url + '" alt="" />' +
							'</a>' +
							'<div class="z_word">' +
							'<p>' + res[i].integralProductName + '</p>' +
							'</div>' +
							'<div class="num">' + 'x' + res[i].integralProductNumber + '' + '</div>' +
							'</div>' +
							'<div class="price">' +
							'<p>共1件商品 合计: ' + res[i].integralProductDecimal + '积分</p>' +
							'</div>'
						// '<div class="confirms" style=' + style1 + '>' +
						// '<button class="confirm">确认收货</button>' +
						// '</div>' +
						if (res[i].state != '8' && res[i].state != '10') {
							str += '<div class="confirms">' +
								'<button class="confirm">确认收货</button>' +
								'</div>'
						}
						str += '</div>' +
							'</div>'
					}
					litxt.append(str);
				} else if (data == 4400) {
					layer.alert('未登录', function () {
						location.href = '../html/login.html';
					})
				}
			}
		})
	}
	/* 订单详情 */
	$('#container').on("click", ".payment_center", function () {
		var orderId = $(this).parents('.content').attr('orderId');
		location.href = "order_detail.html?orderId=" + orderId;
	});
	/* 确认收货 */
	$('#container').on('click', '.confirm', function () {
		var orderId = $(this).parents('.content').attr('orderId');
		console.log($(this).parents('.content').attr('orderId'));
		$.ajax({
			type: "POST",
			url: global + "/ekIntegralOrder/confirmReceipt",
			async: true,
			data: {
				"tokenKey": tokenKey,
				"orderid": orderId
			},
			success: function (data) {
				console.log(data);
				if (data.code == 200) {
					layer.msg('收货成功');
					setTimeout(function () {
						window.location.reload();
						$('.confirms').hide();
					}, 500)

				} else if (data.code == 400) {
					layer.msg(data.msg);
				} else if (data == 4400) {
					layer.alert('未登录', function () {
						location.href = '../html/login.html';
					})
				}
			}
		});
	})
	/* 确认收货结束 */
})
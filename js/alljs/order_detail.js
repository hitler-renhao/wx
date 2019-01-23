$(function() {
	var tokenKey = localStorage.getItem('tokenKey');
	//获取orderid
	var orderId = location.search.substring(1).split('=')[1];
	$.ajax({
		type:"post",
		url:global + "/ekIntegralOrder/orderInfo",
		async:true,
		data:{
			"tokenKey":tokenKey,
			"orderid":orderId
		},
		success:function(data){
			console.log(data);
			var str = '';
			var goodsinfo = '';
			var addressinfo = '';
			var orderinfo = '';
			var productInfo = data.data.product;
			var orderInfo = data.data.order;
			//判断状态
			/* 4发货,6已发货,8待评价,10已完成*/
			var datatype = '';
			if(orderInfo.state == '4'){
				datatype = '待付款';				
			}else if(orderInfo.state == '6'){
				datatype = '待收货';				
			}else if(orderInfo.state == '8'){
				datatype = '待评价';
				$('.pay').hide();
			}else if(orderInfo.state == '10'){
				datatype = '已完成';
				$('.pay').hide();
			}
			var time = productInfo.creteTime.split('T');
			//商品信息
			str = '<li class="goods_status">'
				+      '<h2>订单编号: </h2><b>'+ orderInfo.id +'</b>'
				+      '<span class="order_status">'+ datatype +'</span>'
				+    '</li>'				
			goodsinfo = '<li class="detail">'
					+      '<div class="goodsImg">'
					+        '<img src="'+ productInfo.url +'">'
					+      '</div>'
					+      '<div class="infor">'
					+       '<p class="name">'+ orderInfo.integralProductName +'</p>'
					+       '<p class="price">￥'+ orderInfo.integralProductDecimal +'</p>'
					+        '<p class="num">x'+ orderInfo.integralProductNumber +'</p>'
					+      '</div>'
					+    '</li>'
					+    '<li class="total">'
					+      '<p>支付总计: <i>'+ orderInfo.integralProductDecimal +'</i></p>'
					+    '</li>'
			str +=goodsinfo;
			//收货人信息
			addressinfo = '<li class="head">'
					   +   '<p>收货人: <i>'+ orderInfo.takeName +'</i></p>'
					   +   '<p>收货地址: <i>'+ orderInfo.takeAddress +'</i></p>'
					   +   '<p>支付方式: <i>积分兑换</i></p>'
					   +   '<p>下单时间: <i>'+time[0]+'&nbsp;'+time[1]+'</i></p>'
					   + '</li>'
			//订单信息    // && orderInfo.logisticsOrderid=='' && orderInfo.logisticsAddress==''
			if(orderInfo.logisticsName == null && orderInfo.logisticsOrderid==null && orderInfo.logisticsAddress==null){
				//alert(1);
				$('#order_infor').css({
					'border':'none'
				});
			}else{
				orderinfo = '<li class="head">'
						  +    '<p>物流公司: <i>'+ orderInfo.logisticsName +'</i></p>'
						  +    '<p>运单号: <i>'+ orderInfo.logisticsOrderid +'</i></p>'
						  +    '<p>收货地址: <i>'+ orderInfo.logisticsAddress +'</i></p>'
						  +  '</li>'
			}
			
			
			$('#goods_infor').html(str);
			$('#address_infor').html(addressinfo);
			$('#order_infor').html(orderinfo);
			//确认收货
			$('.pay').on('click',function(){
				$.ajax({
					type:"POST",
					url:global + "/ekIntegralOrder/confirmReceipt",
					async:true,
					data:{
						"tokenKey":tokenKey,
						"orderid":orderId
					},
					success:function(data){
						console.log(data);
						if(data.code == 200){
							layer.msg('收货成功');
							$('.pay').hide();
							window.location.reload();							
						}else if(data.code == 400){
							layer.msg(data.msg);
						}else if(data == 4400) {
							layer.alert('未登录', function() {
								location.href = '../html/login.html';
							})
						}
					}
				});
			})
		}
	});
})
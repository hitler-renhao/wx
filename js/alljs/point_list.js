$(function () {
	var tokenKey = localStorage.getItem('tokenKey');
	var integral = '';
	$.ajax({
		type: "post",
		url: global + "/ekIntegral/list",
		async: true,
		data: {
			"tokenKey": tokenKey,//shopId, //shop_Id,
			"pageNum": 1,
			"pageSize": 100
		},
		success: function (data) {
			console.log(data);
			var res = data.data.data;
			var str = '';
			var dataType = '';
			var dataType2 = '';
			var dataState = '';
			var style1 = '';
			integral = data.data.integral;
			localStorage.setItem('integral',integral);
			$('.force i').text(data.data.integral);
			for(var i=0;i<res.length;i++){
				if(res[i].state == 'import'){
					dataState = '+';
					style1 = 'color:#fb6a42'					
				}else if(res[i].state == 'export'){
					dataState = '-';
					style1 = 'color:#0888f3'
				}
				if(res[i].type == 'share'){
					dataType = '分享奖励';
					dataType2 = '分享成功';
				}else if(res[i].type == 'register'){
					dataType = '注册奖励';
					dataType2 = '注册成功';
				}else if(res[i].type == 'login'){
					dataType = '登录奖励';
					dataType2 = '登录成功';
				}else if(res[i].type == 'assess'){
					dataType = '评价奖励';
					dataType2 = '评价成功';
				}else if(res[i].type == 'assess'){
					dataType = '评价奖励';
					dataType2 = '评价成功';
				}else if(res[i].type == 'convert'){
					dataType = '兑换商品';
					dataType2 = '兑换成功';
				}
				var time = res[i].creteTime.split('T')[0].split('-');
				var month = time[1];
				var day = time[2];
				str += '<div class="conBox">'
				+		'<p class="time">'+ month +'月'+ day +'日</p>'
				+		'<ul class="list">'
				+			'<li>'
				+				'<span class="share">'
				+					'<p>'+ dataType +'</p>'
				+					'<p class="shareT">'+ dataType2 +'</p>'
				+				'</span>'
				+				'<p class="forceNum" style='+style1+'>'+ dataState + res[i].number +'积分</p>'
				+			'</li>'
				+		'</ul>'
				+	'</div>'
			}
			$('.content').append(str);
		}
	})
});

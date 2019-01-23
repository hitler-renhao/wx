$(function(){
	//获取tokenKey
	var tokenKey = localStorage.getItem('tokenKey');
//	var tokenKey = '37bc7a5bbef14caeba3deb4ad772ce771543803134363';
	 $('.usetwo').css({'display':'none'});
	 $('.useone').css({'display':'block'});
	 $('.usethree').css({'display':'none'});
	$('#unuse').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	    $('.usetwo,.usethree').css({
	      'display': 'none'
	    })
	    $('.useone').css({
	      'display': 'block'
	    })
	})
	$('#use').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	    $('.useone,.usethree').css({
	      'display': 'none'
	    })
	    $('.usetwo').css({
	      'display': 'block'
	    })
	})
	$('#used').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	    $('.usetwo,.useone').css({
	      'display': 'none'
	    })
	    $('.usethree').css({
	      'display': 'block'
	    })
	})
	//使用状态 不填为全部(use 使用，unuse未使用，expired过期)
	meal('unuse',$('.useone'));
	meal('use',$('.usetwo'));
	meal('expired',$('.usethree'));
	function meal(userType,litxt){
	$.ajax({
		type: "post",
		url: global + "/ekSetMealOrder/querySetmealOrder",
		async: true,
		data: {
			"tokenKey":tokenKey,
			"pageNum":1,
			"pageSize":100,
			"userType":userType
		},
		success: function (data) {
			console.log(data);
			var unuseStr = '';
			var useStr = '';
			var expiredStr = '';
			var res = data.data.records;
			for(var i=0;i<res.length;i++){
				var time = res[i].times.split('T')[0];
				if(res[i].userType == "unuse"){
					unuseStr += '<li infoId='+res[i].id+'>'
							+		'<span class="liLeft">'
							+			'<p>¥&nbsp;<i>'+res[i].mealDecimal+'</i></p>'
							+			'<p>套餐券</p>'
							+		'</span>'
							+		'<span class="price">'
							+			'<p>'+res[i].shopName+'</p>'
							+			'<p>到期时间：'+time+'</p>'
							+			'<p>'+res[i].mealName+'</p>'
							+			'<a href="javascript:;" class="use">立即使用</a>'
							+		'</span>'
							+	'</li>'
				}else if(res[i].userType == "use"){
					useStr += '<li infoId='+res[i].id+'>'
							+	'<span class="liLeftone">'
							+		'<p>¥&nbsp;<i>'+res[i].mealDecimal+'</i></p>'
							+		'<p>套餐券</p>'
							+	'</span>'
							+	'<span class="price">'
							+		'<p class="ysj">'+res[i].shopName+'</p>'
							+		'<p class="ysj" style="color:#999;">到期时间：'+time+'</p>'
							+		'<p class="ysj">'+res[i].mealName+'</p>'
							+		'<img src="../images/shiyong.png" class="low"/>'
							+	'</span>'
							+'</li>'
				}else if(res[i].userType == "expired"){
					expiredStr += '<li infoId='+res[i].id+'>'
								+	'<span class="liLeftone">'
								+		'<p>¥&nbsp;<i>'+res[i].mealDecimal+'</i></p>'
								+		'<p>套餐券</p>'
								+	'</span>'
								+	'<span class="price">'
								+		'<p class="ysj">'+res[i].shopName+'</p>'
								+		'<p class="ysj" style="color:#999;">到期时间：'+time+'</p>'
								+		'<p class="ysj">'+res[i].mealName+'</p>'
								+		'<img src="../images/low.png" class="low"/>'
								+	'</span>'
								+'</li>'
				}				
			}
			$('.useone').append(unuseStr);
			$('.usetwo').append(useStr);
			$('.usethree').append(expiredStr);
			//跳转套餐券详情
			$('.bigbox ul li').click(function(){
				var infoId = $(this).attr('infoId');
				location.href="combo_detail_buy.html?infoId="+infoId;
			})
		}
	})
	}
})

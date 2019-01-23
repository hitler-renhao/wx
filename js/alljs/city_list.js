$(function(){
	//获取城市
	var geoProvince = localStorage.getItem('locationCity');
	$('.cityname').text(geoProvince);
	
	$('.cityname').click(function(){
		$(this).addClass('active');
	})
	$.ajax({
		type:"POST",
		url:global + "/index/pu/queryCity",
		async:true,
		success:function(data){
			console.log(data);
			var res = data.data;
			var str = '';
			var cityStr = '';
			for(var i=0;i<res.length;i++){
				str += '<a href="javascript:;">'+ res[i] +'</a>'
				cityStr += '<li>'+ res[i] +'</li>'
			}
			$('.newbox').append(str);
			$('.cityList').append(cityStr);
			$('.newbox a').click(function(){
				$(this).addClass('active').siblings().removeClass('active');
			})
			$('.cityList li').click(function(){
				$(this).addClass('bingle').siblings().removeClass('bingle');
			})
			$('.container a').click(function(){
				console.log($(this).text());
				var cityname = $(this).text();
				location.href="home_page.html?c1";
				localStorage.setItem('cityname',cityname);
			})
			$('.cityList li').click(function(){
				var cityName = $(this).text();
				location.href="home_page.html?c1";
				localStorage.setItem('cityname',cityName);
			})
//			var aa = $('.cityList li');			
//			for(var j=0;j<aa.length;j++){
//				console.log($(this).text());
//				if(aa[j].text() == geoProvince){					
//					aa[j].css({
//						"background":"red"
//					})
//				}
//			}
		}
	});
})
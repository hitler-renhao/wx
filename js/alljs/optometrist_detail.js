$(function() {
	// 获取openId
	var tokenKey = localStorage.getItem('tokenKey')
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	}

	// 验光师证书隐藏
	var flag = 1;
//	$('.all').click(function() {
//		flag++;
//		if (flag % 2 == 0) {
//			$('.book').addClass('pic-active');
//			$('.span1').addClass('span-active')
//			$('.span2').removeClass('span-active')
//		} else {
//			$('.book').removeClass('pic-active')
//			$('.span2').addClass('span-active')
//			$('.span1').removeClass('span-active')
//		}
//		
//	})

	var infoId = localStorage.getItem('infoId');
	var href = location.href;
	var shopId = href.split('?')[1].split('&')[0].split('=')[1];
	var infoId = href.split('?')[1].split('&')[1].split('=')[1];
	localStorage.setItem('shopId', shopId);
	localStorage.setItem('infoId', infoId);
	
//	var infoId = '628061f73a4b492693e67117d37050fc';
	
	// var shopId = localStorage.getItem('shopId');

	// 写评价
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证

	$('#addCar').click(function(){
		if(tokenKey == null || tokenKey == ""){
			layer.alert('您还未登录，请先登录',function(){
				localStorage.setItem('typeId', '4')
	           location.href= 'login.html';
	        })
		}else if(tokenKey){
			location.href= 'optometrist_evaluation.html';
		}
	})
	// 立即咨询
	$('#payNow').click(function() {
		localStorage.getItem('tokenKey')
		if (!tokenKey) {
			localStorage.setItem('typeId', '7')
			layer.alert('登录之后才能进行咨询', function() {
				location.href = 'login.html';
			})
		} else {
			location.href = 'Online_Service_C.html?infoId=' + infoId;
		}
	})
	//获取服务项目
//	$.ajax({		
//		 type: 'post',
//			url: global+'/shop/queryShopByShopId',
//			async: true,
//			data: {				
//				'shopId': shopId				
//			},
//			success: function(data) {
//				console.log(data);
//				if(data.code == 200) {
//					var str = '';
//					var res = JSON.parse(data.data.optometristSkills);
//					console.log(res);
//					for(var i = 0;i<res.length;i++){
//						str += '<li>'+ res[i].title +'</li>'
//					}
//					$('.proList').append(str);
//				}
//
//			}
//	})
	var optometrist = {
		init: function() {
			this.optometristList();
			this.evaList();
			this.shopname();
		},
		//根据id获取店铺名称
		shopname:function(){
			$.ajax({
				type: "post",
				url: global + "/shop/queryShopByShopId",
				async: true,
				data: {					
					"shopId": shopId
				},
				success: function(data) {
					console.log(data);
					var res = data.data.shop;
					$('.evaluate').text('所属店铺:'+res.shopname);
				}
			});
		},
		optometristList: function() {
			$.ajax({
				type: "post",
				url: global + "/optometrist/queryByOptometristId",
				async: true,
				data: {					
					"optometristId": infoId
				},
				success: function(data) {
					console.log(data);
					var res = data.data;
					$('.name').text(res.name);
					$('.book').attr('src',res.certificateImage);
					$('.style1').css({
						'background': 'url('+res.image+') 0 0 no-repeat',
						"background-size":"cover",
						"background-position": "center center"
					});
//					$('.user').css('b', res.image);
					$('#mytext').text(res.introduction);
					$('#mytext1').text(res.specialty);
					localStorage.setItem('infoId',infoId);
					
					var str = '';
					var res = JSON.parse(data.data.optometristSkills);
					console.log(res);
					for(var i = 0;i<res.length;i++){
						str += '<li>'+ res[i].title +'</li>'
					}
					$('.proList').append(str);
				}
			});
		},
		//评价列表
		evaList: function() {
			$.ajax({
				type: "post",
				url: global + "/comment/queryList",
				async: true,
				data: {
					"leftId": infoId, //infoId
					"pageNum": 1,
					"pageSize": 100
				},
				success: function(data) {
					console.log(data);
					if(data.code == 200) {
						var res = data.data.result;
						var str = '';
						var imgstr = ''
						var starpng = '';
						for(var i = 0; i < res.length; i++) {
							//console.log(res[i].img);
							if(res != null) {
								//获取创建时间
								var creatime = res[i].comment.updateTime.split('T')[0];
								var star = parseFloat(res[i].comment.star);
								console.log(star);
								var star1 = parseFloat(res[i].comment.star1);
								console.log(star1);
								var starNum = (star+star1)/2;
								console.log(starNum);
								if(starNum>0 && starNum <=1){
									starpng = "../images/star.png";									
								}else if(starNum>1 && starNum <=2){
									starpng = "../images/two.png";									
								}else if(starNum>2 && starNum <=3){
									starpng = "../images/three.png";
								}else if(starNum>3 && starNum <=4){
									starpng = "../images/four.png";
								}else if(starNum>4 && starNum <=5){
									starpng = "../images/wu.png";								
								}
								$('.evalist li').remove();
								str += '<li>' +
									'<span class="title">' +
									'<img src="'+res[i].userimg+'" style="border-radius:50%;">' +
									'<h4>'+ res[i].comment.iphone +'</h4>' +
									'<span class="star1">'+
									'<img src="'+starpng+'"  />'+						
									'</span>'+
									'<i>&nbsp;'+creatime+'</i>' +
									'</span>' +
									'<p class="estimate">' + res[i].comment.commentContent + '</p>'
									
								for(var j = 0; j < res[i].img.length; j++) {
									$('.evalist .tupian').remove();
									imgstr +='<span class="tupian">'+
															'<img src="' + res[i].img[j].imagePath + '" alt="评价图片" />'+
														'</span>'							
								}
								str += imgstr + '</li>'	;
								imgstr = '';
							}							
						}
						$('.evalist').append(str);
					}
				}
			});
		}
	}
	optometrist.init();
})

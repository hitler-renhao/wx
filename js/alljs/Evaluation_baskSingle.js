$(function(){
	var tokenKey = localStorage.getItem('tokenKey');
	var orderId = location.search.substring(1).split('=')[1];
//	var tokenKey = "37bc7a5bbef14caeba3deb4ad772ce771547088665833";
//	var orderId = 'ffff';
	$.ajax({
		type:"POST",
		url:global + "/ekProductOrderLeft/commentList",
		async:true,
		data:{
			"tokenKey":tokenKey,
			"orderId":orderId
		},
		success:function(data){
			console.log(data);
			var str = '';
			var res = data.data.data;
			for(var i=0;i<res.length;i++){
				str += '<li orderId="'+ res[i].productOrderId +'" img="'+res[i].productImgurl+'" id="'+res[i].id+'">'
					+		'<img src="'+ res[i].productImgurl +'" />'
					+		'<span class="goodsright">'
					+			'<p>'+ res[i].productName +'</p>'
					+			'<a href="fill_evaluation.html?orderId='+res[i].id+'&orderimg='+res[i].productImgurl+'&goodsId='+res[i].productId+'" class="bask">评价晒单</a>'
					+		'</span>'
					+	'</li>'
			}
			$('.evaluatBox').append(str);

		}
	});
})

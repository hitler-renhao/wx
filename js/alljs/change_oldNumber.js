$(function() {
	var tokenKey = localStorage.getItem('tokenKey');//获取tokenKey
	var id = localStorage.getItem('userId');//获取用户id
	
	var btn,phone,reg,phoneVal,codeval;
	var change = {
		init: function() {
			this.getCode();
			this.submit();
		},
		//获取验证码
		getCode: function() {
			var ordertime = 30 //设置再次发送验证码等待时间
			var timeleft = ordertime;
			btn = $(".getCode");
			phone = $(".phone");
			reg = /^[\w.]{6,20}$/; //密码的正则匹配式
//			phone.keyup(function() {
//				if(reg.test(phone.val())) {
//					btn.css({
//						'background': '#1a91e2'
//					});
//					btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
//				} else {
//					btn.attr("disabled", true);
//					btn.css({
//						'background': '#ccc'
//					});
//				}
//			})
			//计时函数
			function timeCount() {
				timeleft -= 1
				if(timeleft > 0) {
					btn.val(timeleft + " 秒后重发");
					setTimeout(timeCount, 1000);
				} else {
					btn.val("重新发送");
					timeleft = ordertime; //重置等待时间
					btn.removeAttr("disabled");
				}
			}
			//事件处理函数
			btn.on("click", function() {
				//alert(1);
				$(this).attr("disabled", true); //防止多次点击					
				//此处可添加 ajax请求 向后台发送 获取验证码请求
				timeCount(this);
			})
		},
		//新手机号完成设置提交
		submit:function(){
			$('.finish').click(function(){				
				codeval = $('.code').val();	
				var phone = $('#iphone').val();
//				if (!codeval) {
//					layer.msg("请输入验证码");
//					return false;
//				}
				if(!phone){
					layer.msg("请输入新手机号");
					return false;
				}
				$.ajax({
					type:"POST",
					url: global + "/login/changeIphone",
					async:true,
					data:{
						"tokenKey":tokenKey,
						"id":id,//用户ID
						"iphone":phone //用户新手机号
					},
					success:function(data){
						console.log(data);
						if (data.code == 200) {
							layer.msg('更换成功');
							location.href="my_Settings.html";
						} else if (data.code == 400) {
							layer.alert('该手机号已入住本平台')
						}
					}
				});
			})
		}
	}
	change.init();
})
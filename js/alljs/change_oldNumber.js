$(function () {
	var tokenKey = localStorage.getItem('tokenKey'); //获取tokenKey
	var id = localStorage.getItem('userId'); //获取用户id

	var btn, reg, codeval;
	var change = {
		init: function () {
			this.getCode();
			this.submit();
		},
		//获取验证码
		getCode: function () {			
			btn = $(".getCode");
			reg = /^[1][3,4,5,6,7,8][0-9]{9}$/; //密码的正则匹配式
//			btn.css({
//				'color': '#ccc',
//				'border':'1px solid #ccc'
//			});
//			let iphone = $('#iphone');
//			iphone.keyup(function () {
//				if (reg.test(iphone.val())) {
//					btn.css({
//						'color': '#1a91e2',
//						'border':'1px solid #1a91e2'
//					});
//					btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
//				} else {
//					btn.attr("disabled", true);
//					btn.css({
//						'color': '#ccc',
//						'border':'1px solid #ccc'
//					});
//				}
//			})
			//事件处理函数
			btn.on("click", function () {				
				let iphone = $('#iphone').val();
				
				if (reg.test(iphone)) {
					var ordertime = 30 //设置再次发送验证码等待时间
					var timeleft = ordertime;				
					//计时函数
					function timeCount() {
						timeleft -= 1
						if (timeleft > 0) {
							btn.val(timeleft + " 秒后重发");
							setTimeout(timeCount, 1000);
						} else {
							btn.val("重新发送");
							timeleft = ordertime; //重置等待时间
							btn.removeAttr("disabled");
						}
					}
					$.ajax({
						type: "POST",
						url: global + "/sms/smsSend",
						async: true,
						data: {
							"phone": iphone,
							"sign":'0'
						},
						success: function (data) {
							console.log(data)
							if (data.code == 2000) {
								layer.alert("短信发送成功，请注意查收！");
								timeCount(this);
							} else if (data.code == 4170) {
								layer.alert(data.msg);
							} else if (data.code == 4040) {
								layer.alert('手机号不存在,请核对！')
							}
						}
					});
				} else {
					layer.alert('请输入正确的手机号')
				}
			})
		},
		//新手机号完成设置提交
		submit: function () {
			$('.finish').click(function () {
				codeval = $('.code').val();
				var phone = $('#iphone').val();
				if (!codeval) {
					layer.msg("请输入验证码");
					return false;
				}
				if (!phone) {
					layer.msg("请输入新手机号");
					return false;
				}
				$.ajax({
					type: "POST",
					url: global + "/login/changeIphone",
					async: true,
					data: {
						"tokenKey": tokenKey,
						"id": id, //用户ID
						"iphone": phone, //用户新手机号
						"smsCode":codeval //短信验证码
					},
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							layer.msg('更换新手机号成功！');
							setTimeout(function(){
								location.href = "my_Settings.html";
							},1000);
						} else if (data.code == 400) {
							layer.alert('该手机号已入住本平台')
						} else if (data.code == 4040) {
							layer.msg(data.msg)
						}
					}
				});
			})
		}
	}
	change.init();
})
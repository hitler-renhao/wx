$(function () {
	var tokenKey = localStorage.getItem('tokenKey');
	var id = localStorage.getItem('userId');
	var iphone = localStorage.getItem('iphone');
	

	//	var tokenKey = '37bc7a5bbef14caeba3deb4ad772ce771543989584685';
	//	var id = '37bc7a5bbef14caeba3deb4ad772ce77';
	//	var iphone = '18810209641';

	var btn, phone, reg, phoneVal, codeval;
	var change = {
		init: function () {
			this.getCode();
			this.submit();
		},
		//获取验证码
		getCode: function () {
			// 展示手机号, 中间4位显示****
			let phone_ = "" + iphone;
			let iphone_number = phone_.substr(0, 3) + "****" + phone_.substr(7)
			$('.info i').text(iphone_number)

			var ordertime = 30 //设置再次发送验证码等待时间
			var timeleft = ordertime;
			btn = $(".get");
			phone = $(".phone");
			reg = /^[\w.]{6,20}$/; //密码的正则匹配式
			phone.keyup(function () {
				if (reg.test(phone.val())) {
					btn.css({
						'background': '#1a91e2'
					});
					btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
				} else {
					btn.attr("disabled", true);
					btn.css({
						'background': '#ccc'
					});
				}
			})
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
			//事件处理函数
			btn.on("click", function () {
				$.ajax({
					type: "POST",
					url: global + "/sms/smsSend",
					async: true,
					data: {
						"phone": iphone
					},
					success: function (data) {
						console.log(data)
						if (data.code == 2000) {
							layer.alert("短信发送成功，请注意查收！");
							timeCount(this);
						} else if (data.code == 4170) {
							layer.alert('请不要重复发送，24小时内只限5次！');
						}
					}
				});
				//				phoneVal = phone.val(); //获取手机号
				//				var phoneval = phoneVal.substr(0, 3) + "****" + phoneVal.substr(7);
				//				$('.info i').text(phoneval);				
			})
		},
		//提交
		submit: function () {
			$('.submit').click(function () {
				phoneVal = phone.val();
				codeval = $('.iptCode').val();				
				if (!phoneVal) {
					layer.msg("请输入新密码");
					return false;
				} else if (!reg.test(phoneVal)) {
					layer.msg("密码格式错误");
					return false;
				};
				if (!codeval) {
					layer.msg("请输入验证码");
					return false;
				}
				$.ajax({
					type: 'post',
					url: global + "/login/changePassword",
					async: true,
					data: {
						"tokenKey": tokenKey,
						"id": id, //用户id
						"iphone": iphone,
						"password": phoneVal,//密码
						"smsCode":codeval //短信验证码
						
					},
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							layer.msg('修改密码成功！');
							setTimeout(function(){
								location.href = "my_Settings.html";
							},1000);	
						} else if (data.code == 4040) {
							layer.msg(data.msg)
						}
					}
				})
			})
		}
	}
	change.init();
})

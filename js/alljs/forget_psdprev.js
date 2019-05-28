$(function () {
	/*js生成uuid*/
	var mydate = new Date();
	var id = getUuid();

	function getUuid() {
		var len = 32; //32长度
		var radix = 16; //16进制
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	}

	var url = global + "/captcha/createCaptcha";
	$('.code').attr('src', global + "/captcha/createCaptcha?uuid=" + id);
	$('.code').click(function () {
		$(this).attr('src', global + "/captcha/createCaptcha?uuid=" + id);
		console.log(id);
	})

	/*获取验证码*/
	var ordertime = 30 //设置再次发送验证码等待时间
	var timeleft = ordertime;
	btn = $(".get");
	btn.css({
		'background': 'linear-gradient(to right, #fc7000, #ff5000)'
	});
	btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
	var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	var reg = /^(\w){6,20}$/; //密码的正则匹配式
	$("#yzm").blur(function () {
		var $password = $("#psd").val();
		var $messigeCode = $("#yzm").val();
		if ($password != $messigeCode) {
			layer.alert('两次密码不一致,请重新输入');
			return false;
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
		var phone = $('#tel').val();
		if (!phone) {
			layer.alert('请先输入手机号再获取验证码');
		} else if (!isMobile.test(phone)) {
			layer.alert('手机号格式有误')
		} else {
			$('.info').show();
			$(this).attr("disabled", true); //防止多次点击					
			//此处可添加 ajax请求 向后台发送 获取验证码请求
			var phone = $('#tel').val();
			console.log(phone);
			$.ajax({
				type: "POST",
				url: global + "/sms/smsSend",
				async: true,
				data: {
					"phone": phone
				},
				success: function (data) {
					console.log(data)
					if (data.code == 2000) {
						layer.alert("短信发送成功，请注意查收！");
						timeCount(this);
					} else if (data.code == 4170) {
						layer.alert('请不要重复发送，24小时内只限5次！');
						btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
					} else if (data.code == 4040) {
						layer.alert('手机号不存在! ')
						btn.removeAttr("disabled"); //当号码符合规则后发送验证码按钮可点击
					}
				}
			});
		}
	})

	//点击提交
	$(".btn").click(function () {
		var $optistmobile = $("#tel").val();
		var $password = $("#psd").val();
		var $messigeCode = $("#yzm").val();
		var $getM = $("#getM").val();
		// var $getM2 = $("#getM2").val();
		var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		var reg1 = /^(\w){6,12}$/; //密码的正则匹配式
		if (!$optistmobile) {
			layer.alert('请输入手机号码，不能为空');
			return false;
		} else if (!isMobile.test($optistmobile)) {
			layer.alert('请输入有效的手机号码');
			return false;
		} else if (!$password) {
			layer.alert('请输入新密码，不能为空');
			return false;
		} else if (!reg1.test($password)) {
			layer.alert('请正确输入新密码');
		} else if (!$messigeCode) {
			layer.alert('请再次输入新密码，不能为空');
			return false;
		} else if (!reg1.test($messigeCode)) {
			layer.alert('请再次正确输入新密码');
		} else if ($password != $messigeCode) {
			layer.alert('两次密码不一致,请重新输入');
			return false;
		} else if (!$getM) {
			layer.alert('请输入验证码');
			return false;
		} else {
			$.ajax({
				type: "POST",
				url: global + "/login/forgetPassword",
				async: true,
				data: {
					"phone": $optistmobile,
					"smsCode": $getM, //短信验证码
					"newPassword": $password //新密码
				},
				success: function (data) {
					console.log(data);
					if (data.code == 2000) {
						layer.alert('成功，请使用新密码重新登录！', function () {
							location.href = "login.html";
						});
					} else if (data.code == 4000) {
						layer.alert('失败，请稍后重试');
					} else if (data.code == 4040) {
						layer.alert('验证码已失效');
					}
				}
			});
		}

	})
})
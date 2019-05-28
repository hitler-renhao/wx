$(function () {
	// var typeId = localStorage.getItem('typeId');
	var typeId = localStorage.getItem("typeId"); //用户类型判断

	var openId = localStorage.getItem("openId"); // 判断店铺
	var shopId = localStorage.getItem("shopId"); // 判断店铺
	var productId = location.search.substring(1).split('=')[1];
	var login = {
		init: function () {
			this.loginData();
		},
		loginData: function () {
			$(".btn").click(function () {
				var tel = $("#tel").val();
				var psd = $('#psd').val();
				var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (!tel) {
					layer.msg("请输入手机号");
					return false;
				} else if (!pattern.test(tel)) {
					layer.msg("请输入正确的手机号");
					return false;
				};
				if (!psd) {
					layer.msg("请输入密码");
					return false;
				}
				$.ajax({
					type: "post",
					url: global + "/login/publicLogin",
					async: true,
					data: {
						"iphone": tel,
						"password": psd,
						"type": typeId, //需获取  先写死
					},
					success: function (data) {
						if (data.code == 200) {
							console.log(data);
							layer.msg('登录成功！');
							var res = data.data;
							// localStorage.setItem('shopId', res.shopId);
							localStorage.setItem('iphone', tel); //存手机号

							// 获取openId
							function jumpToBack(url) {
								$.ajax({
									type: "post",
									url: global + "/wexin/geturl",
									dataType: "json",
									data: {
										"tokenKey": res.tokenKey,
										'redirecturl': url
									},
									success: function (res) {
										console.log(res.data.url);
										var URL = res.data.url;
										location.href = URL;
									}
								});
							}


							var url = '';
							const wx = 'http://wx.bjysjglasses.com/ek/web/html'
							// const wx = 'http://test.bjysjglasses.com/ek/web/html'
							switch (typeId) {
								// 店铺
								case '1':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('shopId', shopId);
									localStorage.setItem('userId', res.id);
									url = wx + '/shop_info.html?typeid=' + typeId + '&openid=' + openId +'&shopId=' + shopId;
									jumpToBack(url)
									// location.href = './shop_info.html?typeid=' + typeId + '&openid' + openId;
									break;
									// 验光师
								case '3':
									console.log(res.tokenKey);
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/optometrist_info_staff.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './optometrist_info_staff.html?typeid=' + typeId + '&openid' + openId;
									break;
									// 评价验光师
								case '4':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/optometrist_evaluation.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './optometrist_evaluation.html?typeid=' + typeId + '&openid' + openId;
									break;
									// 评价店铺
								case '5':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									localStorage.setItem('shopId', shopId);
									url = wx + '/shop_evaluation.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './shop_evaluation.html?typeid=' + typeId + '&shopId=' + shopId;
									break;
									// 极光
								case '6':
									console.log(data);
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/shop_detail.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './shop_detail.html?shopId=' + shopId;
									break;
									// 验光师极光
								case '7':
									console.log(data);
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									var infoId = localStorage.getItem('infoId');
									url = wx + '/optometrist_detail.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './optometrist_detail.html?shopId=' + shopId + '&infoId=' + infoId;
									break;
								case '8':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/my_Settings.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './my_Settings.html?typeid=' + typeId + '&openid' + openId;
									break;
								case '9':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/mineC.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// location.href = './mineC.html?typeid=' + typeId + '&openid' + openId;
									break;
								case '10':
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/goods_detail.html?productId=' + productId;
									jumpToBack(url)
//									 location.href = './mineC.html?typeid=' + typeId + '&openid' + openId;
									break;	
								default:
									localStorage.setItem('tokenKey', res.tokenKey);
									localStorage.setItem('userId', res.id);
									url = wx + '/mineC.html?typeid=' + typeId + '&openid' + openId;
									jumpToBack(url)
									// history.go(-1);
									break;
							}
						} else if (data.code == 400) {
							layer.alert(data.msg, function () {
								// location.href = "../html/register.html";
								window.location.reload();
							})
						} else {
							layer.alert("此号码还未注册,请先注册！", function () {
								location.href = "../html/register.html?productId=" + productId;
							})
						}
					}
				});
			})
		}
	}
	login.init();
})
$(function() {
	var optometristId = localStorage.getItem('userId1'); //验光师Id
	var imgurl = localStorage.getItem('chose_pic_btns'); // 验光师头像
	var opName = localStorage.getItem('opName'); // 验光师姓名
	var address = localStorage.getItem('address'); // 详细地址
	var idCard = localStorage.getItem('idCard'); // 验光师身份证号
	var phone = localStorage.getItem('phone'); // 验光师身份证号
	var password = localStorage.getItem('password'); // 验光师身份证号
	var opArea = localStorage.getItem('area'); // 区域
	var idcardurl = localStorage.getItem('idCardDoUp'); // 身份证正面
	var idcarbackdurl = localStorage.getItem('idCardDoDown'); // 身份证背面
	var idbookurl = localStorage.getItem('card'); // 资格证
	var typeId = localStorage.getItem('typeId'); // 类型
	var openId = localStorage.getItem('openId'); // 微信分配id
	var tokenKey = localStorage.getItem('tokenKey'); // 验证登录
	var shopId = localStorage.getItem('shopId'); // 验证登录
	// var shopId = localStorage.getItem('businessHours');	// 验证登录

	var href = location.href;
	var optometristId = href.split('?')[1].split('&')[0].split('=')[1];
	var edit = href.split('?')[1].split('&')[1].split('=')[1];
	console.log(optometristId);
	console.log(edit);

	if(edit == 1) {
		var arrs = [];
		// 获取验光师信息用于回显
		setTimeout(function() {
			$.ajax({
				type: "get",
				url: global + "/optometrist/shopOptometristDetails",
				async: true,
				data: {
					"id": optometristId,
					"tokenKey": tokenKey,
					// 'typeId': type
				},
				success: function(data) {
					var res = data.data;
					console.log(data);
					$('#introduction').val(res.ekOptometrist.introduction);
					$('#specialty').val(res.ekOptometrist.specialty);
					//服务项目回显
					var serivE = JSON.parse(res.ekOptometrist.optometristSkills);
					console.log(serivE);
					var str = '';
					for(var i = 0; i < serivE.length; i++) {
						str += serivE[i].title + ',';
						console.log(serivE[i].id);
						if(!!serivE[i].id) {
							arrs.push(serivE[i].id)
						}
						var lis = $('.seriveList li');

						for(var j = 0, k = 0; j < lis.length; j++) {
//							alert(lis.eq(j).find('p').attr('id'))
//							alert(arrs[k])
							if(lis.eq(j).find('p').attr('id') == arrs[k]) {
//							alert(j)
								
								console.log(j + '---' + lis.eq(j).find('p').attr('id'))
								console.log(j + '---' + arrs[k])
								k++;
								lis.eq(j).find('input').prop('checked', true);
							}
						}
					}
					//$('#serivetype').val(str);
					/*     */

				}
			});
		}, 40)

	}

	var shopName = '';
	var id = '';
	shopName = getCookie('shopName');
	id = getCookie('id');

	// if (!shopName) {
	// 	$('#bindingshop').val('请选择要绑定的店铺')
	// } else {
	// 	$('#bindingshop').val(shopName)
	// }

	/* 全局声明      */
	var textval = new Array(),
		idval = new Array(),
		typeArr = new Array();
	var improve = {
		init: function() {
			this.improveOp();
			// this.bindingShop();
			this.serivetype();
			this.seriveList();
		},
		//服务技能
		seriveList: function() {
			$.ajax({
				type: "get",
				url: global + "/shop/serviceSkillsList",
				async: true,
				success: function(data) {
					console.log(data);
					var res = data.data;
					var str = '';
					for(var i = 0; i < res.length; i++) {
						str += '<li>' +
							'<input type="checkbox" />' +
							'<p id=' + res[i].id + '>' + res[i].title + '</p>' +
							'</li>'
					}
					$('.seriveList').append(str);
				}
			});
		},
		//服务弹框
		serivetype: function() {
			$('#serivetype').click(function() {
				//alert(1);
				$('.bigbox').css({
					'display': 'block'
				});
			})
			var iptLength = $('.seriveList li input').length;

			//console.log(iptLength);
			//			if(iptLength == 0) {
			//				alert(1)
			//				layer.msg('请选择服务类型');
			//			} else if(iptLength > 0 && iptLength <= 6) {
			//				/*$('.seriveList li input').click(function(){
			//					//$(this).attr('checked',checked);					
			//					if($(this).is(':checked')){						
			//						$(this).next().addClass('inro');
			//					}
			//				})*/
			//			}
			$('.sure').on('click', function() {
				//				if(iptLength == 0) {
				//				alert(1)
				//				layer.msg('请选择服务类型');
				//			}
				$('.bigbox').css({
					'display': 'none'
				});
				var liLength = $('.seriveList li').length;

				for(var i = 0; i < liLength; i++) {
					if($('.seriveList li input').eq(i).is(':checked')) {

						$('.seriveList li input').eq(i).next().attr("class", 'inro');
						$('.seriveList li input').eq(i).parents('li').attr("class", 'checked');
						textval.push($('.seriveList li').eq(i).find('.inro').text());
						idval.push($('.seriveList li p').eq(i).attr('id'));

					} else {
						$('.seriveList li input').eq(i).next().attr("class", '');

					}
				}

				// 
				//				if(textval.length > 1) {
				//					textval = textval.substr(0, textval.length - 1)
				//				} else {
				//					textval = " ";
				//				}
				//				arr.push(textval);
				console.log(textval)
				console.log(idval);
				// 拼接服务项目json串	
				var len = $('.seriveList .checked').length;
				if(len == 0) {
					layer.msg('请选择服务项目');
					$('.bigbox').css({
						'display': 'block'
					});
				} else {
					for(var i = 0; i < len; i++) {
						var obj = {
							"id": idval[i],
							"title": textval[i]
						}
						typeArr.push(obj);
					}
					console.log(typeArr);
					//					$('#serivetype').val(textval);
					arr = [];
					textval = "";
				}

			})
			$('.close').click(function() {
				$('.bigbox').css({
					'display': 'none'
				});
			})
			$('.shop-staff').click(function() {
				console.log($('#serivetype').val());
			})
		},
		// 绑定店铺
		// bindingShop: function () {
		// 	$('#bindingshop').click(function () {
		// 		location.href = '../html/choice_shop.html';
		// 	})
		// },
		improveOp: function() {

			$('.submit').click(function() {
				var introduction = $('#introduction').val();
				var specialty = $('#specialty').val();
				//					console.log(id == '')
				//				
				//				if (id != '') {
				//
				//				data = {
				//					"id": optometristId, //验光师id
				//					"headImage": imgurl, //验光师头像
				//					"name": opName, //验光师姓名
				//					"serviceArea": opArea, //验光师服务区域
				//					"serviceAddr": address, //验光师详细地址
				//					"idCard": idCard, //验光师省份证号
				//					"idFrontImage": idcardurl, //验光师身份证正面照片
				//					"idBackImage": idcarbackdurl, //验光师身份证背面照片（国徽）
				//					"certificateImage": idbookurl, //验光师资格证书
				//					"introduction": introduction,
				//					"specialty": specialty,
				//					'tokenKey': tokenKey,
				//					'typeId': typeId,
				//					'shopId': id,
				//					'pageNum': 1,
				//					'pageSize': 10000
				//		}
				//			} else {
				//				data = {
				//					"id": optometristId, //验光师id
				//					"headImage": imgurl, //验光师头像
				//					"name": opName, //验光师姓名
				//					"serviceArea": opArea, //验光师服务区域
				//					"serviceAddr": address, //验光师详细地址
				//					"idCard": idCard, //验光师省份证号
				//					"idFrontImage": idcardurl, //验光师身份证正面照片
				//					"idBackImage": idcarbackdurl, //验光师身份证背面照片（国徽）
				//					"certificateImage": idbookurl, //验光师资格证书
				//					"introduction": introduction,
				//					"specialty": specialty,
				//					'tokenKey': tokenKey,
				//					'typeId': typeId,
				//					'pageNum': 1,
				//					'pageSize': 10000
				//				}
				//			}

				if(!introduction || !specialty) {
					layer.alert('请将必填信息填写完整！');
				} else {
					if(edit == 2) {
						// 添加验光师
						chooseType("/optometrist/optometristEnter");
					} else if(edit == 1) {
						// 修改验光师
						chooseType('/optometrist/compileOptometrist', optometristId);
					}

					function chooseType(url, id) {
						$.ajax({
							type: 'post',
							url: global + url,
							async: true,
							data: {
								"id": id, //验光师id
								"image": imgurl, //验光师头像
								"name": opName, //验光师姓名
								"serviceArea": opArea, //验光师服务区域
								"serviceAddr": address, //验光师详细地址
								"idCard": idCard, //验光师身份证号
								'iphone': phone, //手机号
								'password': password, //密码
								"idFrontImage": idcardurl, //验光师身份证正面照片
								"idBackImage": idcarbackdurl, //验光师身份证背面照片（国徽）
								"certificateImage": idbookurl, //验光师资格证书
								"introduction": introduction, //验光师个人介绍
								"specialty": specialty, // 验光师特长说明
								'tokenKey': tokenKey,
								'typeId': typeId,
								'shopId': shopId, // 就职眼镜店Id
								'optometristSkills': JSON.stringify(typeArr) //获取项目
								// 'pageNum': 1,
								// 'pageSize': 10000
							},
							success: function(data) {
								if(data.code == 200) {
									console.log(data);
									localStorage.removeItem('chose_pic_btns')
									localStorage.removeItem('idCardDoUp')
									localStorage.removeItem('idCardDoDown')
									localStorage.removeItem('card')
									location.href = '../html/shop_info.html?typeid=' + typeId + '&openid=' + openId;
								} else if(data.code == 400) {
									layer.alert(data.msg, function() {
										history.go(-1)
									})
								} else if(data == 4400) {
									layer.alert('请重新登陆！', function() {
										location.href = '../html/login.html'
									})
								}
							}
						})
					}

				}

			})
		}
	}
	improve.init();
})
$(function() {

	// var upImgFlag = [false, false, false, false];
	// var index = 0;
	// $('#sm').attr('disabled', true).css({
	// 	'background': '#666'
	// })

	// var goodsPic1 = $('#goods-pic').attr('src');
	// var goodsPic2 = $('#goods-pic1').attr('src');
	// var goodsPic3 = $('#goods-pic2').attr('src');
	// var goodsPic4 = $('#goods-pic3').attr('src');

	var href = location.href;
	var optometristId = href.split('?')[1].split('&')[0].split('=')[1];
	//	var optometristId='2c42f36b4e854ecf8f228c4ac243819d'
	var edit = href.split('?')[1].split('&')[1].split('=')[1];
	//	console.log(edit);
	var openId = jQuery.cookie('OPENIDCOOKIENAME');
	var tokenKey = localStorage.getItem('tokenKey');
	var typeId = localStorage.getItem('typeId');
	layui.use('upload', function() {
		var $ = layui.jquery,
			upload = layui.upload;
		var userId = '';
		var imgurl = '';
		var idcardurl = '';
		var idcarbackdurl = '';
		var idbookurl = '';
		if(edit == 1) {
			// 获取验光师信息用于回显
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
					$('.layui-upload-list').removeClass('display');
					$('#goods-pic').attr('src', res.ekOptometrist.image);
					$('#name').val(res.ekOptometrist.name);
					$('#idCard').val(res.ekOptometrist.idCard);
					$('#goods-pic1').attr('src', res.ekOptometrist.idFrontImage);
					$('#goods-pic2').attr('src', res.ekOptometrist.idBackImage);
					$('#goods-pic3').attr('src', res.ekOptometrist.certificateImage);
					$('#phone').val(res.ekUser.iphone);
				}
			});
		}

		var shop = {
			init: function() {
				this.upload($("#headPortraitUpload"), 'chose_pic_btns', $('#chose_pic_btn'));
				this.upload($("#idCardUp"), 'idCardDoUp', $('#chose_pic_btn1'));
				this.upload($("#idCardDown"), 'idCardDoDown', $('#chose_pic_btn2'));
				this.upload($("#zige"), 'card', $('#chose_pic_btn3'));
			},
			//上传压缩图片
			upload: function(headPic, classes, chose_pic_btn) {
				var images = {
					index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
					selectIds: {}, //保存已经选择的图片id
					uploadIds: {} //保存已经上传到微信服务器的图片
				};

				wx.ready(function() {
					// 5 图片接口
					// 5.1 拍照、本地选图
					headPic.on("click", function() {

						wx.chooseImage({
							count: 1, // 默认9
							sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
							success: function(res) {

								for(var i = 0; i < res.localIds.length; i++) {
									//全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
									var id = '' + images.index++;
									images.selectIds[id] = res.localIds[i];
									// $('#imgs').attr('src', res.localIds[i])

								}
								var i = 0,
									length = Object.keys(images.selectIds).length;
								var selectIds = []; //需要上传的图片的全局图片id
								for(var id in images.selectIds) {
									selectIds.push(id);
								}

								// 图片上传微信服务器
								wx.uploadImage({
									localId: images.selectIds[selectIds[i]], //根据全局图片id获取已选择图片
									isShowProgressTips: 1, // 默认为1，显示进度提示
									success: function(res) {

										//上传成功，images.selectIds中除，images.uploadIds追加
										//图片从已选择移到已上传区域
										var selectId = selectIds[i];
										localId = images.selectIds[selectId];
										removeId(selectId);
										images.uploadIds[selectId] = res.serverId

										// 获取base64
										wx.getLocalImgData({
											localId: localId,
											success: function(res) {
												var localData = res.localData;
												if(localData.indexOf('data:image') != 0) {
													//判断是否有这样的头部
													localData = 'data:image/jpeg;base64,' + localData
												}
												localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')

												// alert('+++++' + localData)
												/**   * @param base64Codes  图片的base64编码  */
												sumitImageFile(localData);

												function sumitImageFile(base64Codes) {
													// alert('=====' + base64Codes)

													var form = document.forms[0];
													console.log(form)
													var formData = new FormData(form); //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数  						
													//convertBase64UrlToBlob函数是将base64编码转换为Blob 
													formData.append("file", convertBase64UrlToBlob(base64Codes), "123.jpg"); //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同  
													formData.append("tokenKey", tokenKey);
													//ajax 提交form  
													$.ajax({
														url: global + "/comment/uploadImg",
														"type": "POST",
														data: formData,
														dataType: "json",
														processData: false, // 告诉jQuery不要去处理发送的数据  
														contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
														success: function(data) {
															// alert(data.code)
															imgurl = data.data[0];
															var _str = "<img src=" + imgurl + "  id=" + classes + " style='margin-top:0;'/>"
															chose_pic_btn.html(_str);
															localStorage.setItem(classes, imgurl);
														},
													});
												}
												/**  
												 * 将以base64的图片url数据转换为Blob  
												 * @param urlData  
												 *            用url方式表示的base64图片数据  
												 */
												function convertBase64UrlToBlob(urlData) {
													var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte  
													//处理异常,将ascii码小于0的转换为大于0  
													var ab = new ArrayBuffer(bytes.length);
													var ia = new Uint8Array(ab);
													for(var i = 0; i < bytes.length; i++) {
														ia[i] = bytes.charCodeAt(i);
													}
													return new Blob([ab], {
														type: 'image/png'
													});
												}
											}
										});
									},
									fail: function(res) {
										alert('上传失败 ' + i + '/' + length);
									}
								});
							}
						});
					});
				});
				wx.error(function(res) {
					alert(res.errMsg);
				});

				$("body").on('click', ':checkbox', function() {
					var id = $(this).attr('id');
					removeId(id);
				});

				function removeId(id) {
					if(id in images.selectIds) {
						delete images.selectIds[id]
					} else {
						delete images.uploadIds[id]
					}
					$('#' + id).parent().parent().remove();
				}
			},
		}
		shop.init();
		// if (!!goodsPic1 && !!goodsPic2 && !!goodsPic3 && !!goodsPic4 ) {
		// 	$('#sm').attr('disabled', false).css({
		// 		'background': '#1a92e4'
		// 	})
		// }

		//验光师入驻提交下一步
		$('#sm').click(function() {
			var opName = $('#name').val(); //姓名	
			var idCard = $('#idCard').val(); //省份证号
			var phone = $('#phone').val(); //手机号
			var password = $('#password').val(); //密码

			// console.log(password.length);

			// var opArea = $('#city').val(); //地区
			// var province = opArea.split(',')[0]; // 省
			// var city = opArea.split(',')[1]; //市
			// var area = opArea.split(',')[2]; //区
			// var address = $('#addr').val(); //详细地址

			var phonepattern = /^([0-9]){7,18}(x|X)?$/; //短身份证号码(数字、字母x结尾)
			var maybe = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/; //18位身份证
			var may = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/; //15位身份证
			var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机号正则
			localStorage.setItem('opName', opName); // 姓名
			localStorage.setItem('idCard', idCard); //身份证号
			localStorage.setItem('phone', phone); // 手机号
			localStorage.setItem('password', password); // 密码
			// localStorage.setItem('opArea', opArea);	//
			// localStorage.setItem('address', address);

			// 判断入驻验光师参数是否填写完整
			var imgurl = localStorage.getItem('chose_pic_btns');
			var idcardurl = localStorage.getItem('idCardDoUp');
			var idcarbackdurl = localStorage.getItem('idCardDoDown');
			var idbookurl = localStorage.getItem('card');
			if(!imgurl) {
				localStorage.setItem('chose_pic_btns', $('#goods-pic').attr('src'))
			}
			if(!idcardurl) {
				localStorage.setItem('idCardDoUp', $('#goods-pic1').attr('src'))
			}
			if(!idcarbackdurl) {
				localStorage.setItem('idCardDoDown', $('#goods-pic2').attr('src'))
			}
			if(!idbookurl) {
				localStorage.setItem('card', $('#goods-pic3').attr('src'))
			}

			// 如果修改资料
			if(edit == 1) {
				// 校验身份证号是否正确
				if(phonepattern.test(idCard) || maybe.test(idCard) || may.test(idCard)) {
					// 验证手机号是否正确
					if(pattern.test(phone)) {
						window.location.href = '../html/improve_optometrist.html?optometristId=' + optometristId + '&edit=1'
					} else {
						layer.msg("请输入正确的手机号");
					}
				} else {
					layer.msg("请输入正确的身份证号");
					return false;
				}
				// 添加验光师
			} else if(edit == 2) {
				//				if (!imgurl || !opName || !phone || !password || !idCard || !idcardurl || !idcarbackdurl || !idbookurl) {
				//					layer.alert('请将必填信息填写完整！');

//				if(!opName || !phone || !password || !idCard || !idcardurl || !idcarbackdurl || !idbookurl) {
//					layer.alert('请将必填信息填写完整！');
//				} else if(!imgurl) {
//					layer.alert('还未上传头像');
//				} else {
//					// 校验身份证号是否正确
//					if(phonepattern.test(idCard) || maybe.test(idCard) || may.test(idCard)) {
//						// 验证手机号是否正确
//						if(pattern.test(phone)) {
//							// 验证密码是否大于6位
//							if(password.length >= 6) {
//								window.location.href = '../html/improve_optometrist.html?optometristId=' + optometristId + '&edit=2'
//							} else {
//								layer.msg("密码长度不能低于6位");
//							}
//						} else {
//							layer.msg("请输入正确的手机号");
//						}
//					} else {
//						layer.msg("请输入正确的身份证号");
//						return false;
//					}
//				}

				if(!imgurl) {
					layer.alert('还未上传头像');
				} else if(!opName) {
					layer.alert('还未填写姓名');
				} else if(!idCard) {
					layer.alert('请填写身份证号');
				} else if(!phone) {
					layer.alert('还未填电话');
				} else if(!password) {
					layer.alert('还未填密码');
				} else if(!idcardurl) {
					layer.alert('请上传身份证正面图片');
				} else if(!idcarbackdurl) {
					layer.alert('请上传身份证反面图片');
				} else if(!idbookurl) {
					layer.alert('请上传资格证书');
				} else {
					// 校验身份证号是否正确
					if(phonepattern.test(idCard) || maybe.test(idCard) || may.test(idCard)) {
						// 验证手机号是否正确
						if(pattern.test(phone)) {
							// 验证密码是否大于6位
							if(password.length >= 6) {
								window.location.href = '../html/improve_optometrist.html?optometristId=' + optometristId + '&edit=2'
							} else {
								layer.msg("密码长度不能低于6位");
							}
						} else {
							layer.msg("请输入正确的手机号");
						}
					} else {
						layer.msg("请输入正确的身份证号");
						return false;
					}
				}
			}
		})
	});
})

// upload: function (headPic, classes, chose_pic_btn) {
// 	//var picArr = new Array(); // 存储图片
// 	headPic.localResizeIMG({
// 		width: 800, // 宽度
// 		quality: 0.5, // 压缩参数 1 不压缩 越小清晰度越低
// 		success: function (result) {
// 			var img = new Image();
// 			img.src = result.base64;
// 			var _str = "<img src=" + img.src + "  id=" + classes + " style='margin-top:0;'/>"
// 			chose_pic_btn.html(_str);
// 			/**   * @param base64Codes  图片的base64编码  */
// 			sumitImageFile(img.src);

// 			function sumitImageFile(base64Codes) {
// 				var form = document.forms[0];
// 				console.log(form)
// 				var formData = new FormData(form); //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数  						
// 				//convertBase64UrlToBlob函数是将base64编码转换为Blob 
// 				formData.append("file", convertBase64UrlToBlob(base64Codes), "123.jpg"); //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同  
// 				formData.append("tokenKey", tokenKey);
// 				//ajax 提交form  
// 				$.ajax({
// 					url: global + "/comment/uploadImg",
// 					"type": "POST",
// 					data: formData,
// 					dataType: "json",
// 					processData: false, // 告诉jQuery不要去处理发送的数据  
// 					contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
// 					success: function (data) {
// 						imgurl = data.data[0];
// 						localStorage.setItem(classes, imgurl);
// 						// upImgFlag[index] = true;
// 						// if (upImgFlag[0] == true && upImgFlag[1] == true && upImgFlag[2] == true && upImgFlag[3] == true) {
// 						// 	$('#sm').attr('disabled', false).css({
// 						// 		'background': '#1a92e4'
// 						// 	})
// 						// }
// 						// index++;
// 						// console.log(upImgFlag)
// 					},
// 				});
// 			}
// 			/**  
// 			 * 将以base64的图片url数据转换为Blob  
// 			 * @param urlData  
// 			 *            用url方式表示的base64图片数据  
// 			 */
// 			function convertBase64UrlToBlob(urlData) {
// 				var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte  
// 				//处理异常,将ascii码小于0的转换为大于0  
// 				var ab = new ArrayBuffer(bytes.length);
// 				var ia = new Uint8Array(ab);
// 				for (var i = 0; i < bytes.length; i++) {
// 					ia[i] = bytes.charCodeAt(i);
// 				}
// 				return new Blob([ab], {
// 					type: 'image/png'
// 				});
// 			}
// 		}
// 	});

// }
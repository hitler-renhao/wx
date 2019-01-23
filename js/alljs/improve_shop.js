$(function () {

	// var upImgFlag1 = false;
	// var upImgFlag2 = false;
	// var upImgFlag3 = false;
	// var upImgFlag4 = false;
	// $('.submit, .submit-btn').attr('disabled', true).css({
	// 	'background': '#666'
	// })
	var shopId = localStorage.getItem('shopId');
	var tokenKey = localStorage.getItem('tokenKey');
	var typeId = localStorage.getItem('typeId');
	var openId = localStorage.getItem('openId');


	//uploadPic('#test1', '#demo1');
	//uploadPic('#test2', '#demo2');
	//uploadPic('#test3', '#demo3');
	//uploadPic('#test4', '#demo4');
	//uploadPic('#test5', '#demo5');
	//uploadPic('#test6', '#demo6');

	var pic = {};
	var firstpic = [];
	var imgUrl = [];
	var arr = [];
	var href = window.location.href;
	var edit = href.split('?')[1].split('=')[1]; // 是否修改数据
	var arr = [];

	//服务项目id声明
	var skillsArry = [];
	var arrs = [];
	if (edit == 2) {
		show();
	} else if (edit == 3) {
		//判断提现跳转过来直接显示银行卡信息	
		setTimeout(function () {
			($('#container').children("div:last-child")[0]).scrollIntoView();
		}, 100);
		show();
	}
	//店铺回显
	function show() {
		//根据id回显
		setTimeout(function () {
			$.ajax({
				type: "post",
				url: global + "/shop/queryShopByShopId",
				async: true,
				data: {
					"shopId": shopId //"07127972-30dc-494b-baa1-089e8729d96d"//shopId//
				},
				success: function (data) {
					console.log(data);
					var res = data.data;
					var imgs = [$('#goods-pic1'), $('#goods-pic2'), $('#goods-pic3')];
					$('#shop-introduce').val(res.shop.introduce);
					//银行卡信息回显
					$('#bankCards').val(res.bankCard.bankCard);
					$('#accountName').val(res.bankCard.accountName);
					$('#openingBank').val(res.bankCard.openingBank);
					//服务项目回显
					var serivE = JSON.parse(res.shop.shopSkills);
					console.log(serivE);
					var str = '';
					for (var i = 0; i < serivE.length; i++) {
						str += serivE[i].title + ',';
						console.log(serivE[i].id);
						if (!!serivE[i].id) {
							arrs.push(serivE[i].id)
						}
						var lis = $('.seriveList li');

						for (var j = 0, k = 0; j < lis.length; j++) {
							//							alert(lis.eq(j).find('p').attr('id'))
							//							alert(arrs[k])
							if (lis.eq(j).find('p').attr('id') == arrs[k]) {
								//							alert(j)

								console.log(j + '---' + lis.eq(j).find('p').attr('id'))
								console.log(j + '---' + arrs[k])
								k++;
								lis.eq(j).find('input').prop('checked', true);
							}
						}

					}

					//				$('#serivetype').val(str);
					/*     */
					// 图片回显
					for (var index = 0, j = 0; index < res.imgs.length; index++) {
						if (res.imgs[index].type == '1') {
							$('#goods-pic').attr('src', res.imgs[index].imagePath);
						} else if (res.imgs[index].type == '2') {
							imgs[j].attr('src', res.imgs[index].imagePath);
							j++;
						}
					}
				}
			});
		}, 40)
	}

	/* 全局声明      */
	var textval = new Array(),
		idval = new Array(),
		typeArr = new Array();

	var shop = {
		init: function () {
			this.upload($("#headPortraitUpload"), 'chose_pic_btn', $('#chose_pic_btn0'));
			this.upload($("#idCardUp"), 'idCardDoUp', $('#chose_pic_btn1'));
			this.upload($("#idCardDown"), 'idCardDoDown', $('#chose_pic_btn2'));
			this.upload($("#zige"), 'card', $('#chose_pic_btn3'));
			this.seriveList();
			this.seriveGet();
		},
		// 服务技能列表
		seriveList: function () {
			$.ajax({
				type: "get",
				url: global + "/shop/serviceSkillsList",
				async: true,
				success: function (data) {
					console.log(data);
					var res = data.data;
					var str = '';
					for (var i = 0; i < res.length; i++) {
						str += '<li>' +
							'<input type="checkbox" />' +
							'<p id=' + res[i].id + '>' + res[i].title + '</p>' +
							'</li>'
					}
					$('.seriveList').append(str);
				}
			});
		},
		// 服务技能获取
		seriveGet: function () {
			$('#serivetype').click(function () {
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
			$('.sure').on('click', function () {
				//				if(iptLength == 0) {
				//				alert(1)
				//				layer.msg('请选择服务类型');
				//			}
				$('.bigbox').css({
					'display': 'none'
				});
				var liLength = $('.seriveList li').length;

				for (var i = 0; i < liLength; i++) {
					if ($('.seriveList li input').eq(i).is(':checked')) {

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
				if (len == 0) {
					layer.msg('请选择服务项目');
					$('.bigbox').css({
						'display': 'block'
					});
				} else {
					for (var i = 0; i < len; i++) {
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
			$('.close').click(function () {
				$('.bigbox').css({
					'display': 'none'
				});
			})
			//			$('.shop-staff').click(function () {
			//				console.log($('#serivetype').val())
			//			})
		},
		//上传压缩图片
		upload: function (headPic, classes11, chose_pic_btn) {
			var images = {
				index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
				selectIds: {}, //保存已经选择的图片id
				uploadIds: {} //保存已经上传到微信服务器的图片
			};

			wx.ready(function () {
				// 5 图片接口
				// 5.1 拍照、本地选图
				headPic.on("click", function () {
					wx.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function (res) {

							for (var i = 0; i < res.localIds.length; i++) {
								//全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
								var id = '' + images.index++;
								images.selectIds[id] = res.localIds[i];
								// $('#imgs').attr('src', res.localIds[i])

							}
							var i = 0,
								length = Object.keys(images.selectIds).length;
							var selectIds = []; //需要上传的图片的全局图片id
							for (var id in images.selectIds) {
								selectIds.push(id);
							}

							// 图片上传微信服务器
							wx.uploadImage({
								localId: images.selectIds[selectIds[i]], //根据全局图片id获取已选择图片
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function (res) {
									//上传成功，images.selectIds中移除，images.uploadIds追加
									//图片从已选择移到已上传区域
									var selectId = selectIds[i];
									localId = images.selectIds[selectId];
									removeId(selectId);
									images.uploadIds[selectId] = res.serverId

									// 获取base64
									wx.getLocalImgData({
										localId: localId,
										success: function (res) {
											var localData = res.localData;
											if (localData.indexOf('data:image') != 0) {
												//判断是否有这样的头部
												localData = 'data:image/jpeg;base64,' + localData
											}
											localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')

											/**   * @param base64Codes  图片的base64编码  */
											sumitImageFile(localData);

											function sumitImageFile(base64Codes) {

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
													success: function (data) {
														imgurl = data.data[0];
														var _str = "<img src='" + imgurl + "'  id='" + classes11 + "' style='margin-top:0;'/>"
														chose_pic_btn.html(_str);
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
												for (var i = 0; i < bytes.length; i++) {
													ia[i] = bytes.charCodeAt(i);
												}
												return new Blob([ab], {
													type: 'image/png'
												});
											}
										},
										error: function (res) {}
									});

								},
								fail: function (res) {}
							});
						}
					});
				});
			});
			wx.error(function (res) {
				// alert(res.errMsg);
			});

			$("body").on('click', ':checkbox', function () {
				var id = $(this).attr('id');
				removeId(id);
			});

			function removeId(id) {
				if (id in images.selectIds) {
					delete images.selectIds[id]
				} else {
					delete images.uploadIds[id]
				}
				$('#' + id).parent().parent().remove();
			}
		},
	}
	shop.init();




	//	$('#bankCard').on('keyup', function(){
	//		if ($(this).val().length >= 6) {
	//		alert(1);
	//		}

	//		validateText($(this).id,$(this).value);
	//		function validateText(id,str){//参数是文本框的ID和值
	//			if(str==""){//如果值为空，那么文本框获得焦点
	//			$(id).focus();
	//			}else{//不为空就弹出值
	////			alert(str);
	//			}
	//		}
	//	})



	$('#bankCards').on('keyup', function () {
		var txtval = $('#bankCards').val().length;
		if (txtval >= 6) {
			var bankCardNumber = $('#bankCards').val();
			if (bankCardAttribution(bankCardNumber) != 'error') {
				$('#openingBank').val(bankCardAttribution(bankCardNumber).bankName)
			}
		}
	})

	//	console.log(bankCard);

	$('.submit-btn').click(function () {
		//服务项目获取
		var serivetype = $('#serivetype').val();
		var accountName = $('#accountName').val(); //开户人姓名	
		var openingBank = $('#openingBank').val(); //开户行名称
		var bankCardNumber = $('#bankCards').val();
		console.log(accountName + '-' + openingBank + '-' + bankCardNumber);
		//		if (bankCardAttribution(bankCardNumber) == 'error') {
		//			layer.alert('请认真核对银行卡号是否正确， 由于个人银行卡号填写错误等原因造成的损失，本公司概不负责');
		//		}
		//校验卡号
		//		var reg = /^(\d{16}|\d{19})$/;
		//		if(!reg.test(bankCard)){
		//			layer.msg("银行卡格式不对");
		//			return false;
		//		}
		var headPic11 = $('#chose_pic_btn').attr('src'); //图片路径
		// alert('headPic11-----' + headPic11)
		var headPic12 = $('#goods-pic').attr('src'); //图片路径
		var headPic21 = $('#idCardDoUp').attr('src'); //图片路径
		// alert('headPic21-----' + headPic21)
		var headPic22 = $('#goods-pic1').attr('src'); //图片路径
		var headPic31 = $('#idCardDoDown').attr('src'); //图片路径
		// alert('headPic31-----' + headPic31)
		var headPic32 = $('#goods-pic2').attr('src'); //图片路径
		var headPic41 = $('#card').attr('src'); //图片路径
		// alert('headPic41-----' + headPic41)
		var headPic42 = $('#goods-pic3').attr('src'); //图片路径

		if (!headPic11) {
			firstpic.push(headPic12)
		} else {
			firstpic.push(headPic11)
		}
		if (!headPic21) {
			firstpic.push(headPic22)
		} else {
			firstpic.push(headPic21)
		}
		if (!headPic31) {
			firstpic.push(headPic32)
		} else {
			firstpic.push(headPic31)
		}
		if (!headPic41) {
			firstpic.push(headPic42)
		} else {
			firstpic.push(headPic41)
		}
		// 判断信息是否完整
		var shopIntroduce = $('#shop-introduce').val(); // 店内设施介绍
		if (!shopIntroduce || !(headPic11 || headPic12) || !(headPic21 || headPic22) || !(headPic31 || headPic32) || !(headPic41 || headPic42)) {
			alert('请将必填信息填写完整！');
		} else {
			// alert(firstpic[0][0]);
			for (var index = 0; index < firstpic.length; index++) {
				console.log(firstpic);
				if (index == 0) {
					var indexx = JSON.stringify(1)
				} else {
					var indexx = JSON.stringify(2)
				}
				console.log(indexx);
				pic = {
					type: indexx,
					imagePath: firstpic[index]
				}
				console.log(pic);
				imgUrl.push(pic);
				console.log(imgUrl);
			}
			imgUrl = JSON.stringify(imgUrl);
			var tokenKey = localStorage.getItem('tokenKey');
			$.ajax({
				type: 'post',
				url: global + "/shop/updateShops",
				async: true,
				data: {
					'shopId': shopId, // 店铺ID
					'imgurl': imgUrl, //'[{type:1,imagePath:1.png},{type:2,imagePath:1.png}]' // 图片
					'introduce': shopIntroduce, // 介绍
					'tokenKey': tokenKey,
					'typeId': typeId,
					"shopSkills": JSON.stringify(typeArr), //获取项目
					"bankCard": bankCardNumber, //银行卡号  6222600260001072444招商银行
					"accountName": accountName, //开户人姓名
					"openingBank": openingBank //开户行名称
				},
				success: function (data) {
					if (data.code == 200) {
						console.log(data);
						location.href = '../html/shop_info.html?typeid=' + typeId + '&openid' + openId;
					} else if (data == 4400) {
						layer.alert('未登录', function () {
							location.href = '../html/login.html';
						})
					}

				}
			})
		}
	})
})
$(function () {
	// $('#next').attr('disabled', true).css({
	// 	'background': '#666'
	// })
	var href = window.location.href;
	var edit = href.split('?')[1].split('=')[1]; // 是否修改数据
	if (edit == 1) {
		// 店铺入住
		var tokenKey = localStorage.getItem('tokenKey');
		var typeId = localStorage.getItem('typeId');

		//		var typeId = 1;
		//		var tokenKey = "032e60b365c94df1a22ce7c37ea8ec121541656013585"
		//		var shopId = "561b5f75-6dd0-49fb-a492-01953a25a439";

		var shop = {
			init: function () {
				this.upload($("#headPortraitUpload"), 'zhizhao', $('#chose_pic_btn'));
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
									var _str = "<img src=" + res.localIds[i] + "  id=" + classes11 + " style='margin-top:0;'/>"
									chose_pic_btn.html(_str);
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
															var _str = "<img src=" + res.localIds[i] + "  id=" + classes11 + " style='margin-top:0;'/>"
															chose_pic_btn.html(_str);
															//alert(_str)
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
											}
										});
									},
									fail: function (res) {
										alert('上传失败 ' + i + '/' + length);
									}
								});
							}
						});
					});
				});
				wx.error(function (res) {
					alert(res.errMsg);
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

		//店铺入驻提交下一步
		$('#next').click(function () {
			var shopName = $('#shopName').val(); //店名
			// localStorage.setItem('shopName',shopName);
			var shopArea = $('#city').val(); //地区
			// localStorage.setItem('shopArea',shopArea);
			var province = shopArea.split(',')[0]; // 省
			var city = shopArea.split(',')[1]; //市
			var area = shopArea.split(',')[2]; //区
			var shopAddress = $('#shopAddress').val(); //详细地址
			// localStorage.setItem('shopAddress', shopAddress);
			var shopPhone = $('#shopPhone').val(); // 电话
			// localStorage.setItem('shopPhone',shopPhone);
			var startTime = $('#startTime').val(); // 开始营业时间
			// localStorage.setItem('startTime',startTime);
			var endTime = $('#endTime').val(); // 结束营业时间
			// localStorage.setItem('endTime', endTime);
			var urlImg = $('#zhizhao').attr('src'); //图片路径

			// localStorage.setItem('urlImg', urlImg);
			var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机号正则
			var telephone = /\d{3}\d{8}|\d{4}\d{7}/;
			var businessHours = startTime + '-' + endTime;
			// 判断信息是否完整
			if (!shopName || !shopArea || !shopAddress || !shopPhone || !startTime || !endTime || !urlImg) {
				alert('请将必填信息填写完整！');
			} else {
				// 验证手机号是否正确
				if (!pattern.test(shopPhone) && !telephone.test(shopPhone)) {
					alert("请输入正确的手机号");
					// 验证地址是否够
				} else if (shopAddress.length < 4) {
					alert('详细地址不得少于4个汉字或字母')
				} else {
					//获取经纬度 
					var cities = province + city + area;
					var map = new BMap.Map("container");
					map.centerAndZoom(cities); // 获取用户录入的地区
					var localSearch = new BMap.LocalSearch(map);
					var keyword = cities + shopAddress; // 获取用户录入详细地址
					var count = 0;
					localSearch.setSearchCompleteCallback(function (searchResult) {
						var poi = searchResult.getPoi(0);
						if (!poi) {
							longitude = 116.40387397;
							latitude = 39.91488908;
							count++;
							if (count == 1) {
								sengLng(longitude, latitude);
							} else {
								return;
							}
						} else {
							console.log('经度: ' + poi.point.lng); // 经度
							console.log('纬度: ' + poi.point.lat); // 纬度
							longitude = poi.point.lng;
							latitude = poi.point.lat;
							count++;
							if (count == 1) {
								sengLng(longitude, latitude);
							} else {
								return;
							}
						}
					});
					localSearch.search(keyword);
					count = 0;

					function sengLng(longitude, latitude) {
						$.ajax({
							type: 'post',
							url: global + "/shop/addShop",
							async: true,
							data: {
								'addresInfo': shopArea, // 地区
								'addres': shopAddress, // 详细地址
								'shopname': shopName, //名称
								'phone': shopPhone, //电话
								'businessHours': businessHours, // 营业时间
								'off': 1, // 营业状态
								'uriImg': imgurl, // 照片
								"longitude": longitude,
								"latitude": latitude,
								'tokenKey': tokenKey,
								'typeId': typeId
							},
							success: function (data) {
								console.log(latitude);
								if (data.code == 200) {
									localStorage.setItem('shopId', data.data.id);
									location.href = '../html/improve_shop.html?edit=1'
									// location.href = './improve_shop.html'
								} else if (data == 4400) {
									// console.log(data);
									layer.alert('未登录', function () {
										location.href = '../html/login.html';
									})
								}

							}
						})
					}
				}
			}
		})

		function cityChoice() {
			var area2 = new LArea();
			area2.init({
				'trigger': '#city',
				'valueTo': '#value',
				'keys': {
					id: 'value',
					name: 'text'
				},
				'type': 2,
				'data': [provs_data, citys_data, dists_data]
			});
		}
		cityChoice();
	} else {
		// 店铺信息修改
		var tokenKey = localStorage.getItem('tokenKey');
		var typeId = localStorage.getItem('typeId');
		var shopId = localStorage.getItem('shopId');

		var shop = {
			init: function () {
				this.upload($("#headPortraitUpload"), 'zhizhao', $('#chose_pic_btn'));
			},
			//上传压缩图片
			upload: function (headPic, classes2, chose_pic_btn) {
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
													var formData = new FormData(form); //这里连带form里的其
													formData.append("file", convertBase64UrlToBlob(base64Codes), "123.jpg"); //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同  
													// formData.append("file", localData, "123.jpg");
													formData.append("tokenKey", tokenKey);
													//ajax 提交form  
													$.ajax({
														url: global + "/shop/uploadImg",
														"type": "POST",
														data: formData,
														dataType: "json",
														processData: false, // 告诉jQuery不要去处理发送的数据  
														contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
														success: function (data) {
															imgurl = data.data[0];
															var _str = "<img src=" + imgurl + "  id=" + classes2 + " style='margin-top:0;'/>"
															chose_pic_btn.html(_str);
															//alert(_str);
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
											}
										});
									},
									fail: function (res) {
										alert('上传失败 ' + i + '/' + length);
									}
								});
							}
						});
					});
				});
				wx.error(function (res) {
					alert(res.errMsg);
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

		//根据id回显			
		$.ajax({
			type: "post",
			url: global + "/shop/queryShopByShopId",
			async: true,
			data: {
				"shopId": shopId //"07127972-30dc-494b-baa1-089e8729d96d"//shopId
			},
			success: function (data) {
				console.log(data);
				var res = data.data;
				var time = res.shop.businessHours.split('-');
				$('#startTime').val(time[0]);
				$('#endTime').val(time[1]);
				$('#shopName').val(res.shop.shopname);
				$('#city').val(res.shop.addresInfo);
				$('#shopAddress').val(res.shop.addres);
				$('#shopPhone').val(res.shop.phone);
				for (var i = 0; i < 5; i++) {
					// alert(res.imgs[i].type)
					if (res.imgs[i].type == '4') {
						$('#goods-pic').attr('src', res.imgs[i].imagePath).parent().css({
							'position': 'relative',
							'display': 'inherit'
						});
						$('#goods-pic').css({
							'position': 'absolute',
							'width': '3.5rem',
							'height': '2.15rem',
							'top': '0',
							'left': '0'
						})
						imgurl = res.imgs[i].imagePath;
					}
				}

			}
		});
		//店铺入驻提交下一步
		$('#next').click(function () {
			var shopName = $('#shopName').val(); //店名
			// localStorage.setItem('shopName',shopName);
			var shopArea = $('#city').val(); //地区
			// localStorage.setItem('shopArea',shopArea);
			var province = shopArea.split(',')[0]; // 省
			var city = shopArea.split(',')[1]; //市
			var area = shopArea.split(',')[2]; //区
			var shopAddress = $('#shopAddress').val(); //详细地址
			// localStorage.setItem('shopAddress', shopAddress);
			var shopPhone = $('#shopPhone').val(); // 电话
			// localStorage.setItem('shopPhone',shopPhone);
			var startTime = $('#startTime').val(); // 开始营业时间
			// localStorage.setItem('startTime',startTime);
			var endTime = $('#endTime').val(); // 结束营业时间
			// localStorage.setItem('endTime', endTime);
			var urlImg1 = $('#zhizhao').attr('src'); //图片路径
			var urlImg2 = $('#goods-pic').attr('src'); //图片路径
			// localStorage.setItem('urlImg', urlImg);
			var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机号正则
			var telephone = /\d{3}\d{8}|\d{4}\d{7}/;
			var businessHours = startTime + '-' + endTime;
			var urlImg;
			if (!urlImg1) {
				urlImg = urlImg2;
			} else {
				urlImg = urlImg1;
			}
			// 判断信息是否完整
			if (!shopName || !shopArea || !shopAddress || !shopPhone || !startTime || !endTime || !urlImg) {
				alert('请将必填信息填写完整！');
			} else {
				// 验证手机号是否正确
				if (!pattern.test(shopPhone) && !telephone.test(shopPhone)) {
					alert("请输入正确的手机号");
					// 验证地址是否够
				} else if (shopAddress.length < 4) {
					alert('详细地址不得少于4个汉字或字母')
				} else {
					// 判断上传哪张图片

					//获取经纬度 
					var map = new BMap.Map("container");
					var cities = province + city + area;
					map.centerAndZoom(cities); // 获取用户录入的地区
					var localSearch = new BMap.LocalSearch(map);
					var keyword = cities + shopAddress; // 获取用户录入详细地址
					var counts = 0;
					localSearch.setSearchCompleteCallback(function (searchResult) {
						var poi = searchResult.getPoi(0);
						console.log(poi);
						if (!poi) {
							longitude = 116.40387397;
							latitude = 39.91488908;
							counts++;
							if (counts == 1) {
								sengLng(longitude, latitude);
							} else {
								return;
							}
						} else {
							console.log('经度: ' + poi.point.lng); // 经度
							console.log('纬度: ' + poi.point.lat); // 纬度
							longitude = poi.point.lng;
							latitude = poi.point.lat;
							counts++;
							if (counts == 1) {
								sengLng(longitude, latitude);
							} else {
								return;
							}
						}
					});
					localSearch.search(keyword);

					function sengLng(longitude, latitude) {
						console.log('经度: ' + longitude); // 经度
						console.log('纬度: ' + latitude); // 纬度
						$.ajax({
							type: 'post',
							url: global + "/shop/updateShop",
							async: true,
							data: {
								'id': shopId,
								'addresInfo': shopArea, // 地区
								'addres': shopAddress, // 详细地址
								'shopname': shopName, //名称
								'phone': shopPhone, //电话
								'businessHours': businessHours, // 营业时间
								'off': 1, // 营业状态
								'uriImg': imgurl, // 照片
								"longitude": longitude,
								"latitude": latitude,
								'tokenKey': tokenKey,
								'typeId': typeId
							},
							success: function (data) {
								console.log(latitude);

								if (data.code == 200) {
									//										localStorage.setItem('shopId', data.data.id);
									location.href = '../html/improve_shop.html?edit=2'
									// location.href = './improve_shop.html'
								} else if (data == 4400) {
									// console.log(data);
									layer.alert('未登录', function () {
										location.href = '../html/login.html';
									})
								}

							}
						})
					}
				}
			}
		})

		function cityChoice() {
			var area2 = new LArea();
			area2.init({
				'trigger': '#city',
				'valueTo': '#value',
				'keys': {
					id: 'value',
					name: 'text'
				},
				'type': 2,
				'data': [provs_data, citys_data, dists_data]
			});
		}
		cityChoice();
	}

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
// 					dat
$(function() {
	//填写示例跳转
	$('.settitle p').click(function() {
		location.href = "fillIn_sample.html";
	})
	//	$('.type a').click(function() {
	//		$(this).addClass('active').siblings().removeClass('active');
	//	})
	var tokenKey = localStorage.getItem('tokenKey');
	var shopId = localStorage.getItem('shopId');
	var goodsId = location.search.substring(1).split('=')[1];
	var goodflag = location.search.substring(1);
	console.log(goodflag);
	var starNum, starNuma;
	var imgurl, imgurl1, imgurl2, goodtype;

	//判断上传图片执行
	var a = 0;
	var a2 = 0;

	var index = 0;
	var upImgFlag = [];
	var starNum, starNuma;
	var arr = [];
	var Arr = [];
	var Arr2 = [];
	var pic = {};
	var imgUrl = [];
	var imgArr = [];
	var imgArr2 = [];
	var imgArr3 = [];
	var showimg = [];
	var allArr = [];

	var shop = {
		init: function() {
			this.addagu();
			this.addspc();
			this.upload();
			this.goodsDetail();
			this.goodsshow();
			this.submitForm();
		},
		/*新增规格项*/
		addagu: function() {
			var addagu = '';
			addagu += '<li>' +
				'<h3>规格</h3>' +
				'<span class="libox">' +
				'<label>规格名称:</label>' +
				'<input type="text" placeholder="例如：明月折射率1.56防蓝光镜片" class="goodsname1" />' +
				'</span>' +
				'<span class="liboxa">' +
				'<span class="spanBox">' +
				'<label>价格:</label>' +
				'<input type="number" placeholder="" class="goodsprice" />' +
				'</span>' +
				'<span class="spanBoxa">' +
				'<label>库存:</label>' +
				'<input type="number" placeholder="" class="goodscount" />' +
				'</span>' +
				'</span>' +
				'<i class="goodsDel">×</i>' +
				'</li>'
			$('.addtype').on('click', function() {
				$('.setlist').append(addagu);
			})
			$('.setlist').on('click', '.goodsDel', function() {
				$(this).parents('.setlist li').remove();
			})
		},
		/*新增参数项*/
		addspc: function() {
			var addcs = '';
			addcs += '<div class="layui-row layui-col-space1" style="margin-top:0.15rem;">' +
				'<div class="layui-col-xs1 layui-col-sm1 layui-col-md1 del">' +
				'<i class="iconfont icon-wrong"></i>' +
				'</div>' +
				'<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
				'<input type="text" placeholder="请输入参数名称" class="name">' +
				'</div>' +
				'<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
				'<input type="text" placeholder="请输入参数值" class="sum">' +
				'</div>' +
				'</div>'
			$('.addagu').on('click', function() {
				$('.combo_details').append(addcs);
			})

			var arr = [];
			$('.type button').on("click", function() {
				$(this).addClass('active').siblings().removeClass('active');
				var pramval = $('.type .active').text();
				//console.log(pramval);
				var pramStr = '<div class="layui-row layui-col-space1" style="margin-top:0.15rem;">' +
					'<div class="layui-col-xs1 layui-col-sm1 layui-col-md1 del">' +
					'<i class="iconfont icon-wrong"></i>' +
					'</div>' +
					'<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
					'<input type="text" placeholder="请输入参数名称" class="name" value="' + pramval + '">' +
					'</div>' +
					'<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
					'<input type="text" placeholder="请输入参数值" class="sum">' +
					'</div>' +
					'</div>'
				$('.combo_details').append(pramStr);
				var box = $('.combo_details > div').find('.name');
				console.log(box)
				for(var i = 0; i < box.length; i++) {
					console.log(box[i].value);
					arr.push(box[i].value);
					console.log(arr);
					for(var j in arr) {
						if(pramval == arr[j]) {
							$('.type .active').attr('disabled', true);
						} else {
							$('.type .active').attr('disabled', false);
						}
					}
				}
				arr = [];
			})
			$('.combo_details').on('click', '.del', function() {
				$(this).parents('.layui-row').remove();
				var pramval = $('.type .active').text();
				var box = $('.combo_details > div').find('.name');
				console.log(box)
				for(var i = 0; i < box.length; i++) {
					console.log(box[i].value);
					arr.push(box[i].value);
					console.log(arr);
					for(var j in arr) {
						if(pramval == arr[j]) {
							$('.type .active').attr('disabled', true);
						} else {
							$('.type .active').attr('disabled', false);
						}
					}
				}
				//arr = [];
			})
		},
		/*上传商品图片 */
		upload: function() {
			var images = {
				index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
				selectIds: {}, //保存已经选择的图片id
				uploadIds: {} //保存已经上传到微信服务器的图片
			};

			wx.ready(function() {
				// 5 图片接口
				// 5.1 拍照、本地选图
				$("#headPortraitUpload").on("click", function() {
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
									//上传成功，images.selectIds中移除，images.uploadIds追加
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
											// 大字段转base64
											if(localData.indexOf('data:image') != 0) {
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
													url: global + "/shop/uploadImg",
													"type": "POST",
													data: formData,
													dataType: "json",
													async: false,
													processData: false, // 告诉jQuery不要去处理发送的数据  
													contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
													success: function(data) {
														imgurl1 = data.data[0];
														// 上传回显
														var _str = "<img src=" + imgurl1 + "  id='chose_pic_btns' style='margin-top:0;'/>"
														$('#chose_pic_btn').html(_str);
														// alert(data)
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
									// alert('上传失败 ' + i + '/' + length);
								}
							});
						}
					});
				});
			});

			wx.error(function(res) {
				// alert(res.errMsg);
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

		/*上传商品详情图*/
		goodsDetail: function() {
			var images = {
				index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
				selectIds: {}, //保存已经选择的图片id
				uploadIds: {} //保存已经上传到微信服务器的图片
			};
			wx.ready(function() {
				// 5 图片接口
				// 5.1 拍照、本地选图
				$("#goodsDetail").on("click", function() {
					//拍照或从手机相册中选图接口
					wx.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function(res) {
							for(var i = 0; i < res.localIds.length; i++) {
								//全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
								var id = '' + images.index++;
								images.selectIds[id] = res.localIds[i];
								var count = 0;
								upImgLoad(count);
							}

							function upImgLoad(count) {
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
										//上传成功，images.selectIds中移除，images.uploadIds追加
										//图片从已选择移到已上传区域
										var selectId = selectIds[i];
										localId = images.selectIds[selectId];
										removeId(selectId);
										images.uploadIds[selectId] = res.serverId

										// 获取base64
										wx.getLocalImgData({
											localId: localId,
											success: function(res) {
												// alert('success===========' + res)
												var localData = res.localData;
												if(localData.indexOf('data:image') != 0) {
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
														success: function(data) {
															imgurl2 = data.data[0];
															var _str1 = "<span class='pic_look2'><img class='pic_looka' src='" + imgurl2 + "' /><em id='delete_pic'>-</em></span>"
															$('#chose_pic_btn2').before(_str1);
															Arr2.push(imgurl2);
															//alert(JSON.stringify(Arr2));
															/*上传图片的数量*/
															var uploadimg2 = $(".pic_look2").length;
															//alert(uploadimg2);
															$('#infoimg i').text(uploadimg2);
															if(uploadimg2 == 3) {
																$('#chose_pic_btn2').css("display", "none");
															} else {
																$('#chose_pic_btn2').css("display", "inline-block");
															}
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
											},
											fail: function(res) {
												console.log(res);
											}
										});
									},
									fail: function(res) {
										// alert('上传失败 ' + i + '/' + length);
									}
								});
							}
						}
					});
				});
			});
			wx.error(function(res) {
				// alert(res.errMsg);
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
			// 删除
			$(document).on('click', '#delete_pic', function(event) {
				var aa2 = $(this).parents(".pic_look2").index();
				Arr2.splice(aa2, 1);
				$(this).parents(".pic_look2").remove();
				/*上传图片的数量*/
				var uploadimg2 = $(".pic_look2").length;
				//alert(uploadimg2);
				$('#infoimg i').text(uploadimg2);
				a2--;

				aaa2();
			});

			function aaa2() {
				if(a2 == 3) {
					$('#chose_pic_btn2').css("display", "none")
				} else {
					$('#chose_pic_btn2').css("display", "inline-block")
				}
			}
		},
		/*上传商品详情图结束*/
		/*上传商品介绍图*/
		goodsshow: function() {

			var images = {
				index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
				selectIds: {}, //保存已经选择的图片id
				uploadIds: {} //保存已经上传到微信服务器的图片
			};
			wx.ready(function() {
				// 5 图片接口
				// 5.1 拍照、本地选图
				$("#goodsshow").on("click", function() {
					wx.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function(res) {
							for(var i = 0; i < res.localIds.length; i++) {
								//全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
								var id = '' + images.index++;
								images.selectIds[id] = res.localIds[i];
								var count = 0;
								upImgLoad(count);
							}

							function upImgLoad(count) {
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
										//alert(JSON.stringify(res));
										//上传成功，images.selectIds中移除，images.uploadIds追加
										//图片从已选择移到已上传区域
										var selectId = selectIds[i];
										localId = images.selectIds[selectId];
										removeId(selectId);
										images.uploadIds[selectId] = res.serverId

										// 获取base64
										wx.getLocalImgData({
											localId: localId,
											success: function(res) {
												// alert('success===========' + res)
												var localData = res.localData;
												if(localData.indexOf('data:image') != 0) {
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
														success: function(data) {
															//alert(JSON.stringify(data));
															imgurl = data.data[0];
															//alert(imgurl)
															var _str2 = "<span class='pic_look1'><img class='pic_looka' src='" + imgurl + "' /><em id='delete_pic'>-</em></span>"
															$('#chose_pic_btn1').before(_str2);
															Arr.push(imgurl);
															//alert('Arr'+JSON.stringify(Arr));
															///*上传图片的数量*/
															var uploadLen = $(".pic_look1").length;
															//alert(uploadLen);
															console.log(uploadLen);
															$('#showImg i').text(uploadLen);
															if(uploadLen == 9) {
																$('#chose_pic_btn1').css("display", "none");
															} else {
																$('#chose_pic_btn1').css("display", "inline-block");
															}
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
											},
											fail: function(res) {
												console.log(res);
											}
										});
									},
									fail: function(res) {
										// alert('上传失败 ' + i + '/' + length);
									}
								});
							}
						}
					});
				});
			});
			wx.error(function(res) {
				// alert(res.errMsg);
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
			// 删除
			$(document).on('click', '#delete_pic', function(event) {
				//alert(1);
				var aa = $(this).parents(".pic_look1").index();
				//alert(aa);
				Arr.splice(aa, 1);
				$(this).parents(".pic_look1").remove();
				/*上传图片的数量*/
				var uploadLen = $(".pic_look1").length;
				//alert(uploadLen);
				console.log(uploadLen);
				$('#showImg i').text(uploadLen);
				//alert(aa);
				a--;
				aaa();
			});

			function aaa() {
				if(a == 9) {
					$('#chose_pic_btn1').css("display", "none");
				} else {
					$('#chose_pic_btn1').css("display", "inline-block");
				}
			}
			/*上传图片的数量*/
			var uploadLen = $(".pic_look1").length;
			//alert(uploadLen);
			$('#showImg i').text(uploadLen);

		},
		//提交
		submitForm: function() {
			$('.submit').click(function() {
				//图片				
				var mainImg = $('#chose_pic_btns').attr('src');
				var obj = {
					type: 1,
					url: mainImg,
					orders: 1
				}
				imgArr.push(obj);

				for(var i = 0; i < Arr2.length; i++) {
					var obj1 = {
						type: 2,
						url: Arr2[i],
						orders: i + 2
					}
					imgArr2.push(obj1);
				}

				for(var j = 0; j < Arr.length; j++) {
					var obj2 = {
						type: 3,
						url: Arr[j],
						orders: j + 5
					}
					imgArr3.push(obj2);
				}
				var allpic = imgArr.concat(imgArr2, imgArr3);
				//alert(JSON.stringify(allpic));
				/*获取信息*/
				var type = $('#goodsType').val(); //商品类别				
				var productname = $('#title').val(); //商品名称
				var beginPrice = $('#beginPrice').val();
				var nowPrice = $('#nowPrice').val();
				//商品分类（ 2：镜架 3：镜片 5：太阳镜 6：隐形眼镜 7：老花镜）
				if(type == "镜架") {
					goodtype = '2';
				} else if(type == "镜片") {
					goodtype = '3';
				} else if(type == "太阳镜") {
					goodtype = '5';
				} else if(type == "隐形眼镜") {
					goodtype = '6';
				} else if(type == "老花镜") {
					goodtype = '7';
				}else if(type == "护理产品") {
					goodtype = '8';
				}

				/*获取规格*/
				/* [{productName:ff,stock:xx,price:12}] (规格名称，规格库存，规格价格) */
				var productName = [];
				var stock = [];
				var price = [];
				var specjson = [];
				var spec = $('.setlist li');
				for(var i = 0; i < spec.find('.goodsname1').length; i++) {
					productName.push(spec.find('.goodsname1')[i].value);
					stock.push(spec.find('.goodscount')[i].value);
					price.push(spec.find('.goodsprice')[i].value);
					var specJson = {
						"spectName": productName[i],
						"stock": stock[i],
						"price": price[i]
					}
					specjson.push(specJson);
				}
				console.log(specjson);
				/*获取规格 --- end-----*/
				/*获取参数*/
				//参数 json [{dictKey:xx,dictValue:xx}]
				var paramjson = [];
				var dictKey = [];
				var dictValue = [];
				var div = $('.combo_details > div');
				for(var i = 0; i < div.find('.name').length; i++) {
					dictKey.push(div.find('.name')[i].value);
					dictValue.push(div.find('.sum')[i].value);
					var paramJson = {
						"dictKey": dictKey[i],
						"dictValue": dictValue[i],
					}
					paramjson.push(paramJson);
				}
				console.log(paramjson);
				var Arrimg1 = JSON.stringify(imgArr2);
				var Arrimg2 = JSON.stringify(imgArr3);
				var Arrimg3 = JSON.stringify(imgArr);
				var parm = JSON.stringify(paramjson);
				var spec = JSON.stringify(specjson);
				var allPic = JSON.stringify(allpic);
				var pic_look2Len = $(".pic_look2").length;
				var pic_look1Len = $(".pic_look1").length;
				/*获取参数 --- end-----*/
				if(!goodtype || !productname || !beginPrice || !nowPrice || !spec || !parm || !allPic  || !mainImg  || !Arrimg1 || !Arrimg2 || !Arrimg3) {
					layer.alert('请完善信息');
				} else {
					$.ajax({
						type: "post",
						url: global + "/ekProduct/addProduct",
						async: true,
						data: {
							"tokenKey": tokenKey,
							"shopId": shopId,
							"type": goodtype, //商品类别
							"productName": productname, //商品名称
							"beginPrice": beginPrice, //商品门市价
							"nowPrice": nowPrice, //商品现价
							"imgJson": allPic,
							"specJson": spec, //规格 json [{spectName:ff,stock:xx,price:12}] (规格名称，规格库存，规格价格)
							"paramJson": parm //参数 json [{dictKey:xx,dictValue:xx}]
							//图片 json[{type:1,url:22.png,orders:1}] (type:1主图 2详情图 3介绍图) (url：文件路径) (orders：排序顺序)
						},
						success: function(data) {
							//alert(JSON.stringify(data));
							console.log(data);
							if(data.code == 200) {
								//console.log(data);
								if(goodflag == 'a') {
									layer.msg('添加商品成功', function() {
										location.href = 'shop_info.html'
									});
								}
							} else if(data.code == 400) {
								layer.msg(data.msg);
							} else if(data == 4400) {
								layer.alert('未登录', function() {
									location.href = '../html/login.html';
								})
							}
						}
					});
				}

				/*提交前判断*/
				//				if(!goodtype){
				//					layer.msg('请填写商品类别');
				//				}
				//				if(!productname){
				//					layer.msg('请填写商品名称');
				//				}
				//				if(!beginPrice){
				//					layer.msg('请填写门市价');
				//				}
				//				if(!nowPrice){
				//					layer.msg('请填写平台价');
				//				}
				//				if(!spec){
				//					layer.msg('请填写规格');
				//				}
				//				if(!parm){
				//					layer.msg('请填写参数');
				//				}
				//				if(!allPic){
				//					layer.msg('请上传图片');
				//				}else if(pic_look1Len == 0){
				//					layer.msg('请上传介绍图');
				//				}else if(pic_look2Len == 0){
				//					layer.msg('请上传详情图');
				//				}
				/*提交前判断 --- end -- */
			})
		}
	}
	shop.init();
})
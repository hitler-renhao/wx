$(function () {

	var shopId = localStorage.getItem('shopId');
	var tokenKey = localStorage.getItem('tokenKey'); // 登录凭证
	// 获取openId
	if (!!tokenKey) {
		getOpenid(1, tokenKey);
		console.log(localStorage.getItem('openId'));
	}

	var starNum, starNuma;
	var formData;
	var arr = [];
	var pic = {};
	var imgUrl = [];
	var shop = {
		init: function () {
			this.upload();
			this.submitForm();
		},

		//上传压缩图片
		upload: function () {
			var images = {
				index: 1, //用于产生全局图片id，绑定已选择图片和已上传图片
				selectIds: {}, //保存已经选择的图片id
				uploadIds: {} //保存已经上传到微信服务器的图片
			};
			wx.ready(function () {
				// 5 图片接口
				// 5.1 拍照、本地选图
				$("#headPortraitUpload").on("click", function () {
					wx.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function (res) {
							for (var i = 0; i < res.localIds.length; i++) {
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
															var _str = "<span class='pic_look'><img class='pic_looka' src='" + imgurl + "' /><em id='delete_pic'>-</em></span>"
															$('#chose_pic_btn').before(_str);
															arr.push(imgurl);
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
											fail: function (res) {
												console.log(res);
											}
										});
									},
									fail: function (res) {
										// alert('上传失败 ' + i + '/' + length);
									}
								});
							}
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
			// 删除
			$(document).on('click', '#delete_pic', function (event) {
				var aa = $(this).parents(".pic_look").index();
				Arr.splice(aa, 1);
				$(this).parents(".pic_look").remove();
				console.log(aa);
				a--;
				aaa()
			});

			function aaa() {
				if (a == 9) {
					$('#chose_pic_btn').css("display", "none")
				} else {
					$('#chose_pic_btn').css("display", "inline-block")
				}
			}
		},
		//星级
		star: function () {
			var rating = (function () {
				var lightOn = function ($item, num) {
					$item.each(function (index) {
						if (index < num) {
							$(this).css({
								'background': 'url(../images/starclicked.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						} else {
							$(this).css({
								'background': 'url(../images/starclicking.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						}
					});
				};
				var init = function (el, num) {
					var $rating = $(el);
					var $item = $rating.find('.rating-item');
					var $itema = $rating.find('.rating-itema');
					lightOn($item, num);
					$rating.on('mouseover', '.rating-item', function () {
						lightOn($item, $(this).index() + 1);
					}).on('click', '.rating-item', function () {
						num = $(this).index() + 1;
						console.log(num);
						if (num == 1) {
							layer.msg('很不好');
							starNum = 1;
						} else if (num == 2) {
							layer.msg('不好');
							starNum = 2;
						} else if (num == 3) {
							layer.msg('一般');
							starNum = 3;
						} else if (num == 4) {
							layer.msg('好');
							starNum = 4;
						} else if (num == 5) {
							layer.msg('很好');
							starNum = 5;
						}
					}).on('mouseout', function () {
						lightOn($item, num);
					});

					$rating.on('mouseover', '.rating-itema', function () {
						lightOn($item, $(this).index() + 1);
					}).on('click', '.rating-itema', function () {
						numa = $(this).index() + 1;
						//console.log(num);
						if (num == 1) {
							layer.msg('很不好');
							starNuma = 1;
						} else if (num == 2) {
							layer.msg('不好');
							starNuma = 2;
						} else if (num == 3) {
							layer.msg('一般');
							starNuma = 3;
						} else if (num == 4) {
							layer.msg('好');
							starNum = 4;
						} else if (num == 5) {
							layer.msg('很好');
							starNum = 5;
						}
					}).on('mouseout', function () {
						lightOn($item, num);
						lightOn($itema, num);
					});
				};
				//变成jquery
				$.fn.extend({
					rating: function (num) {
						return this.each(function () {
							init(this, num);
						});
					}
				});
				return {
					init: init
				};
			})();
			rating.init('#rating1', 0);
			//jquery的调用形式

			var ratinga = (function () {
				var lightOna = function ($itema, numa) {
					$itema.each(function (indexa) {
						if (indexa < numa) {
							$(this).css({
								'background': 'url(../images/starclicked.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						} else {
							$(this).css({
								'background': 'url(../images/starclicking.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						}
					});
				};
				var inita = function (ela, numa) {
					var $ratinga = $(ela);
					var $itema = $ratinga.find('.rating-itema');
					lightOna($itema, numa);
					$ratinga.on('mouseover', '.rating-itema', function () {
						lightOna($itema, $(this).index() + 1);
					}).on('click', '.rating-itema', function () {
						numa = $(this).index() + 1;
						console.log(numa);
						if (numa == 1) {
							layer.msg('很不好');
							starNuma = 1;
						} else if (numa == 2) {
							layer.msg('不好');
							starNuma = 2;
						} else if (numa == 3) {
							layer.msg('一般');
							starNuma = 3;
						} else if (numa == 4) {
							layer.msg('好');
							starNuma = 4;
						} else if (numa == 5) {
							layer.msg('很好');
							starNuma = 5;
						}
					}).on('mouseout', function () {
						lightOna($itema, numa);
					});
				};
				//变成jquery
				$.fn.extend({
					rating: function (numa) {
						return this.each(function () {
							inita(this, numa);
						});
					}
				});
				return {
					inita: inita
				};
			})();
			ratinga.inita('#rating2', 0);
			//jquery的调用形式
		},
		//提交
		submitForm: function () {
			this.star();
			$('.submit').click(function () {
				var commentContent = $('#commentContent').val();
				console.log(arr);
				if (!starNum) {
					layer.msg('请对店内环境设施进行评价');
					return false;
				}
				if (!starNuma) {
					layer.msg('请对商家服务质量进行评价');
					return false;
				}
				if (!commentContent) {
					layer.msg('请详细做评价');
					return false;
				}
				for (var index = 0; index < arr.length; index++) {
					pic = {
						type: '6',
						imagePath: arr[index]
					}
					imgUrl.push(pic);
				}
				$.ajax({
					type: "post",
					url: global + "/comment/addComment",
					async: true,
					data: {
						"tokenKey": tokenKey,
						"leftId": shopId,
						"star": starNum, //店内环境设施评价
						"star1": starNuma, //商家服务质量评价
						"commentContent": commentContent, //评语
						"commentImg": JSON.stringify(imgUrl) //上传图片
					},
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							console.log(data);
							layer.msg('评价成功');
							localStorage.setItem('shopId', shopId);
							location.href = 'shop_detail.html?shopId=' + shopId;
						} else if (data.code == 400) {
							layer.alert("一个月内不能评论一个店铺两次", function () {
								location.href = 'shop_detail.html?shopId=' + shopId;
							})
						} else if (data == 4400) {
							layer.alert('未登录', function () {
								location.href = 'login.html';
							})
						}
					}
				});
			})
		}
	}
	shop.init();
})
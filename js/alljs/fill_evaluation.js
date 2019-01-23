$(function() {
	var tokenKey = localStorage.getItem('tokenKey');
//	var tokenKey = '37bc7a5bbef14caeba3deb4ad772ce771545896471782';
	var starNum, starNuma;
	var imgurl, imgurl1, imgurl2, goodtype;
	var idobj = location.search.substring(1).split('&');
	var orderId = idobj[0].split('=')[1];
	var orderimg = idobj[1].split('=')[1];
	var goodsId = idobj[2].split('=')[1];
	$('.goodsimg').attr('src',orderimg);
	//判断上传图片执行
	var a = 0;
	var index = 0;
	var starNum;
	var arr = [];
	var Arr = [];
	var Arr2 = [];
	var pic = {};
	var imgUrl = [];
	
	var fill = {
		init: function() {
			this.goodsshow();
			this.submitForm();
		},
		//星级
		star: function() {
			var rating = (function() {
				var lightOn = function($item, num) {
					$item.each(function(index) {
						if(index < num) {
							$(this).css({
								'background': 'url(../images/star2.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						} else {
							$(this).css({
								'background': 'url(../images/star1.png) 0 0 no-repeat',
								'background-size': 'cover'
							});
						}
					});
				};
				var init = function(el, num) {
					var $rating = $(el);
					var $item = $rating.find('.rating-item');
					var $itema = $rating.find('.rating-itema');
					lightOn($item, num);
					$rating.on('mouseover', '.rating-item', function() {
						lightOn($item, $(this).index() + 1);
					}).on('click', '.rating-item', function() {
						num = $(this).index() + 1;
						console.log(num);
						if(num == 1) {
							layer.msg('很不好');
							starNum = 1;
						} else if(num == 2) {
							layer.msg('不好');
							starNum = 2;
						} else if(num == 3) {
							layer.msg('一般');
							starNum = 3;
						} else if(num == 4) {
							layer.msg('好');
							starNum = 4;
						} else if(num == 5) {
							layer.msg('很好');
							starNum = 5;
						}
					}).on('mouseout', function() {
						lightOn($item, num);
					});

					$rating.on('mouseover', '.rating-itema', function() {
						lightOn($item, $(this).index() + 1);
					}).on('click', '.rating-itema', function() {
						numa = $(this).index() + 1;
						//console.log(num);
						if(num == 1) {
							layer.msg('很不好');
							starNuma = 1;
						} else if(num == 2) {
							layer.msg('不好');
							starNuma = 2;
						} else if(num == 3) {
							layer.msg('一般');
							starNuma = 3;
						} else if(num == 4) {
							layer.msg('好');
							starNum = 4;
						} else if(num == 5) {
							layer.msg('很好');
							starNum = 5;
						}
					}).on('mouseout', function() {
						lightOn($item, num);
						lightOn($itema, num);
					});
				};
				//变成jquery
				$.fn.extend({
					rating: function(num) {
						return this.each(function() {
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
		},
		//上传评价图
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
															a++;
															aaa();
															imgurl = data.data[0];															
															// alert(imgurl);
															var _str2 = "<span class='pic_look1'><img class='pic_looka' src='" + imgurl + "' /><em id='delete_pic'>-</em></span>"
															$('#chose_pic_btn1').before(_str2);
															Arr.push(imgurl);																													
															$('#showImg i').text(a);														
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
				var aa = $(this).parents(".pic_look1").index();
				//alert(aa);
				Arr.splice(aa, 1);
				$(this).parents(".pic_look1").remove();				
				a--;
				$('#showImg i').text(a);
				aaa();
			});

			function aaa() {
				if(a == 9) {
					$('#chose_pic_btn1').css("display", "none");
				} else {
					$('#chose_pic_btn1').css("display", "inline-block");
				}
			}
		},
		//提交
		submitForm: function () {
			this.star();
			$('.submit').click(function () {
				var commentContent = $('.txt').val();				
				if (!starNum) {
					layer.msg('请对描述相符进行评价');
					return false;
				}				
				if (!commentContent) {
					layer.msg('请详细做评价');
					return false;
				}
				if(!imgUrl){
					layer.msg('请上传评价图');
					return false;
				}
				//alert(JSON.stringify(Arr));
				for (var index = 0; index < Arr.length; index++) {
					pic = {
						type: '6',
						imagePath: Arr[index]
					}
					imgUrl.push(pic);
				}				
				// alert(JSON.stringify(imgUrl));
				
				$.ajax({
					type: "post",
					url: global + "/comment/addComment",
					async: true,
					data: {
						"tokenKey": tokenKey,
						"leftId":goodsId,
						"productOrderLeftId": orderId,//订单评论列表 id（关联表的id）
						"productOrderStart": starNum, 					
						"commentContent": commentContent, //评语
						"commentImg": JSON.stringify(imgUrl)//JSON.stringify(imgUrl) //上传图片
					},
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							console.log(data);
							layer.msg('评价成功');
							setTimeout(function(){
								localStorage.setItem('orderId', orderId);
								location.href = 'fill_order_list_C.html?orderId=' + orderId;
							},200)
							
						}else if (data == 4400) {
							layer.alert('未登录', function () {
								location.href = 'login.html';
							})
						}
					}
				});
			})
		}
	}
	fill.init();
})
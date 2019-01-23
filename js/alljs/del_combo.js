$(function () {
  var shopId = localStorage.getItem('shopId');
  var tokenKey = localStorage.getItem('tokenKey');
  var setmealid = location.href.split('?')[1].split('=')[1];

  // 回显套餐详情
  $.ajax({
    type: 'post',
    url: global + "/ekSetMeal/querySetMealinfo",
    async: true,
    data: {
      'tokenKey': tokenKey, // 店铺ID
      'setmealid': setmealid, // 图片
    },
    success: function (data) {
      if (data.code == 200) {
        var res = data.data;
        console.log(res);
        $('#title').val(res.setmeal.name)
        $('#combo_info').val(res.setmeal.explains)
        $('#shop_price').val(res.setmeal.price)
        $('#platform_price').val(res.setmeal.nowPrice)

        // 套餐明细
        var str = '';
        for (var i = 0; i < res.setmealAtt.length; i++) {
          str += '<div class="layui-row layui-col-space1">' +
            '<div class="layui-col-xs1 layui-col-sm1 layui-col-md1 del">' +
            '<i class="iconfont icon-wrong"></i>' +
            '</div>' +
            '<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
            '<input type="text" placeholder="冰纯钛合金镜框" class="name" value="' + res.setmealAtt[i].specName + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="number" placeholder="1" class="sum" value="' + res.setmealAtt[i].specSum + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="text" placeholder="副" class="company" value="' + res.setmealAtt[i].specCompany + '">' +
            '</div>' +
            '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
            '<input type="number" placeholder="299" class="price" value="' + res.setmealAtt[i].specPrice + '">' +
            '</div>' +
            '</div>'
        }
        $('.combo_details').append(str);

        // 有效期
        var time = res.setmeal.time;
        var endTime = new Date(time).getTime();
        var startTime = new Date().getTime();
        console.log(format(endTime));
        $('.end-time').text('到期时间: ' + format(endTime));
        console.log(format(endTime - startTime));
        $('.surplus-time').text('剩余时间: ' + format(endTime - startTime));

        // 购买须知
        $('#user_know').val(res.setmeal.content);

        // 套餐及详情图
        var imgs = [$('#goods-pic1'), $('#goods-pic2'), $('#goods-pic3')];
        for (var i = 0, j = 0; i < res.setmealFile.length; i++) {
          if (res.setmealFile[i].type == 1) {
            $('#goods-pic').attr('src', res.setmealFile[i].url)
          } else if (res.setmealFile[i].type == 2) {
            imgs[j++].attr('src', res.setmealFile[i].url)
          }
        }

        // 发布须知
        // $('.public_check').attr('src', "../images/checking.png");

      } else if (data == 4400) {
        layer.alert('未登录', function () {
          // location.href = '../html/login.html';
        })
      }

    }
  })
  // 时间戳转日期时间
  function add0(m) {
    return m < 10 ? '0' + m : m
  }

  function format(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    // return add0(h) + ':' + add0(mm) +  ':' + add0(s);
  }

  // 套餐明细加项目
  $('.add_btn').click(function () {
    var str = '';
    str += '<div class="layui-row layui-col-space1">' +
      '<div class="layui-col-xs1 layui-col-sm1 layui-col-md1 del">' +
      '<i class="iconfont icon-wrong"></i>' +
      '</div>' +
      '<div class="layui-col-xs5 layui-col-sm5 layui-col-md5">' +
      '<input type="text" placeholder="冰纯钛合金镜框" class="name">' +
      '</div>' +
      '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
      '<input type="number" placeholder="1" class="sum">' +
      '</div>' +
      '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
      '<input type="text" placeholder="副" class="company">' +
      '</div>' +
      '<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">' +
      '<input type="number" placeholder="299" class="price">' +
      '</div>' +
      '</div>'
    $('.combo_details').append(str);
    // 删除套餐项目
    $('.combo_details').on('click', '.del', function () {
      $(this).parents('.layui-row').remove();
    })
  })

  // 选择时间
  $('.click_month li').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
  })

  // 文本域字数限制
  $('textarea').on('keyup', function () {
    var txtval = $('textarea').val().length;
    $('.text_number').text(txtval);
    if (txtval > 450) {
      $('.buy_know').css({
        'color': 'red'
      })
    } else {
      $('.buy_know').css({
        'color': '#aaa'
      })
    }
  })

  // 发布协议
  $('.public_check').click(function () {
    if ($(this).attr('src') == "../images/checking.png") {
      $(this).attr('src', "../images/check.png");
    } else {
      $(this).attr('src', "../images/checking.png");
    }
  })

  // 上传图片
  var shop = {
    init: function () {
      this.upload($("#main_btn"), 'main_btns', $('#chose_pic_btn0'));
      this.upload($("#idCardUp"), 'idCardDoUps', $('#chose_pic_btn1'));
      this.upload($("#idCardDown"), 'idCardDoDowns', $('#chose_pic_btn2'));
      this.upload($("#zige"), 'card', $('#chose_pic_btn3'));
      this.submitForm();
    },
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


    // 提交
    submitForm: function () {
      $('.submit').click(function () {
        // 获取套餐简介
        var title = $('#title').val();
        var combo_info = $('#combo_info').val();
        var shop_price = $('#shop_price').val();
        var platform_price = $('#platform_price').val();
        console.log('商品名---' + title);
        console.log('套餐说明---' + combo_info);
        console.log('门市价---' + shop_price);
        console.log('平台价---' + platform_price);


        // 获取套餐明细
        var name = new Array();
        var sum = new Array();
        var company = new Array();
        var price = new Array();
        var details = new Array();
        var div = $('.combo_details > div');
        for (var i = 0; i < div.find('.name').length; i++) {
          name.push(div.find('.name')[i].value)
          sum.push(div.find('.sum')[i].value)
          company.push(div.find('.company')[i].value)
          price.push(div.find('.price')[i].value)
          var combo = {
            specName: name[i],
            specSum: sum[i],
            specCompany: company[i],
            specPrice: price[i],
            orders: i
          }
          details.push(combo);
        }
        console.log('套餐明细---' + JSON.stringify(details));
        details = JSON.stringify(details)

        // 有效期
        var timess = '';
        for (var i = 0; i < 3; i++) {
          var text = $('.click_month').find('.active').text();
          if (text == '一个月') {
            timess = '1';
          } else if (text == '三个月') {
            timess = '2';
          } else if (text == '六个月') {
            timess = '3';
          }
        }
        console.log('有效期---' + timess);

        // 使用须知
        var use_know = $('textarea').val();
        console.log('使用须知---' + use_know);

        // 图片
        var pic = {};
        var firstpic = [];
        var imgUrl = [];

        var headPic11 = $('#main_btns').attr('src'); //图片路径
        // alert('headPic11-----' + headPic11)
        var headPic12 = $('#goods-pic').attr('src'); //图片路径
        var headPic21 = $('#idCardDoUps').attr('src'); //图片路径
        // alert('headPic21-----' + headPic21)
        var headPic22 = $('#goods-pic1').attr('src'); //图片路径
        var headPic31 = $('#idCardDoDowns').attr('src'); //图片路径
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
            url: firstpic[index],
            orders: index
          }
          console.log(pic);
          imgUrl.push(pic);
          console.log(imgUrl);
        }
        imgUrl = JSON.stringify(imgUrl);

        // 发布协议
        var check = $('.public_check').attr('src');

        // 判断是否可以提交
        if (!title || !combo_info || !shop_price || !platform_price || !details || !timess || !use_know || !imgUrl) {
          layer.msg('请将必填项填写完整')
        } else {
          // 是否勾选平台发布协议
          if (check == '../images/check.png') {
            layer.msg('请勾选《e可平台商品发布协议》')
          } else {
            layer.confirm('重新上架操作不会消除此删除记录，只会重新生成一个新的商品，对此条数据不会产生影响，您确定要重新上架吗？', {
              btn: ['确认无误', '我再看看'],
              btn1: function () {
                $.ajax({
                  type: 'post',
                  url: global + "/ekSetMeal/addSetMeal",
                  async: true,
                  data: {
                    'tokenKey': tokenKey, // 店铺ID
                    'shopId': shopId, // 图片
                    'name': title, // 介绍
                    'explains': combo_info,
                    'price': shop_price,
                    'nowPrice': platform_price, //
                    'timess': timess,
                    'content': use_know,
                    'off': 1,
                    'mealInfo': details,
                    'imgInfo': imgUrl
                  },
                  success: function (data) {
                    if (data.code == 200) {
                      console.log(data);
                      location.href = '../html/combo_list.html';
                    } else if (data == 4400) {
                      layer.alert('未登录', function () {
                        location.href = '../html/login.html';
                      })
                    }

                  }
                })
              }
            })
          }
        }


      })
    }
  }
  shop.init();
})
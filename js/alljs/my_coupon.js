$(function(){
    //获取tokenKey
    var tokenKey = localStorage.getItem('tokenKey');
    
    // 初始页面获取数据
    getData(0);

    // 导航切换
    $("#nav").on("click","li",function(){
        var $this=$(this).index();
        $(".unused").css("display","none");
        $(".unused").eq($this).css("display","block");
        $("#nav li").removeClass("active");
        $(this).addClass("active");
        getData($this)
    })
    
    // 获取数据
    function getData(num){
        $.ajax({
            url: global + "/coupon/queryCouponListByToken",
            type: "get",
            data: {
                "tokenKey": tokenKey,
                // "tokenKey": "3b49a49011cb43db9f63f7519f03f8a41551939572999",
                'status': num+1,
                // 'status': '1',
                "shopId":""
            },
            success: function (data) {
                console.log(data)
                //未使用
                if(num===0){
                    var str="";
                    if(data.data){
                        for(var i=0;i<data.data.length;i++){
                            var oData=data.data[i];
                            if(!oData.shopName){
                                oData.shopName="";
                            }
                            // "2019-09-30T02:40:06.000+0000"
                            oData.endtime = oData.endtime ? oData.endtime.split("T") : ['即将'];
                            // oData.endtime = oData.endtime.split("T");
                            str+='<div class="couponbg">'
                                +'<div class="coupon-left">'
                                    +'<p><b style="color:white;">￥'+oData.facevalue+'</b></p>'
                                    +'<div style="color:white;">'+oData.name+'</div>'
                                +'</div>'
                                +'<div class="coupon-rig">'
                                    +'<p><b>'+oData.shopName+'</b></p>'
                                    +'<p id="namess"><i>'+ (oData.type == 1 ? '通用类' : oData.type == 2 ? '指定商品' : '指定分类') +'</i></p>'
                                    +'<div>'
                                        +'<span class="data">'+oData.endtime[0]+'过期</span>'
                                        +'<span class="btn lijiUse" data-shopid="'+oData.shopid+'">立即使用</span>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        }
                        $("#unused").html(str)
                    }
                }else if(num===1){   //已使用
                    var str="";
                    if(data.data){
                        for(var i=0;i<data.data.length;i++){
                            var oData=data.data[i];
                            str+='<div class="couponbg">'
                                +'<div class="coupon-left">'
                                    +'<p><b style="color:white;">￥'+oData.facevalue+'</b></p>'
                                    +'<div style="color:white;">'+oData.name+'</div>'
                                +'</div>'
                                +'<div class="coupon-rig">'
                                    +'<p><b>'+oData.shopName+'</b></p>'
                                    +'<div>'
                                        +'<span class="data"></span>'
                                        +'<span class="btn">已使用</span>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        }
                        $("#used").html(str);
                    }
                }else if(num===2){    //已过期
                    var str="";
                    if(data.data){
                        for(var i=0;i<data.data.length;i++){
                            var oData=data.data[i];
                            str+='<div class="couponbg">'
                                +'<div class="coupon-left">'
                                    +'<p><b style="color:white;">￥'+oData.facevalue+'</b></p>'
                                    +'<div style="color:white;">'+oData.name+'</div>'
                                +'</div>'
                                +'<div class="coupon-rig">'
                                    +'<p><b>'+oData.shopName+'</b></p>'
                                    +'<div>'
                                        +'<span class="data"></span>'
                                        +'<span class="btn" >已过期</span>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        }
                        $("#pastdue").html(str);
                    }
                }
            }
        });    
    }
    $("#unused").on("click",".lijiUse",function(){
        var oAttrshopid=$(this).attr("data-shopid");
        location.href="shop_detail.html?shopid="+oAttrshopid;
    })
    // shop_detail

    // 时间格式转化
    function timeFormat(time) {
        var d = new Date(time);
    
        var year = d.getFullYear();       //年  
        var month = d.getMonth() + 1;     //月  
        var day = d.getDate();            //日  
    
        var hh = d.getHours();            //时  
        var mm = d.getMinutes();          //分  
        var ss = d.getSeconds();           //秒  
    
        var clock = year + "-";
    
        if (month < 10)
            clock += "0";
    
        clock += month + "-";
    
        if (day < 10)
            clock += "0";
    
        clock += day + " ";
    
        return (clock);
    }





})
(function($) {

	var geoLon;
	var geoLat;
	var geocity
	//HTML5与百度地图相关方法
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,12);

	var geolocation = new BMap.Geolocation();
	
		console.log(geolocation)

	// 开启SDK辅助定位
	geolocation.enableSDKLocation();
	
	geolocation.getCurrentPosition(function(r){
		console.log(geolocation.SW)
	if(this.getStatus() == BMAP_STATUS_SUCCESS){
		
		geocity = geolocation.SW.address.city;
		var mk = new BMap.Marker(r.point);
		map.addOverlay(mk);
		map.panTo(r.point);
		//alert('您的位置：'+r.point.lng+','+r.point.lat);
		geoLon = r.point.lng;
		geoLat = r.point.lat;
		var myGeo = new BMap.Geocoder();      
			// 根据坐标得到地址描述    
		myGeo.getLocation(new BMap.Point(geoLon, geoLat), function(r){      
		    if (r){     
		    	console.log(geoLon)
				$('#allmap').css('display',"none");
				
		    }      
		});
		
		
	}
	else {
		alert('地区获取错误'+this.getStatus());
	}        
});
		
	$.fn.date = function(options, Ycallback, Ncallback) {
		//插件默认选项
		var that = $(this);
		var docType = $(this).is('input');
		var datetime = false;
		var nowdate = new Date();
		var indexY = 1,
			indexM = 1,
			indexD = 1;
		var indexH = 1,
			indexI = 1,
			indexS = 0;
		var initY = parseInt((nowdate.getYear() + "").substr(1, 2));
		var initM = parseInt(nowdate.getMonth() + "") + 1;
		var initD = parseInt(nowdate.getDate() + "");
		var initH = parseInt(nowdate.getHours());
		var initI = parseInt(nowdate.getMinutes());
		var initS = parseInt(nowdate.getYear());
		var yearScroll = null,
			monthScroll = null,
			dayScroll = null;
		var HourScroll = null,
			MinuteScroll = null,
			SecondScroll = null;
		$.fn.date.defaultOptions = {
			beginyear: 2000, //日期--年--份开始
			endyear: 2020, //日期--年--份结束
			beginmonth: 1, //日期--月--份结束
			endmonth: 12, //日期--月--份结束
			beginday: 1, //日期--日--份结束
			endday: 31, //日期--日--份结束
			beginhour: 1,
			endhour: 12,
			beginminute: 00,
			endminute: 59,
			curdate: false, //打开日期是否定位到当前日期
			theme: "date", //控件样式（1：日期，2：日期+时间）
			mode: null, //操作模式（滑动模式）
			event: "click", //打开日期插件默认方式为点击后后弹出日期 
			show: true
		}
		//用户选项覆盖插件默认选项   
		var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
		if(opts.theme === "datetime") {
			datetime = true;
		}
		if(!opts.show) {
			that.unbind('click');
		} else {
			//绑定事件（默认事件为获取焦点）
			that.bind(opts.event, function() {
				createUL(); //动态生成控件显示的日期
				init_iScrll(); //初始化iscrll
				extendOptions(); //显示控件
				that.blur();
				if(datetime) {
					showdatetime();
					refreshTime();
				}
				refreshDate();
				bindButton();
			})
		};

		function refreshDate() {
			yearScroll.refresh();
			monthScroll.refresh();
			dayScroll.refresh();

			resetInitDete();
			yearScroll.scrollTo(0, initY * 40, 100, true);
			monthScroll.scrollTo(0, initM * 40 - 40, 100, true);
			dayScroll.scrollTo(0, initD * 40 - 40, 100, true);
		}

		function refreshTime() {
			HourScroll.refresh();
			MinuteScroll.refresh();
			SecondScroll.refresh();
			if(initH > 12) { //判断当前时间是上午还是下午
				SecondScroll.scrollTo(0, initD * 40 - 40, 100, true); //显示“下午”
				initH = initH - 12 - 1;
			}
			HourScroll.scrollTo(0, initH * 40, 100, true);
			MinuteScroll.scrollTo(0, initI * 40, 100, true);
			initH = parseInt(nowdate.getHours());
		}

		function resetIndex() {
			indexY = 1;
			indexM = 1;
			indexD = 1;
		}

		function resetInitDete() {
			if(opts.curdate) {
				return false;
			} else if(that.val() === "") {
				return false;
			}
			initY = parseInt(that.val().substr(2, 2));
			initM = parseInt(that.val().substr(5, 2));
			initD = parseInt(that.val().substr(8, 2));
		}

		function bindButton() {
			resetIndex();
			$("#datecancle").unbind('click').click(function() {
				$("#datePage").hide();
				$("#dateshadow").hide();
			})
			$("#dateconfirm").unbind('click').click(function() {
				var aii = $("#Hourwrapper ul li:eq(" + indexH + ")").html();
				var datestr = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1) + "-" +
					$("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1) + "-" +
					$("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
				if(datetime) {
					if(Math.round(indexS) === 1) { //下午
						$("#Hourwrapper ul li:eq(" + indexH + ")").html(parseInt($("#Hourwrapper ul li:eq(" + indexH + ")").html().substr(0, $("#Hourwrapper ul li:eq(" + indexH + ")").html().length - 1)) + 12)
					} else {
						$("#Hourwrapper ul li:eq(" + indexH + ")").html(parseInt($("#Hourwrapper ul li:eq(" + indexH + ")").html().substr(0, $("#Hourwrapper ul li:eq(" + indexH + ")").html().length - 1)))
					}
					datestr += " " + aii
					indexS = 0;
				}
				var aoo = aii.split('-')
				var choshour= aoo[0]    
				var choshoura = choshour.split(':')
				var choshourb = choshoura[0]
				var chosyear= $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1)
				var chosmon = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1)
				var chosday = $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1)
				
				var choshour2= aoo[0]
			    

				var timm=new Date;
				
	 			var nowyear= timm.getFullYear(); 
	 			var nowmonth=timm.getMonth()+1;
	 			var nowday = timm.getDate();
	 			var nowhours= timm.getHours();
//	 			var nowhourb = nowhoura.split(':')
//	 			var nowhourc = nowhourb[0]
	 			var nowminu= timm.getMinutes();
	 			var mintt = aoo[0].split(':')   
	 			var minty1 = mintt[0]
	 			var hour = nowhours+':00';
	 			var choshourb = Number(choshourb);
	 			var chosmon = Number(chosmon);
	 			var chosyear = Number(chosyear);
	 			var abday = chosday-nowday
	 			var bday =  Number(chosday);
	 			var atob =bday-nowhours

		
				var err=false
				if(chosyear<nowyear){
					console.log('年')
					err=true;
				} else if (chosyear==nowyear){
					if(chosmon<nowmonth){
						err=true;
						console.log('月')
					}else if(chosmon==nowmonth) {
						if(bday<nowday){
								err=true;
							console.log('日')
						}
					}else if(chosmon>nowmonth) {
						if(bday<nowday){
//								err=false;
							if(Ycallback === undefined) {
									if(docType) {
												that.val(datestr);
												} else {
											that.html(datestr);
												}
											} else {
									Ycallback(datestr);
										}
						}
					}
				}else if (chosyear>nowyear){
					if(chosmon<nowmonth){
						if(Ycallback === undefined) {
									if(docType) {
												that.val(datestr);
												} else {
											that.html(datestr);
												}
											} else {
									Ycallback(datestr);
										}
					}else if(chosmon==nowmonth) {
						if(bday<nowday){
								if(Ycallback === undefined) {
									if(docType) {
												that.val(datestr);
												} else {
											that.html(datestr);
												}
											} else {
									Ycallback(datestr);
										}
						}
					}else if(chosmon>nowmonth) {
						if(bday<nowday){
//								err=false;
							if(Ycallback === undefined) {
									if(docType) {
												that.val(datestr);
												} else {
											that.html(datestr);
												}
											} else {
									Ycallback(datestr);
										}
						}
					}
				}
				if(err){
					alert('选择的日期不能早于当前的日期')
				}else{
//					console.log(nowday,bday)
					if(nowday==bday){
						if(chosmon==nowmonth && chosyear==nowyear){
		
								var atob = choshourb-nowhours
								console.log(atob)
				 				if(atob<0){
				 					alert('选择时间不得早于当前时间')
				 				}else if(atob==0){
				 					if(nowminu<30){ 	 						
				 						alert('当前时间已超过所选开始服务时间')
				 					}else if(nowminu>30){
				 						alert('当前时间已超过所选开始服务时间')
				 						
				 					}
				 				}else if(atob==1){
				 					if(nowminu>'30'){
				 							alert('当前时间距离所选开始服务时间较短，请重新选择')
				 					}else{
				 							if(Ycallback === undefined) {
												if(docType) {
													that.val(datestr);
												} else {
													that.html(datestr);
												}
											} else {
												Ycallback(datestr);
											}
				 						}
				 				}else if(atob>1){
				 					if(Ycallback === undefined) {
												if(docType) {
													that.val(datestr);
												} else {
													that.html(datestr);
												}
											} else {
												Ycallback(datestr);
											}	
				 					}
						}else if(chosmon>nowmonth || chosyear>nowyear){
							if(Ycallback === undefined) {
												if(docType) {
													that.val(datestr);
												} else {
													that.html(datestr);
												}
											} else {
												Ycallback(datestr);
											}	
						}
						
					}else if(nowday<bday){
						if(Ycallback === undefined) {
												if(docType) {
													that.val(datestr);
												} else {
													that.html(datestr);
												}
											} else {
												Ycallback(datestr);
											}
					}

				}
				
//				if(Ycallback === undefined) {
//					if(docType) {
//						that.val(datestr);
//					} else {
//						that.html(datestr);
//					}
//				} else {
//					Ycallback(datestr);
//				}
				$("#datePage").hide();
				$("#dateshadow").hide();
				setTimeout(function(){ 
					var time_type;
					var chose_type;
					var new_child;
					var toptype = $('#aBtn li:first').hasClass("active");
					if(toptype == true){
						time_type =  $('#beginTime').val()
						chose_type = $("#selectshop1")
						
					}else{
						time_type =  $('#endTime').val()
						chose_type = $("#selectshop")					
					}
//					console.log(time_type)
					var time1 = time_type
				var arrTime = time1.split(' ');
					var date1 = arrTime[0];
					var time = arrTime[1];
					var time1 = time.split('-')[0];
					var time2 = time.split('-')[1];
					var stime = date1+' '+time1
					var entime = date1+' '+time2
				$.ajax({
					type: "POST",
					url: globa + '/v1.0/bespeak/getShopList',
					dataType: "json",
					async: false,
					data: {
						"bespeakTimeStart": stime,
						"bespeakTimeEnd": entime,	
						"geocity": geocity
					},
						success: function(data) {
							console.log(data);
							if(data.data != null){
								var str = "";
								var res = data.data;
								for(var i = 0; i < res.length; i++) {
									str += '<option id="' + res[i].id + '">' +
										'<p shopname = "' + res[i].shopname + '">商家名称:' + res[i].shopname + '</p>' +
										'</option>'
								}
								chose_type.html(str);					
								shopId =$('#selectshop2 option').attr('id');
								shopName = $('#selectshop2 option').find("p").attr('shopname');
								var tett = chose_type.children('option').first().attr('id');		
								sessionStorage.setItem("newchild", tett);
							}else{
								alert('请选择其他时间');
							}							
						},
						error: function() {
							alert('出错啦')
						}
					});
				}, 600);
			//END……………………………………………………………………………………………………………………………………………………………………………………………………………………
			});
			
		}

		function extendOptions() {
			$("#datePage").show();
			$("#dateshadow").show();
		}
		//日期滑动
		function init_iScrll() {
			var strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
			var strM = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1)
			yearScroll = new iScroll("yearwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexY = (this.y / 40) * (-1) + 1;
					opts.endday = checkdays(strY, strM);
					$("#daywrapper ul").html(createDAY_UL());
					dayScroll.refresh();
				}
			});
			monthScroll = new iScroll("monthwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexM = (this.y / 40) * (-1) + 1;
					opts.endday = checkdays(strY, strM);
					$("#daywrapper ul").html(createDAY_UL());
					dayScroll.refresh();
				}
			});
			dayScroll = new iScroll("daywrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexD = (this.y / 40) * (-1) + 1;
				}
			});
		}

		function showdatetime() {
			init_iScroll_datetime();
			addTimeStyle();
			$("#datescroll_datetime").show();
			$("#Hourwrapper ul").html(createHOURS_UL());
			$("#Minutewrapper ul").html(createMINUTE_UL());
			//          $("#Secondwrapper ul").html(createSECOND_UL());
		}

		//日期+时间滑动
		function init_iScroll_datetime() {
			HourScroll = new iScroll("Hourwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexH = Math.round((this.y / 40) * (-1)) + 1;
					HourScroll.refresh();
				}
			})
			MinuteScroll = new iScroll("Minutewrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexI = Math.round((this.y / 40) * (-1)) + 1;
					HourScroll.refresh();
				}
			})
			SecondScroll = new iScroll("Secondwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexS = Math.round((this.y / 40) * (-1));
					HourScroll.refresh();
				}
			})
		}

		function checkdays(year, month) {
			var new_year = year; //取当前的年份        
			var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）        
			if(month > 12) //如果当前大于12月，则年份转到下一年        
			{
				new_month -= 12; //月份减        
				new_year++; //年份增        
			}
			var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天        
			return(new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期    
		}

		function createUL() {
			CreateDateUI();
			$("#yearwrapper ul").html(createYEAR_UL());
			$("#monthwrapper ul").html(createMONTH_UL());
			$("#daywrapper ul").html(createDAY_UL());
		}

		function CreateDateUI() {
			var str = '' +
				'<div id="dateshadow"></div>' +
				'<div id="datePage" class="page">' +
				'<section>' +
				'<div id="datetitle"><h1>请选择日期</h1></div>' +
				'<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
				'<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>' +
				'<div id="datescroll">' +
				'<div id="yearwrapper">' +
				'<ul></ul>' +
				'</div>' +
				'<div id="monthwrapper">' +
				'<ul></ul>' +
				'</div>' +
				'<div id="daywrapper">' +
				'<ul></ul>' +
				'</div>' +
				'</div>' +
				'<div id="datescroll_datetime">' +
				'<div id="Hourwrapper">' +
				'<ul></ul>' +
				'</div>' +
				'<div id="Minutewrapper">' +
				'<ul></ul>' +
				'</div>' +
				'<div id="Secondwrapper">' +
				'<ul></ul>' +
				'</div>' +
				'</div>' +
				'</section>' +
				'<footer id="dateFooter">' +
				'<div id="setcancle">' +
				'<ul>' +
				'<li id="dateconfirm">确定</li>' +
				'<li id="datecancle">取消</li>' +
				'</ul>' +
				'</div>' +
				'</footer>' +
				'</div>'
			$("#datePlugin").html(str);
		}

		function addTimeStyle() {
			$("#datePage").css("height", "380px");
			$("#datePage").css("top", "30%");
			$("#yearwrapper").css("position", "absolute");
			$("#yearwrapper").css("bottom", "200px");
			$("#monthwrapper").css("position", "absolute");
			$("#monthwrapper").css("bottom", "200px");
			$("#daywrapper").css("position", "absolute");
			$("#daywrapper").css("bottom", "200px");
		}
		//创建 --年-- 列表
		function createYEAR_UL() {
			var str = "<li>&nbsp;</li>";
			for(var i = opts.beginyear; i <= opts.endyear; i++) {
				str += '<li>' + i + '年</li>'
			}
			return str + "<li>&nbsp;</li>";;
		}
		//创建 --月-- 列表
		function createMONTH_UL() {
			var str = "<li>&nbsp;</li>";
			for(var i = opts.beginmonth; i <= opts.endmonth; i++) {
				if(i < 10) {
					i = "0" + i
				}
				str += '<li>' + i + '月</li>'
			}
			return str + "<li>&nbsp;</li>";;
		}
		//创建 --日-- 列表
		function createDAY_UL() {
			$("#daywrapper ul").html("");
			var str = "<li>&nbsp;</li>";
			for(var i = opts.beginday; i <= opts.endday; i++) {

				str += '<li>' + i + '日</li>'
			}
			return str + "<li>&nbsp;</li>";;
		}
		//创建 --时-- 列表
		function createHOURS_UL() {
			var str = "<li>&nbsp;</li>";
			//          console.log(opts.endhour)
			var needhour = opts.endhour * 2 - 1
			for(var i = 8; i <= 17; i++) {
				var a = i + 1
				if(a>24){
					a=24
				}			
				str += '<li>' + i + ':00-' + a + ':00'+'</li>'
			}
			return str + "<li>&nbsp;</li>";;
		}
		//创建 --分-- 列表
		function createMINUTE_UL() {
			var str = "<li>&nbsp;</li>";
			var test = ''
			for(var i = opts.beginminute; i <= opts.endminute; i++) {
				if(i < 10) {
					i = "0" + i
				}
				str += '<li>' + test + '</li>'
			}
			return str + "<li>&nbsp;</li>";;
		}
		//创建 --分-- 列表
		//      function createSECOND_UL(){
		//          var str="<li>&nbsp;</li>";
		//          str+="<li>上午</li><li>下午</li>"
		//          return str+"<li>&nbsp;</li>";;
		//      }
	}
})(jQuery);
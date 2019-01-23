$(function () {
	var shopId = localStorage.getItem('shopId');
//	var infoId = location.search.substring(1);
	$.ajax({
		type: "post",
		url: global + "/comment/queryList",
		async: true,
		data: {
			"leftId": shopId,//shopId, //shop_Id,
			"pageNum": 1,
			"pageSize": 100
		},
		success: function (data) {
			console.log(data);
			var str = '';
			var res = data.data.result;
			var page = data.data.total;
			//console.log(page);
			//tabLenghtArray.push(page);
			var itemIndex = 0;
			var num = 0;
			var tabLoadEndArray = [false, false, false];
			var tabLenghtArray = [page];
			var tabScroolTopArray = [0, 0, 0];

			// dropload
			var dropload = $('.khfxWarp').dropload({
				scrollArea: window,
				domDown: {
					domClass: 'dropload-down',
					domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
					domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
					domNoData: '<div class="dropload-noData">已无数据</div>'
				},
				loadDownFn: function (me) {
					setTimeout(function () {
						if (tabLoadEndArray[itemIndex]) {
							me.resetload();
							me.lock();
							me.noData();
							me.resetload();
							return;
						}
						var result = '';
						var imgstr = '';
						var starpng = ''
						for(var index = 0; index < 5; index++, num++) {
							if(tabLenghtArray[itemIndex] > 0) {
								tabLenghtArray[itemIndex]--;
							} else {
								tabLoadEndArray[itemIndex] = true;
								break;
							}
							var star = parseFloat(res[num].comment.star);
							console.log(star);
							var star1 = parseFloat(res[num].comment.star1);
							console.log(star1);
							var starNum = (star+star1)/2;
							console.log(starNum);
							if(starNum>0 && starNum <=1){
								starpng = "../images/one.png";
							}else if(starNum>1 && starNum <=2){
								starpng = "../images/two.png";
							}else if(starNum>2 && starNum <=3){
								starpng = "../images/three.png";
							}else if(starNum>3 && starNum <=4){
								starpng = "../images/four.png";
							}else if(starNum>4 && starNum <=5){
								starpng = "../images/wu.png";
							}
							
							str += '<li>' +
								'<span class="title">' +
								'<img src="'+res[num].userimg+'">' +
								'<h4>'+ res[num].comment.iphone +'</h4>' +
								'<span class="star">'+
									'<img src="'+starpng+'"  />'+						
								'</span>'+
								'<i>&nbsp;' + res[num].comment.createTime.split('T')[0] + '</i>' +
								'</span>' +
								'<p class="estimate">' + res[num].comment.commentContent + '</p>' +
//								'<span class="evaImg">' +
//								'<img src="'+ res[num].img[0].imagePath +'" alt="评价图片" />'+
//								'</span>' +
								'</li>'
//								
								for(var j=0;j<res[num].img.length;j++){
									$('.evaImg img').remove();
									imgstr +='<span class="evaImg" style="width:1.5rem;padding-left:0.8rem">' +
											'<img src="'+ res[num].img[j].imagePath +'" alt="评价图片" />'+
											'</span>' 
								}	
//								for(var j = 0; j < res[i].img.length; j++) {
//									$('.evalist .tupian').remove();
//									imgstr +='<span class="tupian">'+
//												'<img src="' + res[i].img[j].imagePath + '" alt="评价图片" />'+
//											'</span>'									
//								}
								str += imgstr;
								imgstr = '';
						}
						$('.khfxPane').eq(itemIndex).append(str);
						//跳转详情
						$('.khfxPane li').click(function () {
							var infoId = $(this).attr('id');
							console.log(infoId);
							window.location.href = './optometrist_detail.html?' + infoId;
						})
						me.resetload();
					}, 500);

				}
			});

			$('.tabHead span').on('click', function () {

				tabScroolTopArray[itemIndex] = $(window).scrollTop();
				var $this = $(this);
				itemIndex = $this.index();
				$(window).scrollTop(tabScroolTopArray[itemIndex]);

				$(this).addClass('active').siblings('.tabHead span').removeClass('active');
				$('.tabHead .border').css('left', $(this).offset().left + 'px');
				$('.khfxPane').eq(itemIndex).show().siblings('.khfxPane').hide();

				if (!tabLoadEndArray[itemIndex]) {
					dropload.unlock();
					dropload.noData(false);
				} else {
					dropload.lock('down');
					dropload.noData();
				}
				dropload.resetload();
			});
		}
	})
});
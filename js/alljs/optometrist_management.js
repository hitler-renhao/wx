$(function () {
	var shopId = localStorage.getItem('shopId');
	//	var infoId = location.search.substring(1);
	$.ajax({
		type: "GET",
		url: global + "/optometrist/shopOptometristList",
		async: true,
		data: {
			shopId: shopId
		},
		success: function (data) {
			var str = '';
			var res = data.data;
			console.log(res);

			var str = '';
			for (var i = 0; i < res.length; i++) {
				if (!res) {
					$('.none').show();
				} else {
					$('.none').hide();
					str += '<li data-id="' + res[i].id + '">' +
						'<img src="' + res[i].image + '" alt="" data-id="' + res[i].id + '"/>' +
						'<span class="optometrist" data-id="' + res[i].id + '">' +
						'<h3 data-id="' + res[i].id + '">' + res[i].name + '</h3>' +
						'<p data-id="' + res[i].id + '">' + res[i].introduction + '</p>' +
						'</span>' +
						'</li>'
				}
			}
			$('.content').append(str);
		}
	})
	//新增验光师
	$('.addOptometrist').click(function () {
		location.href = "optometrist_enter.html?edit=1&edit=2";
	})
	// 进入验光师详情
	$('.content').on('click', 'li', function (e) {
		var target = e.target || e.srcElement;
		var optometristId = $(target).attr('data-id');
		location.href = 'optometrist_info.html?optometristId=' + optometristId;
	})
});
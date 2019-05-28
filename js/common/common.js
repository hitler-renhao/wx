// rem
(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

// 获取openId
function getOpenid(index, tokenKey) {
	if (index >= 3) {
		return;
	}
	$.ajax({
		url: global + '/wexin/getOpenid',
		type: "post",
		data: {
			'tokenKey': tokenKey
		},
		success: function (data) {
			if (data.code == 400) {
				setTimeout(function () {
					getOpenid();
					index++;
				}, 5000)
			} else if (data.code == 200) {
				console.log(data.data.openid)
				localStorage.setItem('openId', data.data.openid);
			}

		}
	})
}


// 线上
var global = 'http://wx.bjysjglasses.com:8181';

// // 测试
// var global = ' http://test.bjysjglasses.com:8181';

// 万里
// var global = 'http://192.168.1.8:8181';

// 李建 ************************************************************
// var global = 'http://192.168.1.227:8181';

//*************************************************************************

//cookie

function setCookie(c_name, value, expiredays) {
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value) +
		((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1) c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
}


// ajax请求
$(function ($) {
	// 备份jquery的ajax方法  
	var _ajax = $.ajax;
	// 重写ajax方法，先判断登录在执行success函数 
	$.ajax = function (opt) {
		var _success = opt && opt.success || function (a, b) {};
		var _opt = $.extend(opt, {
			beforeSend: function (e, xhr) {
				var tokenKey1 = localStorage.getItem('tokenKey1')
				console.log(tokenKey1);

				// console.info("测试 重写 ajax +++请求+++");
				// console.info("url: "+this.url );
				// console.info("data: "+this.data);
				// if(){

				// }
				// this.data+="&token=" + tokenKey1;
				//this.data.token=1;
			},
			success: function (data, textStatus) {

				if (data == 4400) {}
				_success(data, textStatus);


			}
		});
		_ajax(_opt);
	};
});

// setCookie("loginUserOptistname",loginObj.optistname,30);
//var optistname=getCookie("loginUserOptistname");
//console.log(optistname)


//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼           2019 BUG辟易
//
//                             佛曰:
//
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？
// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?0c8624f5c92e98bf57a96e12bc2f7a68";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
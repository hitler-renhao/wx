/**
 * 注意：本插件运用了rem屏幕适配方案，一律采用rem作为单位，若项目中不是采用这种方案的，请在kinerTreeMenu.css中修改样式，此段代码不会影响功能使用，仅会影响控件样式
 */

(function (win, doc, $) {
	var defaultOpt = {
		rotateNum: 5, //转盘转动圈数
		body: "", //大转盘整体的选择符或zepto对象
		goods: '',
		userAwardId: 0,
		type: 0,
		disabledHandler: function (key) {
			switch (key) {
				case "noStart":
					alert("活动尚未开始");
					break;
				case "completed":
					alert("活动已结束");
					break;
			}
		},
		/*禁止抽奖时回调*/
		clickCallback: function () {
			let that = this;
			$.ajax({
				type: 'get',
				url: global + "/ekActivityTurntableUserAward/turntableUserAward",
				async: true,
				data: {
					"tokenKey": localStorage.getItem('tokenKey')
				},
				success: function (data) {
					console.log(data);
					if (data.code == 200) {
						let _deg = data.data.id * 60
						goods = data.data.name;
						userAwardId = data.data.rank;
						type = data.data.id == 3 ? 1 : 2;
						that.goKinerLottery(_deg);
					} else if (data.code == 400) {
						layer.msg(data.msg);
					}
				}
			})
		}, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
		KinerLotteryHandler: function (deg) {
			getCounts();
			alert("恭喜您获得: " + goods);

			console.log(deg);
			let classes = ''
			classes = deg == 180 ? $('.load2') : $('.load1')
			deg == 180 ? $('.load-content-info2').text('本次抽得了"' + goods + '"奖品，请输入有效的手机号，活动结束后由e可统一发放') : $(
				'.load-content-info1').text('本次抽得了"' + goods + '"奖品，请输入有效的收获地址，活动结束后由e可统一发放')
			classes.css({
				'display': 'block'
			})
		} //抽奖结束回调

	};

	function KinerLottery(opts) {
		this.opts = $.extend(true, {}, defaultOpt, opts);
		this.doing = false;
		this.init();
	}
	KinerLottery.prototype.setOpts = function (opts) {
		this.opts = $.extend(true, {}, defaultOpt, opts);
		this.init();
	};
	KinerLottery.prototype.init = function () {
		var self = this;
		this.defNum = this.opts.rotateNum * 360; //转盘需要转动的角度
		// console.log(this.defNum);
		// alert(this.defNum);
		//点击抽奖
		document.getElementById('KinerLotteryBtn').onclick = function () {
			if ($(this).hasClass('start') && !self.doing) {
				self.opts.clickCallback.call(self);
			} else {
				var key = $(this).hasClass('no-start') ? "noStart" : $(this).hasClass('completed') ? "completed" : "illegal";
				self.opts.disabledHandler(key);
			}
		}

		$(this.opts.body).find('.KinerLotteryContent').get(0).addEventListener('webkitTransitionEnd', function () {

			self.doing = false;

			var deg = $(self.opts.body).attr('data-deg');

			if (self.opts.direction == 0) {
				$(self.opts.body).attr('data-deg', 360 - deg);
				$(self.opts.body).find('.KinerLotteryContent').css({
					'-webkit-transition': 'none',
					'transition': 'none',
					'-webkit-transform': 'rotate(' + (deg) + 'deg)',
					'transform': 'rotate(' + (deg) + 'deg)'
				});
				self.opts.KinerLotteryHandler(360 - deg);
			} else {
				$(self.opts.body).attr('data-deg', deg);
				$(self.opts.body).find('.KinerLotteryContent').css({
					'-webkit-transition': 'none',
					'transition': 'none',
					'-webkit-transform': 'rotate(' + (-deg) + 'deg)',
					'transform': 'rotate(' + (-deg) + 'deg)'
				});
				self.opts.KinerLotteryHandler(deg);
			}



		});



	};


	KinerLottery.prototype.goKinerLottery = function (_deg) {

		if (this.doing) {
			return;
		}
		var deg = _deg + this.defNum;
		var realDeg = this.opts.direction == 0 ? deg : -deg;
		this.doing = true;
		$(this.opts.body).find('.KinerLotteryBtn').addClass('doing');

		$(this.opts.body).find('.KinerLotteryContent').css({
			'-webkit-transition': 'all 5s',
			'transition': 'all 5s',
			'-webkit-transform': 'rotate(' + (realDeg) + 'deg)',
			'transform': 'rotate(' + (realDeg) + 'deg)'
		});
		$(this.opts.body).attr('data-deg', _deg);

	};



	win.KinerLottery = KinerLottery;

})(window, document, $);
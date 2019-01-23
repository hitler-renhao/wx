$(function(){
	$("footer a").click(function() {
		$(this).find('p').addClass('active').parent().parent().siblings().find('p').removeClass('active');
	});
	$(".one").click(function(){
		$(this).find("img").attr("src","../images/footer1_checked.png");
		$(".two").find("img").attr("src","../images/footer2.png");
		$(".three").find("img").attr("src","../images/footer3.png");
		$(".four").find("img").attr("src","../images/footer4.png");
	})
	$(".two").click(function(){
		$(".one").find("img").attr("src","../images/footer1.png");
		$(this).find("img").attr("src","../images/footer2_checked.png");
		$(".three").find("img").attr("src","../images/footer3.png");
		$(".four").find("img").attr("src","../images/footer4.png");
	})
	$(".three").click(function(){
		$(".one").find("img").attr("src","../images/footer1.png");
		$(".two").find("img").attr("src","../images/footer2.png");
		$(this).find("img").attr("src","../images/footer3_checked.png");
		$(".four").find("img").attr("src","../images/footer4.png");
	})
	$(".four").click(function(){
		$(".one").find("img").attr("src","../images/footer1.png");
		$(".two").find("img").attr("src","../images/footer2.png");
		$(".three").find("img").attr("src","../images/footer3.png");
		$(this).find("img").attr("src","../images/footer4_checked.png");
	})




})
window.onload = function (e) {

	var sliderAry = getDataArray(); //Load Json的資料
	setTimeout(function () { //要延遲不然會有非同步問題
		setSlider();
	}, 100);




	function getDataArray() {
		var ary = [];
		//$.ajaxSetup({ async: false }); 改為同步
		$.getJSON("datas/data.json", function (data) {
			for (var i in data) {
				ary.push(i);
			}
		});
		return ary;
	}

	function setSlider() {
		$("#dateSlider").ionRangeSlider({
			type: "single", //double,single
			values: sliderAry,
			onFinish: function (data) {
				//alert(data)
			}
		});
	}
}
window.onload = function (e) {
	var ary = [];
	$.getJSON("datas/data.json", function (data) {
		for (var i in data) {
			ary.push(i);
		}
		setSlider(ary);

	});


	function setSlider(sliderAry) {
		$("#dateSlider").ionRangeSlider({
			type: "single", //double,single
			values: sliderAry,
			onFinish: function (data) {
				var yearMon = data["from_value"];
				$("#data_type")[0].innerHTML = "民國 " + yearMon + " 臺灣各縣市人口數量";
				_taiwan.exit().remove();
				setDatas(yearMon);
				setTimeout(function () {
					updateMsg(_features[_cDataIndex]);
				}, 100);


			}
		});
	}



}

function PopulationClick() {
	_statsIndex = 0;
	setTaiwan();
	resetColorBar();
}

function TotalIncreaseClick() {
	_statsIndex = 1;
	setTaiwan();
	resetColorBar();
}

function NaturalIncreaseClick() {
	_statsIndex = 2;
	setTaiwan();
	resetColorBar();
}

function SocialIncreaseClick() {
	_statsIndex = 3;
	setTaiwan();
	resetColorBar();
}

function resetColorBar(){
	



	var line = document.getElementsByTagName("stop");
	line[0].setAttribute("",)





}
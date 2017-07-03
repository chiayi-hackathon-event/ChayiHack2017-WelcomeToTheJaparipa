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
				resetData(data);
			}
		});
	}

	function resetData(d) {
		var yearMon = d["from_value"];
		$("#data_type")[0].innerHTML = "民國 " + yearMon + " 臺灣各縣市人口數量";
		_taiwan.exit().remove()
		setDatas(yearMon);


	}
}
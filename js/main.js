window.onload = function (e) {


	var iconEle = document.getElementsByClassName("iconsEle")[0];
	iconEle.addEventListener("mousemove", iconEleMouseoverEvent, true);
	iconEle.addEventListener("mouseout", iconEleMouseoverEvent, true);
	iconEle.addEventListener("click", iconEleMouseoverEvent, true);





	var ary = [];
	$.getJSON("datas/人口增加─按區域別分.json", function (data) {
		for (var i in data) {
			ary.push(i);
		}
		setSlider(ary);

	});


	function setSlider(sliderAry) {
		$("#dateSlider").ionRangeSlider({
			type: "single", //double,single
			values: sliderAry,
			// grid: true,
			onFinish: function (data) {
				sliderEvent(data);
			},
			onUpdate: function (data) {
				sliderEvent(data);
			}
		});
	}

	function sliderEvent(data) {
		var yearMon = data["from_value"];
		// $("#data_type")[0].innerHTML = "民國 " + yearMon + " 臺灣各縣市人口數量";
		_taiwan.exit().remove();
		setDatas(yearMon);
		setTimeout(function () {
			updateMsg(_features[_cDataIndex]);
		}, 100);
	}

}

function iconEleMouseoverEvent(e) {
	var t = e.type;
	var text = e.target.title;
	if (!text) //防呆
		return;
	var aEle = document.getElementsByClassName("hintHover")[0];
	if (t == "mousemove") {
		var a = document.getElementsByClassName("hintText")[0]; //設定文字
		aEle.style.opacity = 1; //顯示出來
		var h = aEle.offsetHeight;
		aEle.style.top = e.layerY - h / 2 + "px"; //置中 
		a.innerHTML = text;



	} else if (t == "click") {
		var selected = document.getElementsByClassName("hintSelected")[0];
		var a = document.getElementsByClassName("selectedText")[0]; //設定文字
		var ih = e.target.offsetHeight;
		var sh = selected.offsetHeight;
		var h = (ih - sh) / 2;

		a.innerHTML = text;
		selected.style.top = e.target.offsetTop + h + "px";

	}
	else if (t == "mouseout") {
		aEle.style.opacity = 0; //隱藏起來


	}
}

function setDataByIndex(e) {
	var v = parseInt(e.getAttribute("value"));
	_statsIndex = v;
	setTaiwan();
	resetColorBar();
}

function resetColorBar() {
	var colorRag = _model[_statsIndex]["colorRag"];

	var line = document.getElementsByTagName("stop");
	line[0].setAttribute("stop-color", colorRag[0]);
	line[1].setAttribute("stop-color", colorRag[1]);

}

function contolSliderEvent(e) {
	var v = e.getAttribute("value");
	var slider = $("#dateSlider").data("ionRangeSlider");
	var min = slider["result"]["min"];
	var max = slider["result"]["max"];
	var nValue = slider["result"]["from"];

	if (v == "add") {
		nValue += 1;
		if (nValue > max)
			nValue = 0;

		slider.update({
			from: nValue
		});
	} else if (v == "less") {
		nValue -= 1;
		if (nValue < min)
			nValue = max;

		slider.update({
			from: nValue
		});

	}
}
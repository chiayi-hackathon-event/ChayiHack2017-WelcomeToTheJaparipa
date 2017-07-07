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
			onUpdate: function (data) { //左右鍵
				sliderEvent(data);
			}
		});
	}

	function sliderEvent(data) {
		var yearMon = data["from_value"];
		var nowIndex = $(".selectedText")[0].getAttribute("value");
		var sData; //show Data
		var type;
		if (nowIndex == "0" || nowIndex == "1" || nowIndex == "2" || nowIndex == "3") {//人口增加─按區域別分.json
			type = 0;
			sData = _oData[yearMon];
		}
		else if (nowIndex == "4") { //各縣市別平均每戶可支配所得.json
			type = 1;
			sData = _inComeData[yearMon];
		}
		else if (nowIndex == "5") {  //各縣市別平均每戶儲蓄.json
			type = 2;
			sData = _depositsData[yearMon];
		}

		_taiwan.exit().remove();
		setDatas(sData, type);
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
		var v = e.target.getAttribute("value");

		a.innerHTML = text;
		a.setAttribute("value", v);
		selected.style.top = e.target.offsetTop + h + "px";


	}
	else if (t == "mouseout") {
		aEle.style.opacity = 0; //隱藏起來
	}
}

function setDataByIndex(e) {
	var v = parseInt(e.getAttribute("value"));
	_statsIndex = v;
	updateSliderList(v);


	setTaiwan();
	resetColorBar();
}

function updateSliderList(index) {
	var slider = $("#dateSlider").data("ionRangeSlider");
	var list = [];
	if (index < 4) {
		for (var i in _oData) {
			list.push(i);
		}
	}
	else if (index == 4) {
		for (var i in _inComeData) {
			list.push(i);
		}

	} else if (index = 5) {
		for (var i in _depositsData) {
			list.push(i);
		}
	}

	slider.update({
		values: list
	});

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
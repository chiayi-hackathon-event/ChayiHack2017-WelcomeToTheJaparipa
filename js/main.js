window.onload = function (e) {


	var iconEle = document.getElementsByClassName("iconsEle")[0];
	iconEle.addEventListener("mousemove", iconEleMouseoverEvent, true);
	iconEle.addEventListener("mouseout", iconEleMouseoverEvent, true);
	iconEle.addEventListener("click", iconEleMouseoverEvent, true);





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

function iconEleMouseoverEvent(e) {
	var t = e.type;
	var text = e.target.title;
	if (!text)
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

function PopulationClick(e) {
	_statsIndex = 0;
	setTaiwan();
	resetColorBar();
	// $("i").removeClass("selectedClass");
	// $(e).addClass("selectedClass");

}

function TotalIncreaseClick(e) {
	_statsIndex = 1;
	setTaiwan();
	resetColorBar();

}

function NaturalIncreaseClick(e) {
	_statsIndex = 2;
	setTaiwan();
	resetColorBar();

}

function SocialIncreaseClick(e) {
	_statsIndex = 3;
	setTaiwan();
	resetColorBar();

}

function resetColorBar() {
	var colorRag = _model[_statsIndex]["colorRag"];

	var line = document.getElementsByTagName("stop");
	line[0].setAttribute("stop-color", colorRag[0]);
	line[1].setAttribute("stop-color", colorRag[1]);

}
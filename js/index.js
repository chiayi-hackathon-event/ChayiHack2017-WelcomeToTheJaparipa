var _oData; //原始的資料
var _nData; //現在的資料
var _cDataIndex; //選到的資料
var _features; //餵給D3.js(臺灣地圖)的資料格式
var _taiwan;  //臺灣的元件
var _statsIndex = 0;

var _model = [
	{
		"id": "人口數(人)",
		"colorRag": ["#00FF00", "#FF0000"],
		"range": [0, 3500000]
	},
	{
		"id": "總增加率",
		"colorRag": ["#B9EDF8", "#0000A1"],
		"range": [0, 600]
	},
	{
		"id": "自然增加率",
		"colorRag": ["#F40076", "#35CE8D"],
		"range": [0, 20]
	},
	{
		"id": "社會增加率",
		"colorRag": ["#00303F", "#FF5A09"],
		"range": [0, 20]
	}
    ,
	{
		"id": "所得收入總計",
		"colorRag": ["#F40076", "#35CE8D"],
		"range": [0, 1500000]
	},
	{
		"id": "每戶儲蓄",
		"colorRag": ["#00303F", "#FF5A09"],
		"range": [0, 1000000]
	}
]




$(document).ready(function () { //初始化
	setPopulationData(); //設定人口變動資料
	setMarker();
});

function setMarker() {
	var img = document.createElement("img");
	img.setAttribute("class", "marker");
	img.setAttribute("src", "img/marker.png");
	img.setAttribute("width", "35");
	img.setAttribute("height", "56");
	$("body").append(img);
}

function setPopulationData() {
	$.getJSON("datas/人口增加─按區域別分.json", function (data) { //載入資料
		_oData = data;
		setCountyData(); //設定縣市資料
	});
}

function setCountyData() {
	d3.json("datas/county.json", function (topodata) { //因為原始資料檔案太大load太久，會導致後面的程式碼先執行，所以要包在裡面
		_features = topojson.feature(topodata, topodata.objects.county).features;
		setDatas();
	})
}

function setDatas(yearMon) {
	if (!yearMon)
		yearMon = getFirstValueFromObject();

	_nData = _oData[yearMon];
	for (i = 0; i < _features.length; i++) {
		_features[i]["properties"]["人口數(人)"] = [];
		_features[i]["properties"]["總增加率"] = [];
		_features[i]["properties"]["自然增加率"] = [];
		_features[i]["properties"]["社會增加率"] = [];
		for (j = 1; j < _nData.length; j++) {
			if (normlizion_city_name(_features[i]["properties"]["C_Name"]) == normlizion_city_name(_nData[j]["地區"])) {
				_features[i]["properties"]["人口數(人)"] = _nData[j]["人口數(人)"];
				_features[i]["properties"]["總增加率"] = _nData[j]["總增加率"];
				_features[i]["properties"]["自然增加率"] = _nData[j]["自然增加率"];
				_features[i]["properties"]["社會增加率"] = _nData[j]["社會增加率"];

			}
		}
	}
	setTaiwan();
}

function getFirstValueFromObject() {
	var firstValue;
	$.each(_oData, function (key, value) {
		firstValue = key;
		return false; //等於break
	});
	return firstValue;
}


function setTaiwan() {

	var colorRag = _model[_statsIndex]["colorRag"];
	var range = _model[_statsIndex]["range"];


	var prj = function (v) {
		var ret = d3.geo.mercator().center([122, 23.25]).scale(5200)(v);
		return [ret[0], ret[1]];
	};
	var path = d3.geo.path().projection(prj);
	var color = d3.scale.linear().domain(range).range(colorRag);
	_taiwan = d3.select("svg").selectAll("path").data(_features);
	_taiwan.enter().append("path").attr({
		"d": path,
		"fill": function (d) {
			return judgmentData(d);
		}
	});

	function judgmentData(d) {
		var key = _model[_statsIndex]["id"];
		if (_statsIndex == 0)
			return color(parseInt(eval(d["properties"][key])));
		else if (_statsIndex == 1)
			return color(parseFloat(eval(d["properties"][key]) + 3.00) * 100);
		else if (_statsIndex == 2)
			return color(parseFloat(eval(d["properties"][key]) + 1) * 10);
		else if (_statsIndex == 3)
			return color(parseFloat(eval(d["properties"][key]) + 1) * 10);
	}


	function update() {
		d3.select("svg").selectAll("path").attr({
			"d": path,
			"fill": function (d) {
				return judgmentData(d);
			},
			"stroke": 'green'
		}).on("mouseover", function (d, evnt) {

			$(this).attr('fill', 'White');

		}).on("mouseleave", function (d) {

			$(this).attr('fill', judgmentData(d));

			//$("#info").hide();
		}).on("click", function (d) {
			var img = $(".marker")[0];

			$(img).css({
				"transition": "0s",
				"opacity": "0",
				"top": "0px",
				"display":"block",
				"left": (event.x - img.width / 2) + "px"
			});


			$(img).css({
				"transition": ".5s",
				"opacity": "1",
				"top": (event.y - img.height) + "px",
				"left": (event.x - img.width / 2) + "px"
			});

			$(this).attr('fill', 'White');
			updateMsg(d);
		});
	}
	update();
}

function updateMsg(d) {
	var msg = "";
	if (!d) //甚麼都沒點 防呆
		return;

	$("#info").show();
	$("#name").text(d.properties.C_Name);
	msg += "日期：" + $("#dateSlider").data("ionRangeSlider").result.from_value + "<br/>";
	msg += "總共：" + checkValue(eval(d["properties"]["人口數(人)"]) + "人<br/>");
	msg += "總增加率：" + checkValue(eval(d["properties"]["總增加率"]) + "%<br/>");
	msg += "自然增加率：" + checkValue(eval(d["properties"]["自然增加率"]) + "%<br/>");
	msg += "社會增加率：" + checkValue(eval(d["properties"]["社會增加率"]) + "%<br/>");
	_cDataIndex = d["properties"]["OBJECTID"] - 1;
	$("#case").html(msg);
}

function checkValue(v) {
	if (v.includes("undefined"))
		return " 資料有誤 <br/>";
	else
		return v;
}

function normlizion_city_name(city_name) {
	city_name = city_name.replace("臺", "台");
	if (city_name == "台北縣") return "新北市";
	if (city_name == "台中縣") return "台中市";
	if (city_name == "台中") return "台中市";
	if (city_name == "基隆") return "基隆市";
	return city_name;
}


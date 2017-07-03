var _oData = [];
var _features;
var _taiwan;

function normlizion_city_name(city_name) {
	city_name = city_name.replace("臺", "台");
	if (city_name == "台北縣") return "新北市";
	if (city_name == "台中縣") return "台中市";
	if (city_name == "台中") return "台中市";
	if (city_name == "基隆") return "基隆市";
	return city_name;
}
function formatFloat(num, pos) {
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
}

function setDatas(yearMon) {
	d3.json("datas/county.json", function (topodata) { //因為原始資料檔案太大load太久，會導致後面的程式碼先執行，所以要包在裡面
		_features = topojson.feature(topodata, topodata.objects.county).features;

		if (!yearMon)
			yearMon = "86年 1月";

		var firstData = _oData[yearMon];
		for (i = 0; i < _features.length; i++) {
			_features[i]["properties"]["人口數(人)"] = [];
			_features[i]["properties"]["總增加率"] = [];
			_features[i]["properties"]["自然增加率"] = [];
			_features[i]["properties"]["社會增加率"] = [];
			for (j = 1; j < firstData.length; j++) {
				if (normlizion_city_name(_features[i]["properties"]["C_Name"]) == normlizion_city_name(firstData[j]["地區"])) {
					_features[i]["properties"]["人口數(人)"] = firstData[j]["人口數(人)"];
					_features[i]["properties"]["總增加率"] = firstData[j]["總增加率"];
					_features[i]["properties"]["自然增加率"] = firstData[j]["自然增加率"];
					_features[i]["properties"]["社會增加率"] = firstData[j]["社會增加率"];

				}
			}
		}
		//setfeatures("86年 1月"); //設定第一年的資料

		var prj = function (v) {
			var ret = d3.geo.mercator().center([122, 23.25]).scale(4000)(v);
			return [ret[0], ret[1]];
		};
		var path = d3.geo.path().projection(prj);
		var color = d3.scale.linear().domain([0, 10000]).range(["#090", "#f00"]);
		_taiwan = d3.select("svg").selectAll("path").data(_features);
		_taiwan.enter().append("path").attr({
			"d": path,
			"fill": function (d) {
				return color(parseInt(eval(d["properties"]["人口數(人)"])) / 300);
			}
		});



		function update() {
			d3.select("svg").selectAll("path").attr({
				"d": path,
				"fill": function (d) {
					return color(parseInt(eval(d["properties"]["人口數(人)"])) / 300);
				},
				"stroke": 'green'
			}).on("mouseover", function (d, evnt) {


				$(this).attr('fill', 'White');

			}).on("mouseleave", function (d) {

				$(this).attr('fill', color(parseInt(eval(d["properties"]["人口數(人)"])) / 300));//

				//$("#info").hide();
			}).on("click", function (d) {
				var msg = "";
				$("#info").show();
				$("#name").text(d.properties.C_Name);
				msg += "總共：" + eval(d["properties"]["人口數(人)"]) + "人<br/>";
				msg += "總增加率：" + eval(d["properties"]["總增加率"]) + "%<br/>";
				msg += "自然增加率：" + eval(d["properties"]["自然增加率"]) + "%<br/>";
				msg += "社會增加率：" + eval(d["properties"]["社會增加率"]) + "%<br/>";

				$("#case").html(msg);

			});
		}
		update();
	});

}

$(document).ready(function () {
	// var accident_data = $.getJSON("final.json");


	$.getJSON("datas/data.json", function (data) { //載入資料
		_oData = data; //容量太大會有時間差的問題
		setDatas();
		//var firstData = data["86年 1月"];



	});
});


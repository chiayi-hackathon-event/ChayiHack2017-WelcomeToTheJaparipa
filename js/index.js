var data_types_arr = ["人口數(人)", "總增加率", "自然增加率", "社會增加率"];
var data_types = "人口數(人)";
var data_types_id = 0;
var data_years = 103;

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
$(document).ready(function () {
	// var accident_data = $.getJSON("final.json");
	var population_data = [];


	$.getJSON("datas/data.json", function (data) { //載入資料
		population_data = data["86年 1月"]; //容量太大會有時間差的問題

		d3.json("datas/county.json", function (topodata) { //因為原始資料檔案太大load太久，會導致後面的程式碼先執行，所以要包在裡面
			var features = topojson.feature(topodata, topodata.objects.county).features;
			var prj = function (v) {
				var ret = d3.geo.mercator().center([122, 23.25]).scale(4000)(v);
				return [ret[0], ret[1]];
			};

			for (i = 0; i < features.length; i++) {
				features[i]["properties"]["人口數(人)"] = [];
				features[i]["properties"]["總增加率"] = [];
				features[i]["properties"]["自然增加率"] = [];
				features[i]["properties"]["社會增加率"] = [];
				for (j = 1; j < population_data.length; j++) {
					if (normlizion_city_name(features[i]["properties"]["C_Name"]) == normlizion_city_name(population_data[j]["地區"])) {
						features[i]["properties"]["人口數(人)"] = population_data[j]["人口數(人)"];
						features[i]["properties"]["總增加率"] = population_data[j]["總增加率"];
						features[i]["properties"]["自然增加率"] = population_data[j]["自然增加率"];
						features[i]["properties"]["社會增加率"] = population_data[j]["社會增加率"];

					}
				}
			}


			var path = d3.geo.path().projection(prj);
			var color = d3.scale.linear().domain([0, 10000]).range(["#090", "#f00"]);
			d3.select("svg").selectAll("path").data(features).enter().append("path").attr({
				"d": path,
				"fill": function (d) {
					return color(parseInt(eval(d["properties"]["人口數(人)"])) / 600);
				}
			}
			);


			function update() {
				d3.select("svg").selectAll("path").attr({
					"d": path,
					"fill": function (d) {
						return color(parseInt(eval(d["properties"]["人口數(人)"])) / 300);
					},
					"stroke": 'green'
				}).on("mouseover", function (d, evnt) {
					var myX = evnt.clientX;
					var myY = evnt.clientY;
					var msg = "";

					$(this).attr('fill', 'White');
					$("#info").show().css('top', myX - 10).css('left', myY + 25);
					$("#name").text(d.properties.C_Name);
					msg += "總共：" + eval(d["properties"]["人口數(人)"]) + "人<br/>";
					msg += "總增加率：" + eval(d["properties"]["總增加率"]) + "%<br/>";
					msg += "自然增加率：" + eval(d["properties"]["自然增加率"]) + "%<br/>";
					msg += "社會增加率：" + eval(d["properties"]["社會增加率"]) + "%<br/>";

					/* "地區": "新北市",
					  "人口數(人)": "3358415",
					  "總增加率": "0.93",
					  "自然增加率": "0.86",
					  "社會增加率": "0.07"*/
					$("#case").html(msg);




				}).on("mouseleave", function (d) {

					$(this).attr('fill', color(parseInt(eval(d["properties"]["人口數(人)"])) / 600));

					//$("#info").hide();
				});
			}


			update();

		});

	});







});


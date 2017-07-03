var _oData;
var _nData;
var _cDataIndex; //選到的資料
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
  d3.json("datas/county.json", function(topodata) { //因為原始資料檔案太大load太久，會導致後面的程式碼先執行，所以要包在裡面
    _features = topojson.feature(topodata, topodata.objects.county).features;

    if (!yearMon)
      yearMon = "86年 1月";

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
    //setfeatures("86年 1月"); //設定第一年的資料

    var prj = function(v) {
      var ret = d3.geo.mercator().center([122, 23.25]).scale(4000)(v);
      return [ret[0], ret[1]];
    };
    var path = d3.geo.path().projection(prj);
    //var color_population = d3.scale.linear().domain([0, 10000]).range(["#00FF00", "#FF0000"]);//人口顏色間距
    var color_allrate = d3.scale.linear().domain([0, 600]).range(["#B9EDF8", "#0000A1"]); //總增加率間距
    //var color_natural = d3.scale.linear().domain([0, 20]).range(["#F40076", "#35CE8D"]);//自然增加率間距
    //var color_social = d3.scale.linear().domain([0, 20]).range(["#00303F", "#FF5A09"]);//社會增加率間距

    _taiwan = d3.select("svg").selectAll("path").data(_features);
    _taiwan.enter().append("path").attr({
      "d": path,
      "fill": function(d) {
        //return color_population(parseInt(eval(d["properties"]["人口數(人)"])) / 300);
        return color_allrate(parseFloat(eval(d["properties"]["總增加率"]) + 3.00) * 100);
        //return color_natural(parseFloat(eval(d["properties"]["自然增加率"])+1) *10);
        //return color_social(parseFloat(eval(d["properties"]["社會增加率"])+1) *10);

      }
    });



    function update() {
      d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function(d) {
          //return color_population(parseInt(eval(d["properties"]["人口數(人)"])) / 300);
          return color_allrate(parseFloat(eval(d["properties"]["總增加率"]) + 3) * 100);
          //return color_natural(parseFloat(eval(d["properties"]["自然增加率"])+1) *10);
          //return color_social(parseFloat(eval(d["properties"]["社會增加率"])+1) *10);

        },
        "stroke": 'green'
      }).on("mouseover", function(d, evnt) {


        $(this).attr('fill', 'White');

      }).on("mouseleave", function(d) {

        //$(this).attr('fill', color_population(parseInt(eval(d["properties"]["人口數(人)"])) / 300));
        $(this).attr('fill', color_allrate(parseFloat(eval(d["properties"]["總增加率"]) + 3) * 100));
        //$(this).attr('fill', color_natural(parseFloat(eval(d["properties"]["自然增加率"])+1) *10));
        //$(this).attr('fill', color_social(parseFloat(eval(d["properties"]["社會增加率"])+1) *10));


        //$("#info").hide();
      }).on("click", function(d) {
        updateMsg(d)
        // var msg = "";
        // $("#info").show();
        // $("#name").text(d.properties.C_Name);
        // msg += "總共：" + eval(d["properties"]["人口數(人)"]) + "人<br/>";
        // msg += "總增加率：" + eval(d["properties"]["總增加率"]) + "%<br/>";
        // msg += "自然增加率：" + eval(d["properties"]["自然增加率"]) + "%<br/>";
        // msg += "社會增加率：" + eval(d["properties"]["社會增加率"]) + "%<br/>";

        // $("#case").html(msg);

      });
    }
    update();
  });

}

function updateMsg(d) {
  var msg = "";
  $("#info").show();
  $("#name").text(d.properties.C_Name);
  if ((d["properties"]["人口數(人)"]) == "")
    msg += "總人口：資料有誤" + "<br/>";
  else
    msg += "總人口：" + eval(d["properties"]["人口數(人)"]) + "人<br/>";
  if ((d["properties"]["總增加率"]) == "")
    msg += "總增加率：資料有誤" + "<br/>";
  else
    msg += "總增加率：" + eval(d["properties"]["總增加率"]) + "%<br/>";
  if ((d["properties"]["自然增加率"]) == "")
    msg += "自然增加率：資料有誤" + "<br/>";
  else
    msg += "自然增加率：" + eval(d["properties"]["自然增加率"]) + "%<br/>";
  if (d["properties"]["社會增加率"] == "")
    msg += "社會增加率：資料有誤" + "<br/>";
  else
    msg += "社會增加率：" + eval(d["properties"]["社會增加率"]) + "%<br/>";
  _cDataIndex = d["properties"]["OBJECTID"] - 1;
  $("#case").html(msg);
}

$(document).ready(function() {
  $.getJSON("datas/data.json", function(data) { //載入資料
    _oData = data; //容量太大會有時間差的問題
    setDatas();
  });
});

var _oData; //原始的資料
var _nData; //現在的資料
var _cDataIndex; //選到的資料
var _features; //餵給D3.js(臺灣地圖)的資料格式
var _taiwan;  //臺灣的元件
var _statsIndex = 0;
var _inComeData;
var _depositsData;

var _model = [
    {
        "id": "人口數(人)",
        "colorRag": ["#00FF00", "#FF0000"],
        "range": [0, 3500000],
        "type": "int"
    },
    {
        "id": "總增加率",
        "colorRag": ["#B9EDF8", "#0000A1"],
        "range": [-3, 3],
        "type": "double"
    },
    {
        "id": "自然增加率",
        "colorRag": ["#F40076", "#35CE8D"],
        "range": [-1, 1],
        "type": "double"
    },
    {
        "id": "社會增加率",
        "colorRag": ["#00303F", "#FF5A09"],
        "range": [-2, 2],
        "type": "double"
    }
    ,
    {
        "id": "可支配所得",
        "colorRag": ["#b4b545", "#b54545"],
        "range": [500000, 1000000],
        "type": "int"
    },
    {
        "id": "每戶儲蓄",
        "colorRag": ["#FFB85F", "#3E78B2"],
        "range": [70000, 150000],
        "type": "int"
    }
]




$(document).ready(function () { //初始化
    setPopulationData(); //設定人口變動資料
    setIncomeData();
    setDepositsData();
    setMarker();
    deviceSetting();
});



function setPopulationData() {
    $.getJSON("datas/人口增加─按區域別分.json", function (data) { //載入資料
        _oData = data;
        setCountyData(); //設定縣市資料
    });
}

function setIncomeData() {
    $.getJSON("datas/各縣市別平均每戶可支配所得.json", function (data) { //載入資料
        _inComeData = data;
    });
}

function setDepositsData() {
    $.getJSON("datas/各縣市別平均每戶儲蓄.json", function (data) { //載入資料
        _depositsData = data;
    });
}

function setMarker() {
    // var img = document.createElement("img");
    // img.setAttribute("class", "marker");
    // img.setAttribute("src", "img/marker.png");
    // img.setAttribute("width", "35");
    // img.setAttribute("height", "56");
    // $("body").append(img);
}

function setCountyData() {
    d3.json("datas/county.json", function (topodata) { //因為原始資料檔案太大load太久，會導致後面的程式碼先執行，所以要包在裡面
        _features = topojson.feature(topodata, topodata.objects.county).features;
        setDatas(null, 0);
    })
}

function deviceSetting() { //手機要有不同的設定
    //是手機才要調整;
    if (!isPhone())
        return;

    var map = document.getElementById("map");
    map.setAttribute("height", "200%");
    map.setAttribute("width", "200%");

    var mapEle = document.getElementsByClassName("mapEle")[0];
    mapEle.scrollLeft = 150;
    mapEle.scrollTop = 245;


}

function isPhone() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    else
        return false;
}

function setDatas(sData, type) {
    if (!sData)
        sData = getFirstValueFromObject();

    _nData = sData;
    for (i = 0; i < _features.length; i++) {
        _features[i]["properties"]["人口數(人)"] = [];
        _features[i]["properties"]["總增加率"] = [];
        _features[i]["properties"]["自然增加率"] = [];
        _features[i]["properties"]["社會增加率"] = [];
        _features[i]["properties"]["可支配所得"] = [];
        _features[i]["properties"]["每戶儲蓄"] = [];
        for (j = 1; j < sData.length; j++) {
            if (normlizion_city_name(_features[i]["properties"]["C_Name"]) == normlizion_city_name(sData[j]["地區"])) {
                if (type == 0) {
                    _features[i]["properties"]["人口數(人)"] = sData[j]["人口數(人)"];
                    _features[i]["properties"]["總增加率"] = sData[j]["總增加率"];
                    _features[i]["properties"]["自然增加率"] = sData[j]["自然增加率"];
                    _features[i]["properties"]["社會增加率"] = sData[j]["社會增加率"];
                } else if (type == 1) {
                    _features[i]["properties"]["可支配所得"] = sData[j]["可支配所得"];
                } else if (type == 2) {
                    _features[i]["properties"]["每戶儲蓄"] = sData[j]["每戶儲蓄"];
                }
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
    return _oData[firstValue];
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
        var type = _model[_statsIndex]["type"];
        if (type == "int")
            return color(parseInt(eval(d["properties"][key])));
        else if (type == "double")
            return color(parseFloat(eval(d["properties"][key])));
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
                "display": "block",
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
    var key = "";
    if (_statsIndex == 0)
        key = "人口數(人)";
    else if (_statsIndex == 1)
        key = "總增加率";
    else if (_statsIndex == 2)
        key = "自然增加率";
    else if (_statsIndex == 3)
        key = "社會增加率";
    else if (_statsIndex == 4)
        key = "可支配所得";
    else if (_statsIndex == 5)
        key = "每戶儲蓄";
    msg += "日期：" + $("#dateSlider").data("ionRangeSlider").result.from_value + "<br/>";

    var value = checkValue(eval(d["properties"][key]));
    msg += key + "：" + value;
    if (value.includes("尚無資料"))
        msg += "<br/>";
    else if (_statsIndex == 0)
        msg + "人<br/>";
    else if (_statsIndex == 1 || _statsIndex == 2 || _statsIndex == 3)
        msg += "%<br/>";
    else if (_statsIndex == 4 || _statsIndex == 5)
        msg += "元<br/>";

    _cDataIndex = d["properties"]["OBJECTID"] - 1;
    $("#case").html(msg);
}

function checkValue(v) {
    if (!v || v.length == 0)
        return " 尚無資料 ";
    else
        return v + "";
}

function normlizion_city_name(city_name) {
    city_name = city_name.replace("臺", "台");
    if (city_name == "台北縣") return "新北市";
    if (city_name == "台中縣") return "台中市";
    if (city_name == "台中") return "台中市";
    if (city_name == "基隆") return "基隆市";
    return city_name;
}


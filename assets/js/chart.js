 
 
var chartType = "Weights";
var table;
var pot;
 
var url = window.location;
// Will only work if string in href matches with location
 
function setTable(currTable,currPot){
    table = currTable;
    pot = currPot;
    drawDataChart();
}
function setChartType(type)
{
    if(type == "Weights")
    {
    $(wts).addClass('active');
    $(accWu).removeClass('active');
    $(hrWU).removeClass('active');
        $(met).removeClass('active');
    }
    else if(type == "WaterUse")
    {
    $(wts).removeClass('active');
    $(hrWU).removeClass('active');
    $(accWu).addClass('active');
        $(met).removeClass('active');
    }
    else if(type == "HourlyWaterUse")
    {
    $(wts).removeClass('active');
    $(accWu).removeClass('active');
    $(hrWU).addClass('active');
        $(met).removeClass('active');
    }
    else if(type == "MetData")
    {
    $(wts).removeClass('active');
    $(accWu).removeClass('active');
    $(hrWU).removeClass('active');
        $(met).addClass('active');
    }
    chartType = type;
    if(type == "MetData")
    {
       drawMetChart();
    }
    else
    {
   drawDataChart();
    }
}
function drawCharts(table, pot) {
    drawDataChart(table, pot);
//    drawSummaryChart(site);
 
}
function maxValue(potWts)
{
    var maxWt = 0;
 
    for(var i=0;i < potWts.length;i++){
    if(potWts[i][1] > maxWt)
    maxWt = potWts[i][1];
    }
    return maxWt;
}
 
function drawMetChart() {
    Highcharts.setOptions({global: {useUTC: false}, xAxis: { type: 'datetime'}});
    var seriesOptions = [];
    $.getJSON('jsonp.php?table=0&chartType=' + chartType + '&callback=?', function(data) {
    // load the data    
	var metData = new Array();
    for(var i=0;i<6;i++)
		metData[i] = new Array();
    for (var i = 0; i < data.length; i++) {
		for (var dta=0;dta<6;dta++)
			metData[dta][i] = new Array(data[i][0], data[i][dta+1]);
    }
 
    var lastStr = Highcharts.dateFormat(' %A  %b %e, %H:%M', data[data.length-1][0]);
    var titleStr = 'Met Data';
   
        //for(var i=0;i<3;i++){
        //        seriesOptions.push({name : 'Pot ' + (i+1),data : metData[i]});
		//}
   
       // Create the chart
       window.chart = new Highcharts.StockChart({
            chart : {
                renderTo : 'dataChart'
            },
			tooltip: {      
				useHTML: true,
				formatter: function() {         
					var s =  '<b>' + Highcharts.dateFormat('%b %e, %H:%M', this.x) + '</b><br />';
					$.each(this.points, function(i, point) {
						s += '<span style = "color:'+point.series.color+';">'+point.series.name +' </span><b>'
							+ ' : ' + point.y.toFixed(2) +  '</b><br />';
					});
					return s;
				},
			valueDecimals: 0,
			shared: true
			},
            rangeSelector : {
				selected : 1,
				buttons: [
					{type: 'day', count: 1, text: '1day'},
					{type: 'week', count: 1, text: '1wk'},
					{type: 'month', count: 1, text: '1m'},
					{type: 'month', count: 3, text: '3m'},
					{type: 'month', count: 6, text: '6m'},
					{type: 'all', text: 'All'}]
            },
            title : {text : titleStr},
			subtitle: {text: lastStr},       
                       
			yAxis: [{ // Primary yAxis
				labels: {
					format: '{value}',
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				title: {
					text: 'Temperature Humidity',
					style: {
						color: Highcharts.getOptions().colors[2]
					}
				}
			}, { // Secondary yAxis
				title: {
					text: 'Radiation',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				labels: {
				format: '{value}',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				opposite: true
			}],        
			xAxis: { type: 'datetime'},
			series: [{
				name: 'ExternalRadiation',
				yAxis: 1,
				data: metData[5],
				tooltip: {
					valueSuffix: ' mm'
                }
			}, { 
				name: 'Radiation',
				yAxis: 1,
				data: metData[2],
				tooltip: {
					valueSuffix: ' mm'
					}
            }, {
				name: 'Temperature',
				data: metData[1],
				tooltip: {
					valueSuffix: '°C'
                }
            }, {
				name: 'Humidity',
				data: metData[0],
				tooltip: {
					valueSuffix: '°C'
                }
            }],  
        });
    });
}
 
function drawDataChart() {
    Highcharts.setOptions({global: {useUTC: false}, xAxis: { type: 'datetime'}});
    var seriesOptions = [];
    $.getJSON('jsonp.php?table=' + table + '&chartType=' + chartType + '&callback=?', function(data) {
    // load the data
        var weights = new Array();
    for(var i=0;i<8;i++)
    weights[i] = new Array();
    for (var i = 0; i < data.length; i++) {
    for (var potNo=0;potNo<8;potNo++)
        weights[potNo][i] = new Array(data[i][0], data[i][potNo+1]);
    }
 
    var lastStr = Highcharts.dateFormat(' %A  %b %e, %H:%M', data[data.length-1][0]);
    var titleStr = 'Table ' + table;
   
    var minValue;
               
    if(chartType == "Weights"){
    minValue = 20000;
                }
    else if(chartType == "WaterUse"){
    minValue = 20;
                }
                else{
                minValue = 0;
                }
                   
    if(pot == 0){   // whole table
    for(var i=0;i<8;i++){
        if(maxValue(weights[i]) > minValue){
        seriesOptions.push({name : 'Pot ' + (i+1),data : weights[i]});
        }
    }
    }
    else{    // single pot
    seriesOptions [0] = {name : 'Pot ' + pot,data : weights[pot-1]};
    titleStr += ' Pot ' + pot;
    }
       
            // Create the chart
        window.chart = new Highcharts.StockChart({
            chart : {
                renderTo : 'dataChart'
            },
        tooltip: {      
        useHTML: true,
        formatter: function() {         
        var s =  '<b>' + Highcharts.dateFormat('%b %e, %H:%M', this.x) + '</b><br />';
        $.each(this.points, function(i, point) {
                            s += '<span style = "color:'+point.series.color+';">'+point.series.name +' </span><b>'
            + ' : ' + point.y.toFixed(0) +  '</b><br />';
                       });
        return s;
        },
        valueDecimals: 0,
        shared: true
        },
            rangeSelector : {
        selected : 1,
        buttons: [
        {type: 'day', count: 1, text: '1day'},
        {type: 'week', count: 1, text: '1wk'},
        {type: 'month', count: 1, text: '1m'},
        {type: 'month', count: 3, text: '3m'},
        {type: 'month', count: 6, text: '6m'},
        {type: 'all', text: 'All'}]
            },
            title : {text : titleStr},
        subtitle: {text: lastStr},       
            yAxis: { opposite: true} ,
            xAxis: { type: 'datetime'},
// [{max: 62000, opposite: true}] ,
            series : seriesOptions
        });
    });
}
//------------------------------------------------------------------------------
$(function() {
    $("#selectTree").jstree({
        "plugins" : ["themes", "html_data", "ui", "crrm", "hotkeys", "search"],
        "select_limit" : 1,
        "core" : {
        }
    })
 
    // EVENTS
    .bind("loaded.jstree", function(event, data) {
        addTables();
    }).bind("select_node.jstree", function(event, data) {
        // `data.rslt.obj` is the jquery extended node that was clicked
        var id = data.rslt.obj.attr("id");
        var table = data.rslt.obj.attr("table");
        var pot = data.rslt.obj.attr("pot");
        $("#chartTitle").text(id);
        var fileName = "Images/Table";
       
       
        //    var fileName = "Images/Table" + table + ".png";
        //$("#chart").attr("src", fileName);
    setTable(table, pot);
 
    });
});
//------------------------------------------------------------------------------
 
function nextTable() {
    // select the next table
   
    var selectedId = $('#selectTree').jstree('get_selected').attr('id');
    var table = parseInt($('#selectTree').jstree('get_selected').attr('table')) + 1;
    $('#selectTree').jstree('deselect_node').attr(selectedId);
 
    if (table > 16)
        table = 1;
    $("#selectTree").jstree("select_node", "#T" + table);
}
 
//------------------------------------------------------------------------------
 
function addTables() {
    //    add the tables and pots to the tree
 
    for (var tableNo = 1; tableNo < 17; tableNo++) {
        // add table
        var tableNode = "T" + tableNo;
        var dataLabel = "Table " + tableNo;
       
        $("#selectTree").jstree("create", "#LPAD", "last", {
            attr : {
                id : tableNode,
                table : tableNo,
                pot : 0
            },
            data : dataLabel
        }, false, true);
        // now pots
 
        for (var potNo = 1; potNo < 9; potNo++) {
            var potNode = tableNode + "P" + potNo;
            $("#selectTree").jstree("create", "#" + tableNode, "last", {
                attr : {
                id : potNode,
                table : tableNo,
                pot : potNo
                },
                data : "Pot " + potNo
            }, false, true);
        }
        $("#selectTree").jstree("close_node", "#" + tableNode);
    }
    $("#selectTree").jstree("select_node", "#T1");
 
}
 
 
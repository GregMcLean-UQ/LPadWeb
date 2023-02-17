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
		
		
		//	var fileName = "Images/Table" + table + ".png";
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
	//	add the tables and pots to the tree

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


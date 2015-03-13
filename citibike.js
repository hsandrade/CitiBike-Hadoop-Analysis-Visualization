/*
	This function initializes the trip_data data structure and first sets
	the google map.
*/
function processData(map, markers, map_lines, trip_data, allText) {
	var allTextLines = allText.split(/\r\n|\n/);
	var lines = [];

	var prev_date = '';

	for (var i=0; i<allTextLines.length-1; i++) {
		
    	var data = allTextLines[i].split(',');
		var trip_date = data[0];
		var trip_info = data[1].trim().split('_');
	
		var start_id = trip_info[0];
		var end_id = trip_info[1];
		var s_lat = trip_info[2];
		var s_lon = trip_info[3];
		var e_lat = trip_info[4];
		var e_lon = trip_info[5];
		var t_range = trip_info[6];
		
		info = {};
		info['start_id'] = start_id;
		info['end_id'] = end_id;
		info['s_lat'] = s_lat;
		info['s_lon'] = s_lon;
		info['e_lat'] = e_lat;
		info['e_lon'] = e_lon;
		info['t_range'] = t_range;

		if(trip_date != prev_date){
			trip_data[trip_date] = new Array();
			trip_data[trip_date].push(info);
			prev_date = trip_date;
		} else {
			trip_data[trip_date].push(info);
		}
	}
	var start_date = document.getElementById('datePicker').value;
	updateDisplay(map, markers, map_lines, trip_data[start_date]);
}

/*
	This function updates the map markers and lines each time the date
	is updated.
*/
function updateDisplay(map, markers, lines, data){

	for (var i=0; i<markers.length; i++){
		markers[i].setMap(null);
	}	

	for (var i=0; i<lines.length; i++){
		lines[i].setMap(null);
	}

	var text_info = "";

	for (var i=0; i<data.length; i++){
		var s_id = data[i]['start_id'];
		var s_lat = data[i]['s_lat'];
		var s_lon =  data[i]['s_lon'];

		var e_id = data[i]['end_id'];
            	var e_lat = data[i]['e_lat'];
            	var e_lon =  data[i]['e_lon'];

		var new_trip = "<br>" + String(i+1) +". " + String(s_id) + "  -->  " + String(e_id) + "      " + data[i]['t_range'];
		text_info = text_info + new_trip;

		var s_coord = new google.maps.LatLng (s_lat, s_lon);
		var e_coord = new google.maps.LatLng (e_lat, e_lon);

		var s_marker = new google.maps.Marker({position: s_coord, title:s_id, map:map, icon:'blue_marker.png' });
		var e_marker = new google.maps.Marker({position: e_coord, title:e_id, map:map, icon:'blue_marker.png' });

		markers.push(s_marker);
		markers.push(e_marker);

		var line = new google.maps.Polyline({path:[s_coord, e_coord],geodesic:true,strokeOpacity: 1.0,strokeWeight: 2, map:map});
		lines.push(line);
	}
	
	document.getElementById("date_text").innerHTML = document.getElementById("datePicker").value;	
	document.getElementById("date_info").innerHTML = text_info;
}

/*
	This function retrieves the data, initializes the Google map, 
	and sets the event handlers.
*/
function initialize() {

	var mapOptions = {
		zoom: 13,
        center: new google.maps.LatLng(40.735, -73.98)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Object holding all of April trip data
	var trip_data = {};

	// Array holding all of the markers for the map
	var markers = [];

	// Array holding all of the Polylines for the map
	var lines = [];

	$.ajax({
    	type: "GET",
    	url: "citibike_data.csv",
    	dataType: "text",
    	success: function(data) {
			processData(map, markers, lines, trip_data, data);
		}
 	});
	
	var updateButton = document.getElementById("update");

	updateButton.onclick = function(){
		var new_date = document.getElementById("datePicker").value;
		updateDisplay(map, markers, lines, trip_data[new_date]);
	}; 
}

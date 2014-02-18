'use strict';

var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

h = h-73;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	GoogleMap();
	google.maps.event.addDomListener(window, 'load', initialize);

})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#searchBtn").click(updateResult);
	$('#map_canvas').css('width', w);
	$('#map_canvas').css('height', h);
}

function updateResult(e) {
	// Prevent following the link
	e.preventDefault();
	console.log("user clicked on search button");

	$.get("/building", getBuildingDetails);
}

function getBuildingDetails(result){

	console.log(result);
	//set result HTML
	var detailsHTML = '<nav class="navbar navbar-inverse navbar-fixed-bottom"><div class="container"><address><strong>'+result['name']+'</strong><br><small>'+result['code']+'</small><br>Location: '+result['location']+'<br>Building#: '+result['buildingnumber']+'</address></div></nav>';
	$('.result').html(detailsHTML);


	//get random corrdinates that are within the screen
	var randomX = Math.floor(w * Math.random());
	var randomY = Math.floor(h * Math.random());
	var markerHTML = '<span class="glyphicon glyphicon-map-marker" style="margin-top:'+randomY+'px; margin-left:'+randomX+'px"></span>';
	$('#marker').html(markerHTML);w
}

function GoogleMap()
{
	var map_canvas = document.getElementById('map_canvas');
    var map_options = {
      center: new google.maps.LatLng(32.881605,-117.230737),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map_canvas, map_options)
}
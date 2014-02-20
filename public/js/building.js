'use strict';

var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var pos;
var map;
var marker;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	GoogleMap();
	//google.maps.event.addDomListener(window, 'load', initialize);
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#searchBtn").click(updateResult);
	$('#map_container').css('width', w);
	$('#map_container').css('height', h);
	$('#map_canvas').css('width', w);
	$('#map_canvas').css('height', h-26);
}

function updateResult(e) {
	// Prevent following the link
	e.preventDefault();
	console.log("user clicked on search button");
	var buildingCode = $('#buildingInput').val();
	$.get("/building/" + buildingCode, getBuildingDetails);
}

function getBuildingDetails(result){

	console.log(result);
	var detailsHTML;
	//set result HTML
	if (result == 'No Result.'){
		var detailsHTML = '<nav class="navbar navbar-inverse navbar-fixed-bottom" id="result"><div class="container"><strong>'+result+'</strong></div></nav>';
	}
	else {
		var detailsHTML = '<nav class="navbar navbar-inverse navbar-fixed-bottom" id="result"><div class="container"><strong>'+result['name']+'</strong><br><small>'+result['location']+ " " +result['buildingnumber']+'</div></nav>';
	}
	$('.result').html(detailsHTML);

	var pos = new google.maps.LatLng(result['lat'], result['long']);
	var image
	marker = new google.maps.Marker({
    	position: pos,
    	map: map,
    	image: image,
    	title:"Testest!"
    });

	map.setCenter(pos);
	//get random corrdinates that are within the screen
	//var randomX = Math.floor(w * Math.random());
	//var randomY = Math.floor(h * Math.random());
	//var markerHTML = '<span class="glyphicon glyphicon-map-marker" style="margin-top:'+randomY+'px; margin-left:'+randomX+'px"></span>';
	//$('#marker').html(markerHTML);
}

function GoogleMap()
{
	//GPS Location
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      pos = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	      var infowindow = new google.maps.InfoWindow({
	        map: map,
	        position: pos,
	        content: 'You are here.'
	      });

	      map.setCenter(pos);
	    }, function() {
	      handleNoGeolocation(true);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false);
	  }

	// get map section ID
	var map_canvas = document.getElementById('map_canvas');


	// variable that stores map option
    var map_options = {
      center: new google.maps.LatLng(32.880011, -117.237179),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      zoomControl: true,
      zoomControlOptions: {
      	position: google.maps.ControlPosition.TOPLEFT
      }
    }

    // Google map
    map = new google.maps.Map(map_canvas, map_options);

	var gpsDiv = document.createElement('div');
	var gpsButton = new gpsControl(gpsDiv, map);
	gpsDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(gpsDiv);
}

function gpsControl( controlDiv, map )
{
	//controlDiv = document.createElement('div');
	controlDiv.style.padding = '5px';

	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to locate yourself using GPS';
	controlDiv.appendChild(controlUI);

    //var setHomeText = document.createElement('div');
    //setHomeText.innerHTML = '<strong>Set Home</strong>';
    //controlUI.appendChild(setHomeText);

	var controlImage = document.createElement('img');
	controlImage.src = 'images/gps.png';
	controlUI.appendChild(controlImage);
	google.maps.event.addDomListener(controlUI, 'click', function() {
      map.setCenter(pos)
    });
	
}

function pressEnter(e){
	if (e.keyCode == 13){
		var tb = document.getElementById('buildingInput');
		updateResult(e);
		$('#buildingInput').blur();
		return false;
	}
}
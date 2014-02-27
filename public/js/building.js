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
var gpsMarker;
var followGps = 0;

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

	$.get("/building", setBuildingList);


}

function setBuildingList(result){
	//console.log(result);
	var buildingList = [];

	for( var i in result ){
		var tempInfo = result[i];
		buildingList[i] = tempInfo['name'];

		if( tempInfo['code'] != 'N/A' || tempInfo['buildingnumber'] != 'N/A'){ buildingList[i]+=" |";}

		if( tempInfo['code'] != 'N/A'){ buildingList[i] += ' (' + tempInfo['code'] + ')'; } 
		if( tempInfo['buildingnumber'] != 'N/A'){ buildingList[i] += ' [' + tempInfo['buildingnumber'] + ']'; } 
	}

    var availableTags = buildingList;
    $( "#buildingInput" ).autocomplete({
      source: availableTags
    });
}

function updateResult(e) {
	// Prevent following the link
	e.preventDefault();
	console.log("user clicked on search button");
	var buildingCode = $('#buildingInput').val();
	//buildingCode = buildingCode.toUpperCase();
	$.get("/building", getBuildingDetails);
}

function getBuildingDetails(result){
	var building = 'No Result.';
	var buildingInput = $('#buildingInput').val();

	var indexOfBar =  buildingInput.indexOf("|");
	if( indexOfBar != -1 )
	{
		buildingInput = buildingInput.substring(0, indexOfBar-1);
		console.log(buildingInput);
	}



	for (var i in result){
		var tempInfo = result[i];
		if (buildingInput == tempInfo['name']) {
			building = tempInfo;
			break;
		}
	}

	if( building == 'No Result.'){
		for (var i in result){
			var tempInfo = result[i];
			if (buildingInput == tempInfo['code']) {
				building = tempInfo;
				break;
			}
		}
	}

	if( building == 'No Result.'){
		for (var i in result){
			var tempInfo = result[i];
			if (buildingInput == tempInfo['buildingnumber']) {
				building = tempInfo;
				break;
			}
		}
	}

	//console.log(result);
	var detailsHTML;
	//set result HTML
	if (building == 'No Result.'){
		var detailsHTML = '<nav class="navbar navbar-inverse navbar-fixed-bottom" id="result"><div class="container"><strong>'+building+'</strong></div></nav>';
	}
	else {
		var detailsHTML = '<nav class="navbar navbar-inverse navbar-fixed-bottom" id="result"><div class="container"><strong>'+building['name']+'</strong><br><small>'+building['location']+ " " +building['buildingnumber']+'</div></nav>';
	}
	$('.result').html(detailsHTML);

	//Removing previous Marker
	if( marker != null ) {marker.setMap(null);}

	if(building != 'No Result.'){
		//Setting new Marker
		var pos = new google.maps.LatLng(building['lat'], building['long']);
		marker = new google.maps.Marker({
	    	position: pos,
	    	map: map,
	    	//image: image,
	    	title:"Testest!"
	    });

		map.setCenter(pos);
	}
	//get random corrdinates that are within the screen
	//var randomX = Math.floor(w * Math.random());
	//var randomY = Math.floor(h * Math.random());
	//var markerHTML = '<span class="glyphicon glyphicon-map-marker" style="margin-top:'+randomY+'px; margin-left:'+randomX+'px"></span>';
	//$('#marker').html(markerHTML);
}

function GoogleMap()
{
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

	//Initialize GPS Marker
	gpsMarker = new google.maps.Marker({
	    map: map,
	    icon: 'images/clocation.png'
	});

	//GPS Location
	centerGps();
	//var gpsThread = window.setInterval(updateGps, 100);
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
      if( navigator.geolocation ) {
      	centerGps();
      }
      else
      {
      	var floatingMessage = document.createElement('div');
      	floatingMessage.style.backgroundColor = 'black';
      	floatingMessage.style.textAlign = 'center';
      	floatingMessage.style.color = 'white';
      	floatingMessage.innerHTML = '<p>Your GPS is either disabled or does not exist.</p>'
      }

    });
	
}

function updateGps()
{
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      pos = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	      gpsMarker.setPosition(pos);
	      if( followGps == true )	{map.setCenter(pos);}
	    }, function() {
	      handleNoGeolocation(true);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false);
	  }
}

function centerGps()
{
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      pos = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	      gpsMarker.setPosition(pos);
	      map.setCenter(pos);

	    }, function() {
	      handleNoGeolocation(true);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false);
	  }	
}

function pressEnter(e){
	if (e.keyCode == 13){
		var tb = document.getElementById('buildingInput');
		updateResult(e);
		$('#buildingInput').blur();
		return false;
	}
}

function handleNoGeolocation(errorFlag) {
  	if (errorFlag == true) {
      //alert("Geolocation service failed.");
      //initialLocation = newyork;
    } else {
      //alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      //initialLocation = siberia;
    }
    //map.setCenter(initialLocation);
}

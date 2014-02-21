function updateGps()
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
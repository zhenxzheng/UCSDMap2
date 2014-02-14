'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#searchBtn").click(updateResult);

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
	var randomX = Math.floor(screen.width * Math.random());
	var randomY = Math.floor(screen.height * Math.random());
	var markerHTML = '<span class="glyphicon glyphicon-map-marker" style="margin-top:'+randomY+'px; margin-left:'+randomX+'px"></span>';
	$('#marker').html(markerHTML);
}
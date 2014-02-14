'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	// Add any additional listeners here
	// example: $("#div-id").click(functionToCall);
	$("a.thumbnail").click(projectClick);
	$("#seartchBtn").click(updateProject);

}

function updateProject(e){
	var buildingname = $('#project').val();
	$(projectID).animate({
		width: $('#width').val()
	});
	var newText = $('#description').val();
	$(projectID + " .project-description").text(newText);
}

function addProjectDetails(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var idNumber = projectID.substr('project'.length);

	console.log("/project/" + idNumber);
	$.get("/project/" + idNumber, projectDetails);


}

function projectDetails(result){
	console.log(result);
	//var projectID = '#'+ result['id'];
	//console.log(projectID);
	var detailsHTML = '<img src="' + result['image'] + '"class="img detailsImage">' + '<p>' + result['title'] + '</p>' + '<p><small>' + result['date'] + '</small></p>' + '<p>' + result['summary'] + '</p>';
	$('#project'+result['id'] + ' .details').html(detailsHTML);
}
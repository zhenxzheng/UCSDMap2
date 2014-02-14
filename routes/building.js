var buildings = require('../buildingdata.json');

exports.view = function(req, res){
	var randomBuilding = buildings[Math.floor(buildings.length * Math.random())];
	res.json(randomBuilding);
};

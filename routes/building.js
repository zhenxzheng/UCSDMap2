var buildings = require('../buildingdata.json');

exports.buildingInfo = function(req, res){
	var buildingCode = req.params.code;
	//var randomBuilding = buildings[Math.floor(buildings.length * Math.random())];
	var building = 'No Result.';
	for (var i in buildings){
		tempInfo = buildings[i];
		if (buildingCode == tempInfo['code']) {
			building = tempInfo;
			break;
		}
	}
	res.json(building);
};

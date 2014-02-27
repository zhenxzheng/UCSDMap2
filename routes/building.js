var buildings = require('../buildingdata.json');

exports.buildingList = function(req, res){
	res.json(buildings);
}

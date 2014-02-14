var data = require('../buildingdata.json')

exports.view = function(req, res){
	var buildingcode = req.params.
  res.render('index', data);
};

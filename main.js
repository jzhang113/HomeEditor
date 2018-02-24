var file = require("fs");    
var components = require('./component')

file.readFile("input.json", function(err, data) {
    if (err) {
	throw err;
    }
    var scene = components.parse(data);
    
    if (components.validate(scene)) {
	var inConnections = [];
	var outConnection = [];

	scene.components.forEach(function(item) {

	});
    }
});

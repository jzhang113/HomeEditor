module.exports = {
    main: function() {
	const file = require("fs");	
	const components = require(__dirname + "/component");

	file.readFile("input.json", function(err, data) {
	    if (err) {
		throw err;
	    }

	    var scene = components.parse(data);
	    var result = components.validate(scene);
	
	    if (result.status) {
		return {'success': true, 'message': []};
	    } else {
		return {'success': false, 'message': result.message};
	    }
	});
    }
}
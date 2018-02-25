module.exports = {
    main: function(data) {
	const components = require(__dirname + "/component");

	var scene = components.parse(data);
	var result = components.validate(scene);
	
	if (result.status) {
	    return {'success': true, 'message': []};
	} else {
	    return {'success': false, 'message': result.message};
	}
    }
}

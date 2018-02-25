module.exports = {
    getFile: function(path) {
	const fs = require('fs');
	var fileName = __dirname + path;
	var content;
	
	fs.readFile(fileName, "utf8", function(err, data) {
	    if (err) {
		throw err;
	    }

	    content = data;
	});
	
	return content;
    }
}

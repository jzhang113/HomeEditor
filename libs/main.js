module.exports = {
    main: function(data) {
	const components = require(__dirname + "/component");
	
	var scene = components.parse(data);
	var result = components.validate(scene);

	console.log("Graph build result: " + result.status);
	
	if (result.status) {
	    return traverse(result.message);
	} else {
	    return {'success': false, 'message': result.message};
	}
    }
}

function traverse(scene) {
    const assembler = require(__dirname + "/assemble");
    const fs = require('fs');
    var template = fs.readFileSync(__dirname + "/../templates/arduino_template").toString();
    var sample = fs.readFileSync(__dirname + "/../templates/arduino_sample").toString();
    var globalSensorNames = [];
    var localSensorNames = [];
    var pinModes = [];
    var readData = [];
    var outputAction = "";


    scene.inputComponents.forEach(function(input) {
	globalSensorNames.push(input.id);
    });
    
    
    for (var i = 0; i < scene.arduinos.length; i++) {
	var component = scene.arduinos[i];
	console.log(component);
    }

    //for (var i = 
    
    /*
	localSensorNames[i] = [];
	pinModes[i] = "";
	readData[i] = "";
	
	component.edges.forEach(function(edge) {
	    globalSensorNames.push({"ard": component, "conn": edge});
	    localSensorNames[i].push({"ard": component, "conn": edge});	
	});

	component.inputs.forEach(function(input) {
	    // TODO: Node Types belong to the other side???
	    if (input.nodeType == "digital" | input.nodeType == "digitalPWM") {
    		pinModes[i] += "pinMode(" + input.name + ", INPUT)\n";
		for (var j = 0; j < localSensorNames[i].length; j++) {
		    var temp = localSensorNames[i][j];
		    if (input.name == temp.conn.connector.name) {
			readData[i] += temp.ard.name + "_" + temp.conn.other.name + " = " + " digitalRead(" + input.name + ");\n";
		    }
		}
	    } else {
		readData[i] += "dataRecvd[" + i + "] = " + " analogRead(" + input.name + ");\n";
		readData[i] += "bytesRecvd = " + i;
	    }
	});
	
	component.outputs.forEach(function(output) {	    
	    //if (output.nodeType == "digital" | output.nodeType == "digitalPWM") {
	    pinModes[i] += "pinMode(" + output.name + ", OUTPUT)\n";
	    //}

	    // TODO: output actions - implement lights + speakers
	    outputAction = output.name;
	});
    }
*/

    var globalSensorString = "";
    var localSensorString = [];

    for (var i = 0; i < scene.arduinos.length; i++) {
	var temp = globalSensorNames[i];
	globalSensorString += "byte s" + temp + " = 0;\n";
	globalSensorString += "byte o" + temp + " = 0;\n";

	/*
	localSensorString[i] = "";
	for (var j = 0; j < localSensorNames.length; j++) {
	    var temp2 = localSensorNames[i][j];
	    localSensorString[i] += "byte " + "old_" + temp2.ard.name + "_" + temp2.conn.other.name + " = 0\n;";
	}
*/
    }    

    template = template.replace("#replaceGlobalSensors#", globalSensorString);
    
    var generated = [];

    for (var i = 0; i < scene.arduinos.length; i++) {
	//generated[i] = template.replace("#replaceLocalSensors", localSensorString[i]);
	generated[i] = template.replace("#replacePinModes", pinModes[i]);
	//generated[i] = template.replace("#replaceReadData#", readData[i]);
	//generated[i] = template.replace("#replaceRunAction#", outputAction);
    }

    return sample;    
}

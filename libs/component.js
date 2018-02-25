module.exports = {
    parse: function (json) {
	var scene = new Scene();

	json.forEach(function(entry) {
	    var component = new Component(entry["name"], entry["nodeType"]);

	    for (var i = 0; i < entry["inputs"].length; i++) {
		var input = entry["inputs"];
		component.addInput(new Connector(input[i]["type"], input[i]["nodeType"], input[i]["name"], entry["inputsArr"][i], input[i]["fid"]));
	    }
	    
	    for (var i = 0; i < entry["outputs"].length; i++) {
		var output = entry["outputs"];
		component.addOutput(new Connector(output[i]["type"], output[i]["nodeType"], output[i]["name"], entry["outputsArr"][i], null));
	    }
	    
	    scene.addComponent(component);
	});
	
	return scene;
    },        
    validate: function (scene) {
	var outstanding = {};
	var invalid = false;

	scene.components.forEach(function(component) {
	    component.outputs.forEach(function(item) {
		if (item.connId != null) {
		    outstanding[item.connId] = {'type': item.dataType, 'component': component};
		}
	    });
	});

	scene.components.forEach(function(component) {
	    component.inputs.forEach(function(item) {
		if (outstanding[item.fid] != undefined) {
		    var other = outstanding[item.fid]['component'];
		    component.addEdge(new Connection(other, item));
		    other.outputs.forEach(function(otherInputs) {
			if (otherInputs.connId == item.fid) {
			    other.addEdge(new Connection(component, otherInputs));
			}
		    });
		    
		    //delete outstanding[item.fid];	    
		} else {
		    if (item.fid != undefined) {
			invalid = true;
			console.log("Bad fid: " + item.fid + " " +item.name);
		    }
		}
	    });
	});

	/*
	scene.components.forEach(function(comp) {
	    comp.edges.forEach(function(edge) {
		console.log(edge);
	    });
	});
	*/
	
	if (!invalid) {
	    return {'status': true, 'message': scene};
	} else {
	    return {'status': false, 'message': 'bad connections'};
	}
    }
}

function Connector(dataType, nodeType, name, connId, fid) {
    this.dataType = dataType;
    this.nodeType = nodeType;
    this.name = name;
    this.connId = connId;
    this.fid = fid;
    // 5V, ground, digital, analog, digitalPWM
}

function Connection(other, connector) {
    this.other = other;
    this.connector = connector
}

function Component(name, nodeType) {
    this.name = name;
    this.nodeType = nodeType;
    this.inputs = [];
    this.outputs = [];
    this.edges = [];
    
    this.addInput = function(connector) {
        this.inputs.push(connector);
    }

    this.addOutput = function(connector) {
        this.outputs.push(connector);
    }

    this.addEdge = function(edge) {
	this.edges.push(edge);
    }
}

function Scene() {
    this.components = [];
    this.arduinos = [];
    
    this.addComponent = function(comp) {
	this.components.push(comp);

	if (comp.nodeType == "arduino") {
	    this.arduinos.push(comp);
	}
    }
}

module.exports = {
    parse: function (input) {
	console.log(input);
	var json = JSON.parse(input);
	var scene = new Scene();

	json.forEach(function(entry) {
	    var component = new Component(entry["operation"]);

	    entry["input"].forEach(function(input) {
		component.addInput(new Connector(input["type"], input["name"], input["id"]));
	    });
	    
	    entry["output"].forEach(function(output) {
		component.addOutput(new Connector(output["type"], output["name"], output["id"]));
	    });

	    scene.addComponent(component);
	});
	
	return scene;
    },        
    validate: function (scene) {
	var outstanding = {};
	var invalid = false;
	
	scene.component.forEach(function(component) {
	    component.inputs.forEach(function(item) {
		outstanding[item.connId] = {'type': item.dataType, 'component': component};
	    });
	});

	scene.component.forEach(function(component) {
	    component.outputs.forEach(function(item) {
		if (outstanding[item.connId] != undefined) {
		    var other = outstanding[item.connId]['component'];
		    component.addEdge(new Connection(other, item.connId));
		    other.addEdge(new Connection(component, item.connId));
		    
		    delete outstanding[item.connId];	    
		} else {
		    invalid = true;
		}
	    });
	});
	
	if (Object.keys(outstanding).length === 0 && !invalid) {
	    return {'status': true, 'message': scene};
	} else {
	    return {'status': false, 'message': 'bad network'};
	}
    }
}

function Connector(dataType, name, connId) {
    this.dataType = dataType;
    this.name = name;
    this.connId = connId;
}

function Connection(other, id) {
    this.other = other;
    this.id = id;
}

function Component(name) {
    this.name = name;
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
    this.component = [];

    this.addComponent = function(comp) {
	this.component.push(comp);
    }
}

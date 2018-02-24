module.exports = {
    parse: function (input) {
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
    validate: function(scene) {

    }
}

function Connector(dataType, name, connId) {
    this.dataType = dataType;
    this.name = name;
    this.connId = connId;
}

function Component(name) {
    this.name = name;
    this.inputs = [];
    this.outputs = [];

    this.addInput = function(connector) {
        this.inputs.push(connector);
    }

    this.addOutput = function(connector) {
        this.outputs.push(connector);
    }    
}

function Scene() {
    this.component = [];

    this.addComponent = function(comp) {
	this.component.push(comp);
    }

    validate = function() {
	return true;
    }
}

module.exports = {
    parse: function (text) {
	var scene = new Scene();
	/*
	  json["arduinos"].forEach(function(ard) {
	  var id = ard["id"];
	  scene.ardIds.push(ard["id"]);
	  scene.arduinos.push(new Component("ard_" + id, "arduino", id));
	  });
	*/
	text.forEach(function(json) {
	    var comp = new Component(json["name"], json["type"], json["id"]);
	    
	    json["inputs"].forEach(function(inputConn) {
		comp.inputs.push(new Connector(inputConn["name"], inputConn["type"], true, inputConn["pinnumber"], inputConn["arduinoid"]));
	    });

	    json["outputs"].forEach(function(outputConn) {
		comp.outputs.push(new Connector(outputConn["name"], outputConn["type"], false, outputConn["pinnumber"], outputConn["arduinoid"]));
	    });
		
	    scene.inputComponents.push(comp);

	    /*	    
	    json["outputs"].forEach(function(output) {
		var comp = new Component(output["name"], output["type"], output["id"]);

		output["inputs"].forEach(function(inputConn) {
		    comp.inputs.push(new Connector(inputConn["name"], inputConn["type"], true, inputConn["pinnumber"], inputConn["arduinoid"]));
		});

		output["outputs"].forEach(function(outputConn) {
		    comp.outputs.push(new Connector(outputConn["name"], outputConn["type"], false, outputConn["pinnumber"], outputConn["arduinoid"]));
		});
		
		scene.outputComponents.push(comp);
	    });
*/
	});
	
	/*
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
	  }
	*/
	
	//console.log(scene);
	
	return scene;
    },        
    validate: function (scene) {
	//var outstanding = {};
	//var invalid = false;

	scene.inputComponents.forEach(function(input) {
	    input["inputs"].forEach(function(inputConn) {		
		scene.arduinos.forEach(function(ard) {
		    if (inputConn.ardId == ard.id) {
			ard.inputs.push(inputConn);
		    }
		});	
	    });
	    

	    input["outputs"].forEach(function(outputConn) {
		scene.arduinos.forEach(function(ard) {
		    if (outputConn.ardId == ard.id) {
			ard.inputs.push(inputConn);
		    }
		});
	    });    
	});

	
	scene.outputComponents.forEach(function(output) {
	    output["inputs"].forEach(function(inputConn) {
		scene.arduinos.forEach(function(ard) {
		    if (inputConn.ardId == ard.id) {
			ard.inputs.push(inputConn);
		    }
		});
	    });

	    output["outputs"].forEach(function(outputConn) {
		scene.arduinos.forEach(function(ard) {
		    if (inputConn.ardId == ard.id) {
			ard.inputs.push(inputConn);
		    }
		});
	    });    
	});
	
	/*
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
	
	//if (!invalid) {
	return {'status': true, 'message': scene};
	//} else {
	//    return {'status': false, 'message': 'bad connections'};
	//}
    }
}

function Connector(name, type, input, pinnumber, arduinoid) {
    this.name = name;
    this.type = type;
    this.input = input;
    this.pinId = pinnumber;
    this.ardId = arduinoid;
    // probably should have a connection type
    // 5V, ground, digital, analog, digitalPWM
}

function Connection(other, connector) {
    this.other = other;
    this.connector = connector
}

function Component(name, type, id) {
    this.name = name;
    this.type = type;
    this.id = id;
    this.inputs = [];
    this.outputs = [];
    this.edges = [];

    /*
      this.addInput = function(connector) {
      this.inputs.push(connector);
      }

      this.addOutput = function(connector) {
      this.outputs.push(connector);
      }

      this.addEdge = function(edge) {
      this.edges.push(edge);
      }
    */
}

function Scene() {
    //this.components = [];
    this.ardIds = [];
    this.arduinos = [];
    this.inputComponents = [];
    this.outputComponents = [];

    this.getArduino = function(id) {
	var found = false;
	
	this.arduinos.forEach(function(ard) {
	    if (ard.id == id) {
		found = true;
		return ard;
	    }
	});

	if (!found) {
	    var newArd = new Component("ard_" + id, "arduino", id);
	    this.arduinos.push(newArd);
	    return newArd;
	}
    }

    /*
      this.addComponent = function(comp) {
      this.components.push(comp);

      if (comp.nodeType == "arduino") {
      this.arduinos.push(comp);
      }
      }
    */
}

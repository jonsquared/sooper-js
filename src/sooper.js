"use strict";

//These vars are purely for better minification
var o = Object,
	defineProperty = o.defineProperty,
	getOwnPropertyNames = o.getOwnPropertyNames,
	getOwnPropertyDescriptor = o.getOwnPropertyDescriptor;

function define() {
	var args = arguments,
		config = args[1] || args[0],
		fullName = args.length > 1 && args[0],
		constructor = config.constructor;
	if (constructor === Object)
		constructor = (function(){});
	if (fullName)
		//<replaceTarget>
		setupClassNamespace(fullName, constructor);
		//</replaceTarget>

	//<replaceTarget>
	setupSuperClass(constructor, config);
	//</replaceTarget>

	//<replaceTarget>
    setupClassInterfaces(constructor, config);
	//</replaceTarget>

	//<replaceTarget>
	setupClassProperties(constructor, config);
	//</replaceTarget>

	return constructor;
}

//<replaceSource>
function setupClassNamespace(fullName, constructor) {
	var names = fullName.split('.'),
		className = names.pop(),
		namespace = global;
	names.forEach(function(nextName) {
		namespace = namespace[nextName] || (namespace[nextName] = {});
	});
	//<debug>
	if (namespace[className])
		throw new Error('Class "'+className+'" is already defined.');
	//</debug>
	namespace[className] = constructor;
}
//</replaceSource>

//<replaceSource>
function setupSuperClass(constructor, config) {
	var superClass = config.inherits;
	if (superClass)
		(constructor.prototype = Object.create(superClass.prototype)).super = superClass;
}
//</replaceSource>

//<replaceSource>
function setupClassInterfaces(constructor, config) {
	var interfaces = config.implements||[];
	var proto = constructor.prototype;
	if (!interfaces.push)
		interfaces = [interfaces];
	interfaces.forEach(function(iFace) {
		var iproto = iFace.prototype;
		getOwnPropertyNames(iproto).forEach(function(ipropName) {
			defineProperty(proto, ipropName, getOwnPropertyDescriptor(iproto, ipropName));
        });
    });
}
//</replaceSource>

//<replaceSource>
function setupClassProperties(constructor, config) {
	var	proto = constructor.prototype,
		props = getOwnPropertyNames(config);
    props.forEach(function(propName) {
    	if (!(propName in {
				constructor:0,
				inherits:0,
				implements:0
			}))
		{
			var overriddenPropVal = proto[propName];
	        defineProperty(proto, propName, getOwnPropertyDescriptor(config, propName));
	        if (overriddenPropVal && (proto[propName] instanceof Function))
	        	proto[propName].super = overriddenPropVal;
	    }
	})
}
//</replaceSource>

module.exports = {
	define: define,
	version: '2.1.0'
}

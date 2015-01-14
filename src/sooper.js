"use strict";

//These vars are purely for better minification
var o = Object,
	defineProperty = o.defineProperty,
	getOwnPropertyNames = o.getOwnPropertyNames,
	getOwnPropertyDescriptor = o.getOwnPropertyDescriptor;

function define(fullName, config) {
	var cfg = config,
		config = cfg || fullName,
		constructor = config.constructor,
		superClass = config.inherits,
		interfaces = config.implements||[],
		statics = config.statics;
	constructor = constructor === Object ? (function(){}) : constructor;

	//<replaceTarget>
	setupStatics(constructor, statics);
	//</replaceTarget>

	if (fullName = cfg && fullName)
		//<replaceTarget>
		setupClassNamespace(fullName, constructor);
		//</replaceTarget>

	//<replaceTarget>
	setupSuperClass(constructor, superClass);
	//</replaceTarget>

	var proto = constructor.prototype;
	//<replaceTarget>
    setupClassInterfaces(proto, interfaces);
	//</replaceTarget>

	//<replaceTarget>
	setupClassProperties(proto, config);
	//</replaceTarget>

	return constructor;
}

//<replaceSource>
function setupStatics(constructor, statics) {
	for (var propName in statics)
        defineProperty(constructor, propName, getOwnPropertyDescriptor(statics, propName));
}
//</replaceSource>

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
function setupSuperClass(constructor, superClass) {
	if (superClass)
		(constructor.prototype = o.create(superClass.prototype)).super = superClass;
}
//</replaceSource>

//<replaceSource>
function setupClassInterfaces(proto, interfaces) {
	(interfaces.pop ? interfaces : [interfaces]).forEach(function(iFace) {
		var iproto = iFace.prototype;
		getOwnPropertyNames(iproto).forEach(function(ipropName) {
			defineProperty(proto, ipropName, getOwnPropertyDescriptor(iproto, ipropName));
        });
    });
}
//</replaceSource>

//<replaceSource>
function setupClassProperties(proto, config) {
    getOwnPropertyNames(config).forEach(function(propName) {
    	if (!(propName in {
				constructor:0,
				inherits:0,
				implements:0,
				statics:0
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

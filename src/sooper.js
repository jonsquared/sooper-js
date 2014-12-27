//These vars are purely for better minification
var o = Object,
	defineProperty = o.defineProperty,
	getOwnPropertyNames = o.getOwnPropertyNames,
	getOwnPropertyDescriptor = o.getOwnPropertyDescriptor;

function define() {
	var args = arguments,
		config = args[1] || args[0],
		fullName = args.length > 1 && args[0];
	//<debug>
	var c = config.constructor;
	if (!c || typeof(c) != 'function')
		throw new Error('A constructor function must be defined.');
	//</debug>
	if (fullName)
		setupClassNamespace(fullName, config);
	setupSuperClass(config);
    setupClassInterfaces(config);
	setupClassProperties(config);
	return config.constructor;
}

function getNamespaceFromFullName(fullName) {
	var names = fullName.split('.'),
		namespace = global;
	for (var i=0; i<names.length-1; i++) {
		var nextName = names[i];
		if (namespace[nextName])
			namespace = namespace[nextName];
		else
			namespace = namespace[nextName] = {};
	}
	return namespace;
}

function setupClassNamespace(fullName, config) {
	var className = getClassNameFromFullName(fullName),
		namespace = getNamespaceFromFullName(fullName);
	//<debug>
	if (namespace[className])
		throw new Error('Class "'+className+'" is already defined.');
	//</debug>
	namespace[className] = config.constructor;
}

function setupSuperClass(config) {
	var superClass = config.inherits;
	if (superClass) {
		var c = config.constructor,
			proto = c.prototype = Object.create(superClass.prototype);
		proto.super = superClass;
	}
}

function setupClassProperties(config) {
	var	proto = config.constructor.prototype,
		props = getOwnPropertyNames(config);
    for (var i=props.length; i--; ) {
    	var propName = props[i];
    	if (propertyNameIsKeyword(propName))
    		continue;
		var overriddenPropVal = proto[propName];
        defineProperty(proto, propName, getOwnPropertyDescriptor(config, propName));
        if (overriddenPropVal && (proto[propName] instanceof Function))
        	proto[propName].super = overriddenPropVal;
	}
}

function propertyNameIsKeyword(propName) {
	return propName == "constructor" ||
		   propName == "inherits" ||
		   propName == "implements";
}

function setupClassInterfaces(config) {
	var interfaces = config.implements;
	if (!interfaces)
		return;
	var proto = config.constructor.prototype;
	if (!interfaces.push)
		interfaces = [interfaces];
	for (var iIndex=0; iIndex<interfaces.length; iIndex++ ) {
		var iproto = interfaces[iIndex].prototype,
			iprops = getOwnPropertyNames(iproto);
		for (var ipropIndex=iprops.length; ipropIndex--; ) {
			var ipropName = iprops[ipropIndex];
            defineProperty(proto, ipropName, getOwnPropertyDescriptor(iproto, ipropName));
        }
    }
}

function getClassNameFromFullName(fullName) {
	return fullName.substring(fullName.lastIndexOf('.')+1);
}

module.exports = {
	define: define,
	version: '2.0.0'
}

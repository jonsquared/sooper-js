soop = {
	define: function (fullName, config) {
		var c = config.constructor;
		if (!c || typeof(c) != 'function')
			throw new Error('A constructor function must be defined.');
		this.setupClassNamespace(fullName, config);
		this.setupSuperClass(config);
        this.setupClassInterfaces(config);
		this.setupClassProperties(config);
	},

	getNamespaceFromFullName: function(fullName) {
		var names = fullName.split('.'),
			namespace = window;
		for (var i=0; i<names.length-1; i++) {
			var nextName = names[i];
			if (namespace[nextName])
				namespace = namespace[nextName];
			else
				namespace = namespace[nextName] = {};
		}
		return namespace;
	},

	setupClassNamespace: function(fullName, config) {
		var className = this.getClassNameFromFullName(fullName),
			namespace = this.getNamespaceFromFullName(fullName);
		if (namespace[className])
			throw new Error('Class "'+className+'" is already defined.');
		namespace[className] = config.constructor;
	},

	setupSuperClass: function(config) {
		if (config.inherits) {
			var c = config.constructor,
				proto = c.prototype = Object.create(config.inherits.prototype);
			proto.super = config.inherits;
		}
	},

	setupClassProperties: function(config) {
		var	proto = config.constructor.prototype,
			props = Object.getOwnPropertyNames(config);
        for (var i=props.length; i--; ) {
        	var propName = props[i];
        	if (this.propertyNameIsKeyword(propName))
        		continue;
			var overriddenPropVal = proto[propName];
            Object.defineProperty(proto, propName, Object.getOwnPropertyDescriptor(config, propName));
            if (overriddenPropVal && (proto[propName] instanceof Function))
            	proto[propName].super = overriddenPropVal;
		}
	},

	propertyNameIsKeyword: function(propName) {
		switch(propName) {
			case "constructor":
			case "inherits":
			case "implements":
				return true;
		}
		return false;
	},

	setupClassInterfaces: function(config) {
		var interfaces = config.implements;
		if (!interfaces)
			return;
		var c = config.constructor,
			proto = c.prototype;
		if (!interfaces.push)
			interfaces = [interfaces];
		for (var iIndex=0; iIndex<interfaces.length; iIndex++ ) {
			var iproto = interfaces[iIndex].prototype,
				iprops = Object.getOwnPropertyNames(iproto);
			for (var ipropIndex=iprops.length; ipropIndex--; ) {
				var ipropName = iprops[ipropIndex];
	            Object.defineProperty(proto, ipropName, Object.getOwnPropertyDescriptor(iproto, ipropName));
	        }
	    }
	},

	getClassNameFromFullName: function(fullName) {
		return fullName.substring(fullName.lastIndexOf('.')+1);
	},

	undefine: function (fullName) {
		var className = this.getClassNameFromFullName(fullName),
			namespace = this.getNamespaceFromFullName(fullName);
		delete namespace[className];
		if (namespace !== window && Object.keys(namespace).length == 0)
			this.cleanupNamespace(fullName.substring(0,fullName.lastIndexOf('.')));
	},

	cleanupNamespace: function(name) {
		var names = name.split('.'),
			namespaces = [window],
			namespace = window;
		for (var i=0; i<names.length; i++) {
			var nextName = names[i];
			namespace = namespace[nextName];
			namespaces.push(namespace);
		}
		for (var i=namespaces.length; --i; ) {
			var parentNamespace = namespaces[i-1],
				name = names[i-1];
			namespace = namespaces[i];
			if (Object.keys(namespace).length == 0)
				delete parentNamespace[name];
			else
				break;
		}
	}
}

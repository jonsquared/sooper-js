soop = {
	define: function (name, config) {
		var className = this.getClassNameWithoutNamespace(name),
			namespace = this.getNamespaceObjectFromClassName(name),
			c = namespace[className] = config.constructor,
			proto, props;
		if (!c)
			throw new Error('A constructor function must be defined.');
		if (config.inherits) {
			proto = c.prototype = Object.create(config.inherits.prototype);
			proto.super = config.inherits;
		} else
			proto = c.prototype;
        props = Object.getOwnPropertyNames(config);

		var impls = config.implements;
        if (impls) {
			if (!impls.push)
				impls = [impls];
			for (var implIndex=0; implIndex<impls.length; implIndex++ ) {
				var iproto = impls[implIndex].prototype,
					iprops = Object.getOwnPropertyNames(iproto);
				for (var ipropIndex=iprops.length; ipropIndex--; ) {
					var ipropName = iprops[ipropIndex];
		            Object.defineProperty(proto, ipropName, Object.getOwnPropertyDescriptor(iproto, ipropName));
		        }
		    }
		}

        for (var i=props.length; i--; ) {
        	var propName = props[i];
			switch(propName) {
				case "constructor":
				case "inherits":
				case "implements":
					break;
				default:
					var overriddenPropVal = proto[propName];
		            Object.defineProperty(proto, propName, Object.getOwnPropertyDescriptor(config, propName));
		            if (overriddenPropVal && (proto[propName] instanceof Function))
		            	proto[propName].super = overriddenPropVal;
			}
		}
	},

	undefine: function (name) {
		var className = this.getClassNameWithoutNamespace(name),
			namespace = this.getNamespaceObjectFromClassName(name);
		delete namespace[className];
		if (namespace !== window && Object.keys(namespace).length == 0)
			this.cleanupNamespace(name.substring(0,name.lastIndexOf('.')));
	},

	getClassNameWithoutNamespace: function(name) {
		return name.substring(name.lastIndexOf('.')+1);
	},

	getNamespaceObjectFromClassName: function(name) {
		var names = name.split('.'),
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

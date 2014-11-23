soop = {
	define: function (name, config) {
		var c = window[name] = config.constructor,
			proto, props;
		if (!c)
			throw new Error('A constructor function must be defined.');
		if (config.inherits)
			c.prototype = Object.create(config.inherits.prototype);
		proto = c.prototype;
        props = Object.getOwnPropertyNames(config);

        if (config.implements) {
			var impls = config.implements;
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
		            Object.defineProperty(proto, propName, Object.getOwnPropertyDescriptor(config, propName));
			}
		}
	},
	undefine: function (name) {
		delete window[name];
	}
}

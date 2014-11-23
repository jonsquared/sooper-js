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
        for (var i=props.length; i--; ) {
        	var propName = props[i];
			switch(propName) {
				case "constructor":
				case "inherits":
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

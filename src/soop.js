soop = {
	define: function (name, config) {
		var c = window[name] = config.constructor,
			proto, props;
		if (!c)
			throw new Error('A constructor function must be defined.');
		proto = c.prototype;
        props = Object.getOwnPropertyNames(config);
        for (var i=props.length; i--; ) {
        	var propName = props[i];
			switch(propName) {
				case "constructor":
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
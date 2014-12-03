SOOP
====

Simple Object Oriented Programming framework for JavaScript. It's light-weight and efficient.

Usage
-----

###Defining a class
Note: Every class must have a constructor defined

	soop.define('app.namespace.TestClass', {
		value: 42,
		constructor: function() {},
		getValue: function() { return this.value; }
	});

	var test = new app.namespace.TestClass();
	test.getValue(); //42

###Inheriting a super class

	soop.define('SuperClass', {
		value: 0,
		constructor: function(value) { this.value = value; },
		func: function() { return 1; }
	});

	soop.define('TestClass', {
		inherits: SuperClass,
		constructor: function(value) {
			this.super(value);
			this.value++;
		},
		func: function me() {
			return me.super.call(this)+1;
		}
	});

	var test = new TestClass(41);
	test.value; //42
	test.func(); //2

###Implementing interfaces

	soop.define('Interface1', {
		constructor: function() {},
		func1: function() { return 1; }
	});

	soop.define('Interface2', {
		constructor: function() {},
		func2: function() { return 2; }
	});

	soop.define('TestClass', {
		implements: [Interface1,Interface2],
		constructor: function() {},
		func1: function me() {
			return me.super.call(this)+1;
		},
		func2: function me() {
			return me.super.call(this)+2;
		}
	});

	var test = new TestClass();
	test.func1(); //2
	test.func2(); //4

SOOP
====

Simple inheritance and implementation framework for JavaScript.

Why use this framework? There were several reasons this framework was created instead of simply using one of the many other JavaScript inheritance frameworks:
* Define an object oriented class hierarchy in JavaScript while maintaining efficiency. It will not introduce any unnecessary closure, which allows class instances to be created faster and to use less memory.
* Classes maintain compatability with native JavaScript.
    * use the *new* keyword to create instances
    * compatible with *instanceof*
    * compatible with ECMAScript 6 classes making the transition to native classes easier
* Does not pollute native classes (e.g. putting helper methods on Object.prototype)

**Requirements:**
* *ECMAScript 5* features

**Features:**
* class definition, inheritance, and implementation (mixin style)
* automatic namespace generation
* quick access to super constructor and super functions

Usage
-----

###Defining a class
Notes:
* Every class must at least define a constructor
* A class may have a namespace 0 or more levels deep ('.' separated)
* Property descriptors will be preserved (configurable, enumerable, writable, etc...)

<!--end of the list -->

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

###Testing and Building

This project is configured for Grunt. The first time testing or building, run the following steps on the command line at the root of the project:

	npm install -g grunt-cli
	npm install

To run the tests (karma using PhantomJS set to autoWatch), run:

	grunt test

To build soop.js, run:

	grunt


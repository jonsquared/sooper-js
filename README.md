SOOP
====

Simple Object Oriented Programming framework for JavaScript. It's light-weight and efficient.

This framework requires *ECMAScript 5*

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

###Testing

Tests are written as jasmine tests and configured for the karma test runner.
To run the tests, navigate to the tests directory and run:

	karma start karma.config.js --single-run

###Building

The build is configured for Grunt. The first time building, run the following steps on the command line:

To be able to run grunt on the command line:

	npm install -g grunt-cli

To install all required grunt plugins by this project:

	npm install

To build soop, run:

	grunt


sooper
====

**S**imple **O**bject **O**riented **P**rogramming inheritance and implementation framework for JavaScript.

**Requirements:**
* *ECMAScript 5* features

Why use this framework? To answer that, here is a list of requirements that initially drove the creation of sooper:
* Keep it *Simple* and *efficient*
* Provide a way to define a class that can inherit a super class and implement many interfaces (ala mixin).
* Do not introduce any unnecessary closure, which allows class instances to be created faster and use less memory.
* Make it node and browser compatible (based off of the ECMAScript 5 standard).
* Do not pollute native class prototypes (e.g. do not put any helper methods on Object.prototype)


**Features:**
* class definition via sooper.define
* class inheritance via inherits property
* interface implementation (mixin style) via implements property
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

	sooper.define('app.namespace.TestClass', {
		value: 42,
		constructor: function() {},
		getValue: function() { return this.value; }
	});

	var test = new app.namespace.TestClass();
	test.getValue(); //42

###Inheriting a super class

	sooper.define('SuperClass', {
		value: 0,
		constructor: function(value) { this.value = value; },
		func: function() { return 1; }
	});

	sooper.define('TestClass', {
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

	sooper.define('Interface1', {
		constructor: function() {},
		func1: function() { return 1; }
	});

	sooper.define('Interface2', {
		constructor: function() {},
		func2: function() { return 2; }
	});

	sooper.define('TestClass', {
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

To build sooper.js, run:

	grunt


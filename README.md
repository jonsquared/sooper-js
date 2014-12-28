sooper
====

**S**imple **O**bject **O**riented **P**rogramming inheritance and implementation framework for JavaScript (unlike some of the **E**xtra **R**idiculous complex frameworks out there).

**Requirements:**
* *ECMAScript 5* features

>Why use an inheritance framework at all? ECMAScript 6 will have native class support in 2015, these frameworks will soon be useless!

* The proposed class implementation in ECMAScript 6 does not provide a way to implement interfaces or mixins.
* It only allows class functions, not class properties! They have to be put on the instances via the constructor (which uses more memory for every instance) or added to the class after definition.
* Several of the features in ECMAScript 5+ take several lines of code to implement when a framework could do it in less (e.g. adding properties with non-default descriptors)

>Why use this framework?

To help answer that, here is a list of requirements that initially drove the creation of sooper:
* Keep it *simple* and *efficient*
* Provide a way to define a class that can inherit a super class and implement many interfaces (ala mixin).
* Do not introduce any unnecessary closure, which allows class instances to be created faster and use less memory.
* Make it node and browser compatible (based off of the ECMAScript 5 standard).
* Do not pollute native class prototypes (e.g. do not put any helper methods on Object.prototype)

**Current features:**
* class definition via sooper.define
* class inheritance via inherits property
* interface implementation (mixin style) via implements property
* automatic namespace generation
* quick access to super constructor and super functions
* builds to a browser friendly version (see [releases](https://github.com/jonsquared/sooper-js/releases) for minified version)

>But those features don't include something the other frameworks have.  I wish sooper had those features!

**I will add any feature as long as it has 2 important properties: keeps sooper simple and makes class creation easier than native JavaScript.**
There are a LOT of javascript inheritance frameworks out there.  Some of the features in them are not necessary (because native JavaScript is just as easy), some are complex and better suited for complex frameworks (which sooper is not meant to be), and some are definitely useful (makes it much easier than native JavaScript).  I would like to add any features that fall under that last category, so if anyone has any particular requests, add them to the github issues for this project.

Usage
-----

###Defining a class
Notes:
* A constructor is optional
* A class may have an optional namespace 0 or more levels deep ('.' delimited)
* Property descriptors (configurable, enumerable, writable, etc...) will be preserved
* Reserved properties:
	* constructor
	* inherits
	* implements
	* super

<!--end of the list -->

####With auto-generated namespace
```js
sooper.define('app.namespace.TestClass', {
	value: 42,
	getValue: function() { return this.value; }
});

var test = new app.namespace.TestClass();
test.getValue(); //42
```

####As a module

```js
var TestClass = (function(){
	return sooper.define({
		value: 42,
		getValue: function() { return this.value; }
	});
}();

var test = new TestClass();
test.getValue(); //42
```

###Inheriting a super class

```js
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
```

###Implementing interfaces

```js
sooper.define('Interface1', {
	func1: function() { return 1; }
});

sooper.define('Interface2', {
	func2: function() { return 2; }
});

sooper.define('TestClass', {
	implements: [Interface1,Interface2],
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
```

###Testing and Building (For development on this project)

This project is configured for Grunt. The first time testing or building, run the following steps on the command line at the root of the project:

	npm install -g grunt-cli
	npm install

To run the tests (jasmine using PhantomJS set to autoWatch), run:

	grunt test

To build sooper.js, run:

	grunt build


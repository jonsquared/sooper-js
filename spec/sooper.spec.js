describe('sooper', function() {

	it('exists', function() {
		expect(sooper).toBeDefined();
	});

	it('has correct properties', function() {
		expect(Object.getOwnPropertyNames(sooper).length).toBe(2);
		expect(sooper.hasOwnProperty('define')).toBe(true);
		expect(sooper.hasOwnProperty('version')).toBe(true);
		expect(sooper.version).toBe("2.0.0");
	});

	describe('defining a class', function() {
		describe('with nothing', function() {
			it('can be defined', function() {
				function createClassWithoutConstructor() {
					sooper.define('TestClass', {});
				}
				expect(createClassWithoutConstructor).not.toThrow();
				expect(TestClass).toBeDefined();
				expect(TestClass instanceof Function).toBe(true);
				expect(TestClass.prototype.constructor).not.toBe(Object);
			});

			it('can be instantiated', function() {
				var test = new TestClass();
				expect(test instanceof Object).toBe(true);
				expect(test instanceof TestClass).toBe(true);
				expect(Object.getOwnPropertyNames(test).length).toBe(0);
				expect(Object.keys(test).length).toBe(0);

				delete TestClass;
			});

			it('creates unique constructors', function() {
				sooper.define('TestClass1', {
					value: 1
				});
				sooper.define('TestClass2', {
					value: 2
				});
				var t1 = new TestClass1(),
					t2 = new TestClass2();
				expect(TestClass1.prototype.constructor).not.toBe(TestClass2.prototype.constructor);
				expect(t1.value).toBe(1);
				expect(t2.value).toBe(2);

				delete TestClass1;
				delete TestClass2;
			});
		});
		describe('with only a constructor', function() {
			it('can be defined', function() {
				function createClassWithConstructor() {
					sooper.define('TestClass', {
						constructor: function(){
							this.value = 42;
						}
					});
				}
				expect(createClassWithConstructor).not.toThrow();
				expect(TestClass).toBeDefined();
			});

			it('can be instantiated', function() {
				var test = new TestClass();
				expect(Object.getOwnPropertyNames(test).length).toBe(1);
				expect(Object.keys(test).length).toBe(1);
				expect(test.value).toBe(42);

				delete TestClass;
			});
		});

		describe('with members', function() {
			function accessorGetter() { return 'accessor' };
			function accessorSetter() {};

			it('can be defined', function() {
				var testClassConfig = {
					constructor: function(value) {
						this.memberVar = value;
					},
					memberVar: 42,
					memberFunc: function() {
						return this.memberVar;
					}
				};
				Object.defineProperty(testClassConfig, 'data', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: 'data'
				});
				Object.defineProperty(testClassConfig, 'accessor', {
					enumerable: false,
					configurable: false,
					get: accessorGetter,
					set: accessorSetter
				});
				sooper.define('TestClass', testClassConfig);

				expect(TestClass).toBeDefined();
			});

			it('has correct properties', function() {
				var proto = TestClass.prototype;
				expect(proto.memberVar).toBe(42);
				expect(proto.memberFunc instanceof Function).toBe(true);
				expect(proto.data).toBe('data');
				expect(proto.accessor).toBe('accessor');
				expect(proto.hasOwnProperty('memberVar')).toBe(true);
				expect(proto.hasOwnProperty('memberFunc')).toBe(true);
				expect(proto.hasOwnProperty('data')).toBe(true);
				expect(proto.hasOwnProperty('accessor')).toBe(true);
			});

			it('retains property descriptors', function() {
				var proto = TestClass.prototype;
				expect(Object.getOwnPropertyDescriptor(proto,'memberVar')).toEqual(jasmine.objectContaining({
					writable: true,
					enumerable: true,
					configurable: true
				}));
				expect(Object.getOwnPropertyDescriptor(proto,'memberFunc')).toEqual(jasmine.objectContaining({
					writable: true,
					enumerable: true,
					configurable: true
				}));
				expect(Object.getOwnPropertyDescriptor(proto,'data')).toEqual(jasmine.objectContaining({
					enumerable: false,
					configurable: false,
					writable: false
				}));
				expect(Object.getOwnPropertyDescriptor(proto,'accessor')).toEqual(jasmine.objectContaining({
					enumerable: false,
					configurable: false,
					get: accessorGetter,
					set: accessorSetter
				}));
			});

			it('can be instantiated', function() {
				var test = new TestClass(21);
				expect(Object.getOwnPropertyNames(test)).toEqual(['memberVar']);
				expect(Object.keys(test)).toEqual(['memberVar']);
				expect(test.memberVar).toBe(21);
				expect(test.memberFunc()).toBe(21);

				delete TestClass;
			});
		});

		describe('with a namespace', function() {
			describe('single level', function(){
				it('is created', function() {
					sooper.define('namespace.TestClass1', {
						constructor: function() {
							this.test = true;
						}
					});
					sooper.define('namespace.TestClass2', {
						constructor: function() {
							this.test = true;
						}
					});

					expect(namespace).toBeDefined();
					expect(namespace.TestClass1).toBeDefined();
					expect(namespace.TestClass2).toBeDefined();
					expect((new namespace.TestClass1).test).toBe(true);
					expect((new namespace.TestClass2).test).toBe(true);

					delete namespace;
				});
			});

			describe('multiple levels', function() {
				it('is created', function() {
					sooper.define('namespace1.namespace2.TestClass', {
						constructor: function() {
							this.test = true;
						}
					});

					expect(namespace1).toBeDefined();
					expect(namespace1.namespace2).toBeDefined();
					expect(namespace1.namespace2.TestClass).toBeDefined();
					expect((new namespace1.namespace2.TestClass).test).toBe(true);

					delete namespace1;
				});
			});
		});

		describe('without a namespace', function() {
			function createWithoutNamespace () {
				return sooper.define({
					constructor: function() {},
					value: 42
				});
			}
			it('does not throw an error', function() {
				expect(createWithoutNamespace).not.toThrow();
			});
			it('returns the class', function() {
				var TestClass = createWithoutNamespace();
				expect(TestClass).toBeDefined();
				expect(TestClass instanceof Function).toBe(true);
			});
			it('can be instantiated', function() {
				var t = new (createWithoutNamespace())();
				expect(t.value).toBe(42);
			});
		});
	});

	describe('inheriting a class (basic)', function() {
		it('can inherit', function() {
			sooper.define('SuperClass', {
				superVar: 42,
				constructor: function(value) {
					if(arguments.length)
						this.superVar = value;
				},
				superFunc: function() { return this.superVar; },
				commonFunc: function() { return 1; }
			});
			sooper.define('TestClass', {
				inherits: SuperClass,
				subVar: 21,
				constructor: function(value) {
					SuperClass.apply(this,arguments);
					if (arguments.length)
						this.subVar = value + 1;
				},
				subFunc: function() { return this.subVar; },
				commonFunc: function() { return 2; }
			});
			expect(TestClass.prototype.constructor).toBe(SuperClass);
		});

		it('can instantiate without args', function() {
			var test = new TestClass();
			expect(test instanceof TestClass);
			expect(test instanceof SuperClass);
			expect(test.subVar).toBe(21);
			expect(test.subFunc()).toBe(21);
			expect(test.superVar).toBe(42);
			expect(test.superFunc()).toBe(42);
		});

		it('can instantiate with args', function() {
			var test = new TestClass(1);
			expect(test.subVar).toBe(2);
			expect(test.subFunc()).toBe(2);
			expect(test.superVar).toBe(1);
			expect(test.superFunc()).toBe(1);
		});

		it('overrides super class properties', function() {
			var test = new TestClass();
			expect(test.commonFunc()).toBe(2);

			delete TestClass;
			delete SuperClass;
		});
	});

	describe('inheriting a class (advanced)', function() {
		afterEach(function() {
			delete TestClass;
			delete SuperClass;
		});

		it('can call super constructor', function() {
			sooper.define('SuperClass', {
				constructor: function(value) {
					this.testVar1 = value;
				}
			});
			sooper.define('TestClass', {
				inherits: SuperClass,
				constructor: function(value) {
					this.super(value);
					this.testVar2 = value*2;
				}
			});
			var test = new TestClass(42);
			expect(test.testVar1).toBe(42);
			expect(test.testVar2).toBe(84);
		});

		it('can call super function on super class', function() {
			sooper.define('SuperClass', {
				testVar: 1,
				constructor: function() {},
				testFunc: function(value) {
					return this.testVar+value;
				}
			});
			sooper.define('TestClass', {
				inherits: SuperClass,
				constructor: function() {},
				testFunc: function me(value) {
					return me.super.call(this,value) + 1;
				}
			});
			var test = new TestClass();
			expect(test.testFunc(1)).toBe(3);
		});
	});

	describe('implementing interfaces (basic)', function() {
		it('can implement a single interface', function() {
			sooper.define('TestInterface', {
				constructor:function(){},
				interfaceVar: 42,
				interfaceFunc: function(){}
			});
			sooper.define('TestClass', {
				implements: TestInterface,
				constructor: function() {}
			});
			expect(TestClass.prototype.interfaceVar).toBe(42);
			expect(TestClass.prototype.interfaceFunc).toBe(TestInterface.prototype.interfaceFunc);
			delete TestClass;
		});

		it('can implement multiple interfaces', function() {
			sooper.define('TestInterface2', {
				constructor:function(){},
				interface2Var: 21,
				interface2Func: function(){}
			});
			sooper.define('TestClass', {
				implements: [TestInterface,TestInterface2],
				constructor: function() {}
			});
			expect(TestClass.prototype.interfaceVar).toBe(42);
			expect(TestClass.prototype.interfaceFunc).toBe(TestInterface.prototype.interfaceFunc);
			expect(TestClass.prototype.interface2Var).toBe(21);
			expect(TestClass.prototype.interface2Func).toBe(TestInterface2.prototype.interface2Func);
		});

		it('can be instantiated', function() {
			var test = new TestClass();
			expect(test.interfaceVar).toBe(42);
			expect(test.interfaceFunc).toBe(TestInterface.prototype.interfaceFunc);
			expect(test.interface2Var).toBe(21);
			expect(test.interface2Func).toBe(TestInterface2.prototype.interface2Func);

			delete TestClass;
			delete TestInterface2;
			delete TestInterface;
		});
	});

	describe('implementing interfaces (advanced)', function() {
		it('can implement an interface that implements an interface', function() {
			sooper.define('TestInterface1', {
				constructor:function(){},
				interface1Var: 1,
				interface1Func: function(){}
			});
			sooper.define('TestInterface2', {
				implements: TestInterface1,
				constructor:function(){},
				interface2Var: 2,
				interface2Func: function(){}
			});
			sooper.define('TestClass', {
				implements: TestInterface2,
				constructor: function() {}
			});
			expect(TestClass.prototype.interface1Var).toBe(1);
			expect(TestClass.prototype.interface1Func).toBe(TestInterface1.prototype.interface1Func);
			expect(TestClass.prototype.interface2Var).toBe(2);
			expect(TestClass.prototype.interface2Func).toBe(TestInterface2.prototype.interface2Func);
			delete TestClass;
			delete TestInterface2;
			delete TestInterface1;
		});

		it('later interfaces override earlier interfaces', function() {
			sooper.define('TestInterface1', {
				constructor:function(){},
				testVar: 1,
				testFunc: function(){ return 1; }
			});
			sooper.define('TestInterface2', {
				constructor:function(){},
				testVar: 2,
				testFunc: function(){ return 2; }
			});
			sooper.define('TestClass', {
				implements: [TestInterface1,TestInterface2],
				constructor: function() {}
			});
			expect(TestClass.prototype.testVar).toBe(2);
			expect(TestClass.prototype.testFunc).toBe(TestInterface2.prototype.testFunc);
			delete TestClass;
			delete TestInterface2;
			delete TestInterface1;
		});

		it('class properties override interface properties', function() {
			sooper.define('TestInterface', {
				constructor:function(){},
				testVar: 1,
				testFunc: function(){return 1;}
			});
			sooper.define('TestClass', {
				implements: TestInterface,
				testVar: 2,
				testFunc: function(){return 2;},
				constructor: function() {}
			});
			var test = new TestClass();
			expect(test.testVar).toBe(2);
			expect(test.testFunc()).toBe(2);
			delete TestClass;
			delete TestInterface;
		});

		it('can call overriden function on interface via super', function() {
			sooper.define('TestInterface', {
				testVar: 1,
				constructor: function() {},
				testFunc: function(value) {
					return this.testVar+value;
				}
			});
			sooper.define('TestClass', {
				implements: TestInterface,
				constructor: function() {},
				testFunc: function me(value) {
					return me.super.call(this,value) + 1;
				}
			});
			var test = new TestClass();
			expect(test.testFunc(1)).toBe(3);
		});
	});
});

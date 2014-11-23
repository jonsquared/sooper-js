describe('SOOP', function() {
	it('exists', function() {
		expect(soop).toBeDefined();
	});

	describe('defining a class', function() {
		describe('with no members', function() {
			it('can be defined', function() {
				function createClassWithoutConstructor() {
					soop.define('TestClass');
				}
				function createClassWithConstructor() {
					soop.define('TestClass', {
						constructor: function(){}
					});					
				}
				expect(createClassWithoutConstructor).toThrow();
				expect(createClassWithConstructor).not.toThrow();
				expect(window.TestClass).toBeDefined();
				expect(TestClass instanceof Function).toBe(true);			
			});

			it('can be instantiated', function() {
				var test = new TestClass();
				expect(test instanceof Object).toBe(true);
				expect(test instanceof TestClass).toBe(true);
				expect(Object.getOwnPropertyNames(test).length).toBe(0);
				expect(Object.keys(test).length).toBe(0);
			});

			it('can be undefined', function() {
				soop.undefine('TestClass');
				expect(window.TestClass).not.toBeDefined();
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
				soop.define('TestClass', testClassConfig);

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
			});

			it('cleanup', function() {
				soop.undefine('TestClass');
			});
		});
	});

	describe('inheriting a class', function() {
		it('can inherit', function() {
			soop.define('SuperClass', {
				superVar: 42,
				constructor: function(value) {
					if(arguments.length)
						this.superVar = value;
				},
				superFunc: function() { return this.superVar; }
			});
			soop.define('TestClass', {
				inherits: SuperClass,
				subVar: 21,
				constructor: function(value) {
					SuperClass.apply(this,arguments);
					if (arguments.length)
						this.subVar = value + 1;
				},
				subFunc: function() { return this.subVar; }
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
	});
});

describe('SOOP', function() {
	it('exists', function() {
		expect(soop).toBeDefined();
	});

	describe('class', function() {
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
			it('can be defined', function() {
				soop.define('TestClass', {
					constructor: function(value) {
						this.memberVar = value;
					},
					memberVar: 42,
					memberFunc: function() {
						return this.memberVar;
					}
				});

				expect(TestClass.prototype.memberVar).toBe(42);
				expect(TestClass.prototype.memberFunc instanceof Function).toBe(true);
				expect(TestClass.prototype.hasOwnProperty('memberVar')).toBe(true);
				expect(TestClass.prototype.hasOwnProperty('memberFunc')).toBe(true);
			});

			it('can be instantiated', function() {
				var test = new TestClass(21);
				expect(Object.getOwnPropertyNames(test)).toEqual(['memberVar']);
				expect(Object.keys(test)).toEqual(['memberVar']);
				expect(test.memberVar).toBe(21);
				expect(test.memberFunc()).toBe(21);
			});

			it('can be undefined', function() {
				soop.undefine('TestClass');
				expect(window.TestClass).not.toBeDefined();
			});
		});
	});
});
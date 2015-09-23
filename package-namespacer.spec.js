describe('PackageNamespacer', function() {
	it('should be a function', function() {
		assert.isFunction(PackageNamespacer,
			'is not a function');
	});
});

describe('PackageNamespacer instance', function() {
	var instance;
	beforeAll(function() {
		instance = new PackageNamespacer('foo-namespace');
	});
	it('.get()', function() {
		assert.equal(instance.get(), 'foo-namespace',
			'did not return namespace');
	});
	it('implied .toString()', function() {
		assert.equal(instance + '', 'foo-namespace',
			'did not return namespace');
	});
	it('.error() with name', function() {
		assert.equal(instance.error('some-error'), 'foo-namespace::some-error',
			'did not return namespaced error');
	});
	it('.makeError() with name, reason and details', function() {
		var result = instance.makeError('some-error', 'reason', 'details');
		assert.instanceOf(result, Meteor.Error,
			'did not construct Meteor.Error()');
		assert.equal(result.error, 'foo-namespace::some-error',
			'did not set the .error as namespaced error');
		assert.equal(result.reason, 'reason',
			'did not set the .reason');
		assert.equal(result.details, 'details',
			'did not set the .details');
	});
	it('.action() with name', function() {
		assert.equal(instance.action('some-action'), 'foo-namespace/some-action',
			'did not return namespaced action');
	});

	it('.makeMethods() with name and function', function() {
		var method = function() { };
		var result = instance.makeMethods('some-action', method);
		assert.deepEqual(result, { "foo-namespace/some-action": method },
			'did not return expected methods object');
	});
	it('.makeMethods() with object', function() {
		var method1 = function() { };
		var method2 = function() { };
		var result = instance.makeMethods({
			action1: method1,
			action2: method2
		});
		assert.deepEqual(result, { "foo-namespace/action1": method1, "foo-namespace/action2": method2 },
			'did not return expected methods object');
	});
	it('.makeMethods() with array', function() {
		var method1 = function() { };
		var method2 = function() { };
		var result = instance.makeMethods([
			'some-action', method1,
			'other-action', method2
		]);
		assert.deepEqual(result, { "foo-namespace/some-action": method1, "foo-namespace/other-action": method2 },
			'did not return expected methods object');
	});
	it('.makeMethods() with name and non-function', function() {
		assert.throws(function() {
			instance.makeMethods('action', 'invalid');
		}, Meteor.Error, 'package-namespacer::invalid-function');
	});
	it('.makeMethods() with object having non-function', function() {
		assert.throws(function() {
			instance.makeMethods({ action: "invalid" });
		}, Meteor.Error, 'package-namespacer::invalid-function');
	});
	it('.makeMethods() with array having non-function', function() {
		assert.throws(function() {
			instance.makeMethods([ 'action', 'invalid' ]);
		}, Meteor.Error, 'package-namespacer::invalid-function');
	});
	it('.makeMethods() with array having wrong number of arguments', function() {
		assert.throws(function() {
			instance.makeMethods([ 'action' ]);
		}, Meteor.Error, 'package-namespacer::invalid-array');
	});

	it('instantiated with non-string', function() {
		assert.throws(function() {
			new PackageNamespacer({});
		}, Meteor.Error, 'package-namespacer::invalid-namespace',
			'did not throw Meteor.Error() with namespaced error code');
	});
});

describe('PackageNamespacer.makeFor()', function() {
	it('when called with object and namespace', function() {
		var pkg = {};

		var result = PackageNamespacer.makeFor(pkg, 'foo-namespace');

		assert.instanceOf(pkg.__ns__, PackageNamespacer,
			'did not set .__ns__ as instance of PackageNamespacer');
		assert.equal(pkg.__ns__ + '', 'foo-namespace',
			'did not set the namespace on the instance');
		assert.equal(pkg.__ns__, result,
			'did not return the instance');
	});
	it('when called with function and namespace', function() {
		var pkg = function() {};
		PackageNamespacer.makeFor(pkg, 'foo-namespace');
		assert.instanceOf(pkg.__ns__, PackageNamespacer,
			'did not set .__ns__ as instance of PackageNamespacer');
		assert.equal(pkg.__ns__ + '', 'foo-namespace',
			'did not set the namespace on the instance');
	});
	it('when called with object, namespace and key', function() {
		var pkg = {};
		PackageNamespacer.makeFor(pkg, 'foo-namespace', 'ns');
		assert.instanceOf(pkg.ns, PackageNamespacer,
			'did not set key on object as instance of PackageNamespacer');
	});
	it('when called with string and namespace', function() {
		assert.throws(function() {
			PackageNamespacer.makeFor('invalid', 'foo-namespace');
		}, Meteor.Error, 'package-namespacer::invalid-package');
	});
	it('when called with number and namespace', function() {
		assert.throws(function() {
			PackageNamespacer.makeFor(10, 'foo-namespace');
		}, Meteor.Error, 'package-namespacer::invalid-package');
	});
	it('when called with boolean and namespace', function() {
		assert.throws(function() {
			PackageNamespacer.makeFor(true, 'foo-namespace');
		}, Meteor.Error, 'package-namespacer::invalid-package');
	});
	it('when called with object, namespace and non-string key', function() {
		assert.throws(function() {
			PackageNamespacer.makeFor({}, 'foo-namespace', []);
		}, Meteor.Error, 'package-namespacer::invalid-key');
	});
	it('when called with object, namespace and pre-existing key', function() {
		assert.throws(function() {
			PackageNamespacer.makeFor({ __ns__: undefined }, 'foo-namespace', []);
		}, Meteor.Error, 'package-namespacer::invalid-key');
	});
});

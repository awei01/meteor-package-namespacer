'use strict';

PackageNamespacer = function(namespace) {
	if (!_.isString(namespace)) {
		throwError('invalid-namespace', 'Invalid namespace provided', 'The namespace should be a string but was [' + typeof namespace + ']');
	}
	this.__namespace__ = namespace;
};
PackageNamespacer.makeFor = function(object, namespace, key) {
	if (!_.isObject(object)) {
		throwError('invalid-package', 'Invalid package provided', 'Cannot create PackageNamespacer instance on [' + typeof object + ']');
	}
	key = key || '__ns__';
	if (!_.isString(key)) {
		throwError('invalid-key', 'Invalid key provided', 'Cannot create PackageNamespacer instance on key of type [' + typeof key + ']');
	}
	if (_.has(object, key)) {
		throwError('invalid-key', 'Key already in use', 'The key [' + key + '] is already defined');
	}
	return object[key] = new PackageNamespacer(namespace);
};

function throwError(code, reason, details) {
	var error = 'package-namespacer::' + code;
	throw new Meteor.Error(error, reason, details);
};

var __prototype = {
	get: function() {
		return this.__namespace__;
	},
	toString: function() {
		return this.get();
	},
	error: function(name) {
		return this.get() + '::' + name;
	},
	makeError: function(name, reason, details) {
		var error = this.error(name);
		return new Meteor.Error(error, reason, details);
	},
	action: function(name) {
		return this.get() + '/' + name;
	},
	makeMethods: function(name, method) {
		var result;
		switch (true) {
			case _.isString(name):
				result = {};
				mapMethodToObject(result, this.action(name), method);
				break;
			case _.isArray(name):
				result = makeMethodsFromArray.call(this, name);
				break;
			default:
				result = makeMethodsFromObject.call(this, name);
		}
		return result;
	},
}
function mapMethodToObject(object, name, method) {
	if (!_.isFunction(method)) {
		throwError('invalid-function', 'Invalid function provided', 'Expected a function but got a [' + typeof method + ']');
	}
	object[name] = method;
};
function makeMethodsFromArray(methods) {
	var result = {},
		i = 0, len = methods.length;
	if (len % 2 !== 0) {
		throwError('invalid-array', 'Invalid array method map', 'The method map should have an even number of arguments');
	}
	for (i; i < len; i += 2) {
		mapMethodToObject(result, this.action(methods[i]), methods[i + 1]);
	}
	return result;
};
function makeMethodsFromObject(methods) {
	var result = {}, k;
	for (k in methods) {
		mapMethodToObject(result, this.action(k), methods[k]);
	}
	return result;
}


_.extend(PackageNamespacer.prototype, __prototype);

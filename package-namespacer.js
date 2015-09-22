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
	object[key] = new PackageNamespacer(namespace);
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
}
_.extend(PackageNamespacer.prototype, __prototype);

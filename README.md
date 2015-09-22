# PackageNamespacer

This is a package to help with managing namespaces in your packages in an opinionated fashion.

## Motivation

This is an attempt to reduce boilerplate namespacing code in package development. It will allow for namespacing `Meteor.Error` and `Meteor.methods`.

## Usage

Suppose you're creating a new `Foo` package. In your package's `package.js`:

```
Package.onUse(function(api) {
	// other code
	api.use('awei01:package-namespacer');

	// you can create your global Foo export inline here
	Foo = {};
	PackageNamespacer.makeFor(Foo, 'foo-namespace');

	// include other files
	// your files will now have access to the global variable Foo

	api.export('Foo');
});
```

## API

### `void` PackageNamespacer.makeFor(`object|function` object, `string` namespace, [`string` key]) ###

Add a namespace helper to your package. By default, the property key for the `PackageNamespacer` instance will be `.__ns__`.

```
Foo = {};
PackageNamespacer.makeFor(Foo, 'foo-namespace`);
/*
console.log(Foo);
{ __ns__: (instance of PackageNamespacer) }
*/

### `instance` PackageNamespacer(`string` namespace) ###

Create an instance of the `PackageNamespacer` with the `name`

```
var ns = new PackageNamespacer('foo-namespace');
```

## PackageNamespacer instance API ##

### `string` .get() ###
Get the `name` of this instance.

```
var ns = new PackageNamespacer('foo-namespace');
/*
console.log(ns.get());
"foo-namespace"
*/
```

### `string` .toString() ###
Same as `.get()` but can be used when cast to string
```
var ns = new PackageNamespacer('foo-namespace');
/*
console.log(ns);
"foo-namespace"
*/

### `string` .error(`string` name) ###
Create a namespaced error name.

```
var ns = new PackageNamespacer('foo-namespace');
/*
console.log(ns.error('some-error'));
"foo-namespace::some-error"
*/
```

### `Meteor.Error` .makeError(`string` code, [`string` reason], [`string` details]) ###
Returns an instance of `Meteor.Error` with the namespaced code, reason and details.

```
var ns = new PackageNamespacer('foo-namespace');
var error = ns.makeError('some-error, 'Some error occurred', 'Some detailed error message');
```

### `string` .action(`string` name) ###
Create a namespaced action name. Useful for creating namespaced `Meteor.methods`.

```
var ns = new PackageNamespacer('foo-namespace');
/*
console.log(ns.action('some-action'));
"foo-namespace/some-action"
*/
```

## Contribution
PR's suggestions, bugs welcome. Please add unit tests when creating a PR.

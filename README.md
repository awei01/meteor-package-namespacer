# PackageNamespacer

This is a package to help with managing namespaces in your packages in an opinionated fashion. https://atmospherejs.com/awei01/package-namespacer

## Motivation

This is an attempt to reduce boilerplate namespacing code in package development. It will allow for namespacing `Meteor.Error` and `Meteor.methods`.

## Usage

Suppose you're creating a new `Foo` package. In your package's `package.js`:

```
Package.onUse(function(api) {
	// other code
	api.use('awei01:package-namespacer');
	// still other code

	// include our files
	api.addFiles('foo.js');

	// export the variable
	api.export('Foo');
});
```

Then, in your package definition code (`foo.js`):
```
Foo = {};
PackageNamespacer.makeFor(Foo, 'foo-namespace');
// will yield { __ns__: (instance of PackageNamespacer )}

// or

Foo = {};
Foo.myNSKey = new PackageNamespacer('foo-namespace');
// will yield { myNSKey: (instance of PackageNamespacer )}

```

## API

### `instance` PackageNamespacer.makeFor(`object|function` object, `string` namespace, [`string` key]) ###

Add a namespace helper to your package. By default, the property key for the `PackageNamespacer` instance will be `.__ns__`.

```
Foo = {};
var ns = PackageNamespacer.makeFor(Foo, 'foo-namespace`);
/*
console.log(Foo);
{ __ns__: (instance of PackageNamespacer) }
*/
```

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
```

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

### `object` .makeMethods(`string|object|array` name, [`function` method]) ###
Returns an object that can be passed to `Meteor.methods()`. It will prefix each method name with the instance's namespace using `.action()` method.

```
var ns = new PackageNamespacer('foo-namespace');
var methods = ns.makeMethods('barMethod', doBarMethod);
/*
console.log(methods);
{ "foo-namespace/barMethod": doBarMethod }
*/

var methods = ns.makeMethods({
	barMethod: doBarMethod,
	bazMethod: doBazMethod
});
/*
console.log(methods);
{
	"foo-namespace/barMethod": doBarMethod,
	"foo-namespace/bazMethod": doBazMethod
}
*/

var methods = ns.makeMethods([
	'bar-method', doBarMethod,
	'baz-method', doBazMethod
]);
/*
console.log(methods);
{
	"foo-namespace/bar-method": doBarMethod,
	"foo-namespace/baz-method": doBazMethod
}
*/
```


## Contribution
PR's suggestions, bugs welcome. Please add unit tests when creating a PR.

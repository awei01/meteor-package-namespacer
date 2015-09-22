Package.describe({
  name: 'awei01:package-namespacer',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'A namespace helper for Meteor packages',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/awei01/meteor-package-namespacer.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('underscore');
  api.addFiles('package-namespacer.js');
  api.export('PackageNamespacer');
});

Package.onTest(function(api) {
  api.use('practicalmeteor:munit');
  api.use('awei01:package-namespacer');
  api.addFiles('package-namespacer.spec.js');
});

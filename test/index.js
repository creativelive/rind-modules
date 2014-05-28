'use strict';

var test = require('tape');
var rindModules = require('..');
var rimraf = require('rimraf').sync;
var path = require('path');
var fs = require('fs');

var expected = [
  'assets/img/aaa/bbb/file.txt',
  'assets/img/ccc/file.txt',
  'lib/aaa/bbb/file.txt',
  'templates/aaa/bbb/file.txt',
  'templates/ccc/file.txt'
];

var opts = {
  input: __dirname,
  output: path.join(__dirname, 'output'),
  anatomy: {
    lib: true,
    templates: true,
    assets: {
      sub: true
    }
  },
  verbose: true
};

test('builds symlinks tree', function(t) {
  rimraf(opts.output);
  t.plan(5);

  rindModules(opts);
  console.log('');
  expected.forEach(function(file) {
    t.equal(fs.existsSync(path.join(opts.output, file)), true);
  });

});

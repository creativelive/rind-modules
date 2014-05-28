'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

function findModule(part, anatomy) {
  var split = part.split('/');
  var splitLen = split.length;
  var i, modDirIndex, mod = {};

  mod.subAnatomy = '';
  mod.container = '';
  for (i = 0; i < splitLen; i++) {
    // need to know where the containing "modules" directory is so that we
    // can figure out what (if any) sub-dirs exist above the module.mod
    if (split[i] === 'modules') {
      modDirIndex = i + 1;
    }
    if (split[i].slice(-4) === '.mod') {
      mod.name = split[i].slice(0, -4);
      mod.container = [].concat(split).splice(modDirIndex, (i - modDirIndex)).join('/');
    } else if (anatomy[split[i]]) {
      mod.anatomy = split[i];
      if (anatomy[split[i]].sub) {
        mod.subAnatomy = split[(i + 1)];
      }
      mod.path = split.splice(0, i).join('/');
      break;
    }
  }

  if (mod.name && mod.anatomy) {
    return mod;
  }
  return false;
}

module.exports = function setupModules(opts) {
  function log() {
    if (opts.verbose) {
      var msg = Array.prototype.splice.call(arguments, 0);
      console.log(msg.join(' '));
    }
  }

  opts.anatomy = opts.anatomy || {};
  var cwd = process.cwd();
  opts.input = opts.input || cwd;
  opts.output = opts.output || cwd;
  opts.src = 'modules/**/*.mod/**/*.*';
  var parts = glob.sync(opts.src, {
    cwd: opts.input
  });
  var mod, dstPath, srcPath, linkPath;

  parts.forEach(function(part) {
    mod = findModule(part, opts.anatomy);
    if (!mod) {
      log('skipping non-module: ' + part);
      return;
    }

    dstPath = path.join(opts.output, mod.anatomy, mod.subAnatomy, mod.container, mod.name);
    srcPath = path.join(opts.input, mod.path, mod.anatomy, mod.subAnatomy);
    linkPath = path.relative(path.dirname(dstPath), srcPath);

    log();
    log('      file:', path.resolve(opts.input, part));
    log('      part:', part);
    log('    module:', mod.name);
    log('   anatomy:', mod.anatomy);
    log('subAnatomy:', mod.subAnatomy);
    log('modulePath:', mod.path);
    log('   srcPath:', srcPath);
    log('   dstPath:', dstPath);
    log('  linkPath:', linkPath);

    if (fs.existsSync(dstPath)) {
      log('pre-exists:', dstPath);
      if (opts.rm) {
        log('  removing:', dstPath);
        rimraf.sync(dstPath);
      }
    }
    // create parent directory if it doesn't exist
    if (!fs.existsSync(path.dirname(dstPath))) {
      mkdirp.sync(path.dirname(dstPath));
    }
    // create the symlink
    if (!fs.existsSync(dstPath)) {
      log(dstPath + ' >> ' + linkPath);
      fs.symlinkSync(linkPath, dstPath, 'dir');
    }
    log();
  });
};

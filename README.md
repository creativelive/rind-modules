# Rind Modules [![](https://travis-ci.org/creativelive/rind-modules.png)](https://travis-ci.org/creativelive/rind-modules)

Build a symlink tree to turn a module-based file hierarchy into an entity based one

```
├── modules  // input directory
│   ├── aaa
│   │   └── bbb.mod
│   │       ├── assets
│   │       │   └── img
│   │       │       └── file.txt
│   │       ├── lib
│   │       │   └── file.txt
│   │       └── templates
│   │           └── file.txt
│   └── ccc.mod
│       ├── assets
│       │   └── img
│       │       └── file.txt
│       └── templates
│           └── file.txt
└── output  // output directory
    ├── assets
    │   └── img
    │       ├── aaa
    │       │   └── bbb -> ../../../../modules/aaa/bbb.mod/assets/img
    │       └── ccc -> ../../../modules/ccc.mod/assets/img
    ├── lib
    │   └── aaa
    │       └── bbb -> ../../../modules/aaa/bbb.mod/lib
    └── templates
        ├── aaa
        │   └── bbb -> ../../../modules/aaa/bbb.mod/templates
        └── ccc -> ../../modules/ccc.mod/templates
```

Modules are identified by having a `.mod` extension on their directory. Modules cannot
be nested inside eachother, but can be nested inside a directory tree to allow
grouping of related modules. For example:

```
modules/
  user/
    login.mod ...
    signup.mod ...
```

## Usage

```
var rindModules = require('rind-modules');

rindModules({
  input: __dirname,
  output: __dirname + '/output',
  // rm: true, // use with caution - deletes any existing targets in the output directory
  verbose: true
});
```

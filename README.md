# hints.js

# Tools for parsing hint comments in Javascript code

## Current status

[![NPM version](https://img.shields.io/npm/v/hints.svg)](https://www.npmjs.com/package/hints)
[![Build Status](https://img.shields.io/travis/overlookmotel/hints/master.svg)](http://travis-ci.org/overlookmotel/hints)
[![Dependency Status](https://img.shields.io/david/overlookmotel/hints.svg)](https://david-dm.org/overlookmotel/hints)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/hints.svg)](https://david-dm.org/overlookmotel/hints)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/hints/master.svg)](https://coveralls.io/r/overlookmotel/hints)

## Usage

Parses Javascript code for hint comments.

#### `hints(code, identifier [, options])`

```js
function x(a, b) {
    // testhint a:1 b.c:2 b.d e
}

var hints = require('hints');
var h = hints(x.toString(), 'testhint');
// h = {a: 1, b: {c: 2, d: true}, e: true}
```

Hints can be separated with spaces or commas.

Both these are equivalent:

```js
// testhint a:1 b.c:2 b.d e
// testhint a:1, b.c:2, b.d, e
```

#### `hints.full(code, identifier)`

Uses [acorn](https://www.npmjs.com/package/acorn) internally to parse the code. You can get the AST (abstract syntax tree) returned too.

```js
function x(a, b) {
    // testhint a:1
}

var result = hints.full(x.toString(), 'testhint');
// result.hints = {a: 1}
// result.hintsPos = {a: {value: 1, start: 20, end: 36}}
// result.tree = { /* AST */ }
```

### Options

#### `pos`

Returns character positions of the comments with the hints.
Default: `false`

```js
function x(a, b) {
    // testhint a:1
}

var h = hints(x.toString(), 'testhint', {pos: true});
// h = {a: {value: 1, start: 20, end: 36}}
```

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/hints/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/hints/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README

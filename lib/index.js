// --------------------
// hints module
// --------------------

// modules
var acorn = require('acorn'),
    _ = require('lodash');

// exports
var hints = function(code, identifier, options) {
    // conform options
    options = _.extend({pos: false}, options);

    // return hints
    return parse(code, identifier)[options.pos ? 'hintsPos' : 'hints'];
};

var Pos = hints.Pos = function(value, start, end) {
    this.value = value;
    this.start = start;
    this.end = end;
};

hints.full = function(code, identifier) {
    // return hints
    return parse(code, identifier);
};

function parse(code, identifier) {
    // if code is an anonymous function statement, turn into expression to avoid acorn error
    var offset = 0;
    if (code.match(/^function\s*\*?\s*\(/)) {
        code = 'x=' + code;
        offset = 2;
    }

    // parse code with acorn, extracting comments
    var comments = [];
    var tree = acorn.parse(code, {onComment: comments});

    // extract hints from comments
    var hints = {},
        hintsPos = {};

    comments.forEach(function(comment) {
        // deal with single-line comments
        if (comment.type == 'Line') return parseLine(comment.value, comment.start - offset, comment.end - offset + 1);

        // deal with multi-line comments
        comment.value.split(/[\n\r]+/).forEach(function(str) {
            parseLine(str, comment.start - offset, comment.end - offset);
        });
    });

    // adjust all positions if options.function set to adjust for offset
    if (offset) adjust(tree);

    // return result
    return {tree: tree, hints: hints, hintsPos: hintsPos};

    // parsing function
    function parseLine(str, start, end) { // jshint ignore:line
        // check is hint comment
        var match = str.match(new RegExp('^[\\s\\*]*' + identifier + '\\s+(.+?)\\s*$'));
        if (!match) return;

        // get all statements
        var statements = match[1].split(/[\s,]+/);

        statements.forEach(function(statement) {
            var parts = statement.split(':', 2),
                name = parts[0],
                value = (parts.length === 1 ? true : parts[1]);

            _.set(hints, name, value);
            _.set(hintsPos, name, new Pos(value, start, end));
        });
    }

    // walk through AST, adjusting position of all elements by 2
    function adjust(tree) {
        tree.body[0] = tree.body[0].expression.right;
        tree.end = tree.end - offset;
        tree.body = adjustPos(tree.body);
    }

    function adjustPos(node) {
        if (Array.isArray(node)) return node.map(adjustPos);
        if (_.isObject(node)) {
            node = _.mapValues(node, adjustPos);
            if (node.start !== undefined) node.start -= offset;
            if (node.end !== undefined) node.end -= offset;
        }
        return node;
    }
}

module.exports = hints;

// --------------------
// hints module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	hints = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

describe('hints()', function() {
	describe('Single-line comments', function() {
		var comment1 = '//  testhint a.b:1, c:3 d \t\n',
			comment2 = '//   testhint e\n';
		var code = 'function x(a, b) {\n' +
			'\t' + comment1 +
			'  ' + comment2 +
			'}';

		it('finds hints', function() {
			var res = hints(code, 'testhint');

			expect(res).to.deep.equal({ a: { b: '1' }, c: '3', d: true, e: true });
		});

		it('pos option', function() {
			var res = hints(code, 'testhint', {pos: true});

			expect(code.slice(res.a.b.start, res.a.b.end)).to.equal(comment1);
			expect(code.slice(res.c.start, res.c.end)).to.equal(comment1);
			expect(code.slice(res.d.start, res.d.end)).to.equal(comment1);
			expect(code.slice(res.e.start, res.e.end)).to.equal(comment2);
		});
	});

	describe('Multi-line comments', function() {
		var comment1 = '/*testhint a.b:1 , c:3 \t \n' +
			' * foo foo \n' +
			' *\t  *testhint d\n' +
			' */';
		var comment2 = '/*testhint e*/';
		var code = 'function x(a, b) {\n' +
			comment1 + '\n' +
			comment2 + 'alert(); // foo\n' +
			'}';

		it('finds hints', function() {
			var res = hints(code, 'testhint');

			expect(res).to.deep.equal({ a: { b: '1' }, c: '3', d: true, e: true });
		});

		it('pos option', function() {
			var res = hints(code, 'testhint', {pos: true});

			expect(code.slice(res.a.b.start, res.a.b.end)).to.equal(comment1);
			expect(code.slice(res.c.start, res.c.end)).to.equal(comment1);
			expect(code.slice(res.d.start, res.d.end)).to.equal(comment1);
			expect(code.slice(res.e.start, res.e.end)).to.equal(comment2);
		});
	});

	describe('Anonymous function/class statements', function() {
		it('functions', function() {
			var comment1 = '// testhint a\n';
			var code = 'function (a, b) {\n' + comment1 + '}';

			var res = hints.full(code, 'testhint', {pos: true});

			expect(res.hints).to.deep.equal({a: true});
			expect(res.hintsPos).to.be.ok;
			expect(code.slice(res.hintsPos.a.start, res.hintsPos.a.end)).to.equal(comment1);
			expect(res.tree).to.be.ok;
			expect(res.tree.body).to.be.ok;
		});

		it('generators', function() {
			var comment1 = '// testhint a\n';
			var code = 'function* (a, b) {\n' + comment1 + '}';

			var res = hints.full(code, 'testhint', {pos: true});

			expect(res.hints).to.deep.equal({a: true});
			expect(res.hintsPos).to.be.ok;
			expect(code.slice(res.hintsPos.a.start, res.hintsPos.a.end)).to.equal(comment1);
			expect(res.tree).to.be.ok;
			expect(res.tree.body).to.be.ok;
		});

		it('classes', function() {
			var comment1 = '// testhint a\n';
			var code = 'class {\n' + comment1 + '}';

			var res = hints.full(code, 'testhint', {pos: true});

			expect(res.hints).to.deep.equal({a: true});
			expect(res.hintsPos).to.be.ok;
			expect(code.slice(res.hintsPos.a.start, res.hintsPos.a.end)).to.equal(comment1);
			expect(res.tree).to.be.ok;
			expect(res.tree.body).to.be.ok;
		});
	});
});

describe('hints.full()', function() {
	it('returns hints, hintsPos and tree', function() {
		var comment1 = '// testhint a\n';
		var code = 'function x(a, b) {\n' + comment1 + '}';

		var res = hints.full(code, 'testhint');

		expect(res.hints).to.deep.equal({a: true});
		expect(res.hintsPos).to.be.ok;
		expect(code.slice(res.hintsPos.a.start, res.hintsPos.a.end)).to.equal(comment1);
		expect(res.tree).to.be.ok;
		expect(res.tree.body).to.be.ok;
	});
});

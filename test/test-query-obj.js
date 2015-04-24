'use strict';
var tape = require('tape');
var got = require('../');
var server = require('./server.js');
var s = server.createServer();
var urlLib = require('url');
var objectAssign = require('object-assign');

s.on('/?foo=bar', function (req, res) {
	res.end(req.url);
});

tape('setup', function (t) {
	s.listen(s.port, function () {
		t.end();
	});
});

tape('Should support query object', function (t) {
	var opts = objectAssign(urlLib.parse(s.url), {
		query: {
			foo: 'bar'
		}
	});
	got(opts, function (err, data) {
		t.equal(data, '/?foo=bar');
		t.end();
	});
});

tape('Should support query string', function (t) {
	var opts = objectAssign(urlLib.parse(s.url), {
		query: 'foo=bar'
	});
	got(opts, function (err, data) {
		t.equal(data, '/?foo=bar');
		t.end();
	});
});

tape('Query should have priority over path', function (t) {
	var opts = objectAssign(urlLib.parse(s.url), {
		query: {foo: 'bar'},
		path: '/?foo=zot'
	});
	got(opts, function (err, data) {
		t.equal(data, '/?foo=bar');
		t.end();
	});
});

tape('Should not fail if path was omitted', function (t) {
	var opts = objectAssign(urlLib.parse(s.url), {
		query: {foo: 'bar'}
	});

	delete opts.path;

	got(opts, function (err, data) {
		t.equal(data, '/?foo=bar');
		t.end();
	});
});

tape('cleanup', function (t) {
	s.close();
	t.end();
});

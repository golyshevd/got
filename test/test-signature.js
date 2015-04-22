'use strict';
var tape = require('tape');
var got = require('../');
var server = require('./server.js');
var s = server.createServer();
var urlLib = require('url');
var objectAssign = require('object-assign');

s.on('/', function (req, res) {
	res.end('ok');
});

s.on('/timeout10', function (req, res) {
	setTimeout(function () {
		res.end('ok');
	}, 10);
});

tape('setup', function (t) {
	s.listen(s.port, function () {
		t.end();
	});
});


tape('String url, Object opts, Function, cb', function (t) {
	got(s.url + 'timeout10', {timeout: 0}, function (err) {
		t.ok(err);
		t.end();
	});
});

tape('String url, null opts, Function, cb', function (t) {
	got(s.url, null, function (err, data) {
		t.equal(data, 'ok');
		t.end();
	});
});

tape('Object url, Function, cb', function (t) {
	got(objectAssign(urlLib.parse(s.url + 'timeout10'), {timeout: 0}), function (err) {
		t.ok(err);
		t.end();
	});
});

tape('cleanup', function (t) {
	s.close();
	t.end();
});

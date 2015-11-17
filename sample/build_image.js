var SakuraCloud = require('../');

var sakuraCloud = new SakuraCloud({
	  accessToken        : 'dd308de3-717e-4d2f-b1fa-797a8616595e',
	  accessTokenSecret  : 'oV6mr7McyWDXS1P49dZZXY6eOp9Pbh9kMTgRKd5FLnzKjLNJbRKQczd3e1V1jYOx',
});

var server = sakuraCloud.server('aaa');
server.create(function(err, result) {
	console.log('create', err, result);
	server.createInterface(function(err) {
		server.sharedInterface(function(err) {
			server.powerOn(function(err) {
				console.log('power on')
				setTimeout(function() {
					server.terminate(function(err, result) {
						console.log(err, result);
					});
				}, 20 * 1000)
			});
		});
	});
});

/*
client.createRequest({
  method: 'GET',
  path  : 'server'
}).send(function(err, result) {
  if (err) throw new Error(err);
  console.log( result.response.servers.map(function(s) {return s.name;}) );
});
*/
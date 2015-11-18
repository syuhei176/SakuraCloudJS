var SakuraCloud = require('../');

var sakuraCloud = new SakuraCloud({
	zone : 'is1a',
	accessToken        : process.env.SAKURA_TOKEN,
	accessTokenSecret  : process.env.SAKURA_SECRET
});

var server = sakuraCloud.server('aaa');
server.create(function(err, result) {
	console.log('create', err);
	server.createInterface(function(err) {
		server.sharedInterface(function(err) {
			server.powerOn(function(err) {
				console.log('power on', err);
				server.powerOff(function(err, result) {
					console.log('power off', err);
					server.terminate(function(err, result) {
						console.log(err, result);
					});
				});
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
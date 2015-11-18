var SakuraCloud = require('../');

var sakuraCloud = new SakuraCloud({
	zone : 'is1a',
	accessToken        : process.env.SAKURA_TOKEN,
	accessTokenSecret  : process.env.SAKURA_SECRET
});

var server = sakuraCloud.server('Test Server');
server.create(function(err, result) {
	console.log('create', err);
	server.createInterface(function(err) {
		server.sharedInterface(function(err) {
			server.powerOn(function(err) {
				console.log('power on', err);
			});
		});
	});
});


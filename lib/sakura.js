var sacloud = require('sacloud');


function SakuraCloud(options) {
	var zone = options.zone || 'is1a';
	sacloud.API_ROOT = 'https://secure.sakura.ad.jp/cloud/zone/'+zone+'/api/cloud/1.1/';
	this.client = sacloud.createClient({
		accessToken : options.accessToken,
		accessTokenSecret: options.accessTokenSecret,
		disableLocalizeKeys: false,
		debug              : false
	});
}

SakuraCloud.prototype.server = function(name) {
	return new Server(this, name);
}

function Server(sakuraCloud, name) {
	this.sakuraCloud = sakuraCloud;
	this.name = name;
	this.id = null;
	this.interfaces = [];
}

Server.prototype.createInterface = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'POST',
		path  : 'interface',
		body  : {
			"Interface":{
			    "Server":{
			      "ID":this.id
			    }
			}
		}
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		that.interfaces.push({id:result.response.interface.id});
		cb(null, result.response);
	});
}

Server.prototype.sharedInterface = function(cb) {
	var that = this;
	if(this.interfaces.length <= 0) throw new Error('Must be called createInterface at least once.');
	var request = this.sakuraCloud.client.createRequest({
		method: 'PUT',
		path  : 'interface/'+this.interfaces[0].id+'/to/switch/shared',
		body  : {}
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, result.response);
	});
}

Server.prototype.create = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'POST',
		path  : 'server',
		body  : {
			Server: {
				ServerPlan : { ID: 1001 },
				Name       : this.name,
				Description: this.name + ':' + new Date().toString(),
				Tags       : ['test']
			}
		}
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		that.id = result.response.server.id;
		cb(null, result.response);
	});
}


Server.prototype.waitUp = function(cb) {
	this.waitStatus('up', cb);
}

Server.prototype.waitDown = function(cb) {
	this.waitStatus('down', cb);
}


Server.prototype.waitStatus = function(status, cb) {
	var that = this;
	this.powerStatus(function(err, result) {
		if(result.instance.status == status) {
			cb(null);
		}else{
			setTimeout(function() {
				that.waitStatus(status, cb);
			}, 10 * 1000);
		}
	});
}

Server.prototype.powerStatus = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'GET',
		path  : 'server/'+this.id+'/power'
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, result.response);
	});
}

Server.prototype.powerOn = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'PUT',
		path  : 'server/'+this.id+'/power'
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		that.waitUp(function() {
			cb(null, result.response);
		});
	});
}

Server.prototype.powerOff = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'DELETE',
		path  : 'server/'+this.id+'/power',
		body : {
			Force : true
		}
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		that.waitDown(function() {
			cb(null, result.response);
		});
	});
}


Server.prototype.terminate = function(cb) {
	var request = this.sakuraCloud.client.createRequest({
		method: 'DELETE',
		path  : 'server/' + this.id
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, result.response);
	});
}

module.exports = SakuraCloud;
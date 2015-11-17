var sacloud = require('sacloud');

sacloud.API_ROOT = 'https://secure.sakura.ad.jp/cloud/zone/is1a/api/cloud/1.1/';

function SakuraCloud(options) {
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
		cb(result.response);
	});
}

Server.prototype.sharedInterface = function(cb) {
	var that = this;
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
		cb(result.response);
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
		cb(result.response);
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
		cb(result.response);
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
		cb(result.response);
	});
}

Server.prototype.powerOff = function(cb) {
	var that = this;
	var request = this.sakuraCloud.client.createRequest({
		method: 'DELETE',
		path  : 'server/'+this.id+'/power'
	});
	request.send(function(err, result) {
		if(err) {
			cb(err);
			return;
		}
		cb(result.response);
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
		cb(result.response);
	});
}

module.exports = SakuraCloud;
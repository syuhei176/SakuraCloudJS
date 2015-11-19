

## How To Use


1. さくらのクラウドの設定画面でAPIキーを発行する。


2. 以下のコマンドでサンプルを動作させることができる。

```
SAKURA_TOKEN={ACCESS TOKEN} SAKURA_SECRET={ACCESS TOKEN SECRET} node sample/poweron_and_off.js
```


## API

```
//zone -> is1a, is1b or th1a
var sakuraCloud = new SakuraCloud({
	zone : 'is1a',
	accessToken        : {Access Token},
	accessTokenSecret  : {Access Token Secret}
});

var server = sakuraCloud.server('server name');

//サーバの作成
server.create(function(err, result) {
	//電源ON
	server.powerOn(function(err) {
		//電源OFF
		server.powerOff(function(err, result) {
			//削除
			server.terminate(function(err, result) {
			});
		});
	});
});

```
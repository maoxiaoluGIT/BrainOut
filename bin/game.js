if ((typeof swan !== 'undefined') && (typeof swanGlobal !== 'undefined')) {
	require("swan-game-adapter.js");
	require("libs/laya.bdmini.js");
} else if (typeof wx!=="undefined") {
	require("weapp-adapter.js");
	require("libs/laya.wxmini.js");
}
else if (typeof qq!=="undefined") {
	require("weapp-adapter.js");
	require("libs/laya.qqmini.js");
}
window.JSZip = require("jszip.min.js");
window.loadLib = require;
require("index.js");
import GameConfig from "./GameConfig";
import Game from "./core/Game";
import GM from "./main/GM";
import HomeLoading from "./main/HomeLoading";
import InitView from "./main/InitView";

class Main {
	constructor() {
		//根据IDE设置初始化引擎
		Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		// Laya.stage.alignV = GameConfig.alignV;
		// Laya.stage.alignH = GameConfig.alignH;
		Laya.stage.bgColor = "#ffffff";
		Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		if (GameConfig.stat) Laya.Stat.show();

		GM.log("code version:" + GM.codeVer);
		GM.log("res version:" + GM.resVer);

		if(Laya.Browser.window.qq)
		{
			Laya.Browser.window.qq.onShow(res => {
				console.log("打开微信的参数",res);
				if (res.query) {
					if(res.query.helpIndex)
					{
						let helpIndex:number = Number(res.query.helpIndex);
						GM.helpIndex = helpIndex;
						console.log("需要帮助的关卡",helpIndex);
					}
				}
			});
		}
		let p = "wx";
		p = "qq";
		// p = "oppo";
		// p = "h5";
		p = "tt";
		Laya.URL.basePath = "https://img.kuwan511.com/brainOut/"+p+"/" + GM.resVer + "/";

		console.log("cdn",Laya.URL.basePath);

		Game.init("res/sounds/");
		GM.startGame();
	}
}
//激活启动类
new Main();

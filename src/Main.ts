import GameConfig from "./GameConfig";
import GameMain from "./main/GameMain";
import Game from "./core/Game";
import { ui } from "./ui/layaMaxUI";
import GM from "./main/GM";

class Main {
	constructor() {
		//根据IDE设置初始化引擎
		 Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		Laya.stage.bgColor = "#ffffff";
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		if (GameConfig.stat) Laya.Stat.show();

		Game.init();
		GM.imgEffect.start();

		this._initView = new ui.initViewUI();
		Game.layerManager.addChild(this._initView);
		this._initView.txt.text = "0%";

		Laya.loader.load(["res/config.json"],Laya.Handler.create(this,this.onCom),new Laya.Handler(this,this.onProgress));
	}

	private onProgress(value:number):void
	{
		value = value * 100;
		this._initView.txt.text = value +"%";
	}

	private _initView:ui.initViewUI;

	private onCom():void
	{
		this._initView.removeSelf();

		let config = Laya.loader.getRes("res/config.json");
		GM.isConsoleLog = config.isConsoleLog;
		
		GameMain.onInit();
	}
}
//激活启动类
new Main();

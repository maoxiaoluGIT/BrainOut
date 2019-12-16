import { ui } from "../ui/layaMaxUI";
import HomeLoading from "./HomeLoading";
import Game from "../core/Game";
import GM from "./GM";
import LoginHttp from "./net/LoginHttp";
import ReceiverHttp from "./net/ReceiverHttp";
import Session from "./sessions/Session";
import LogType from "./LogType";
import PlatformID from "./platforms/PlatformID";

export default class InitView extends ui.initViewUI {
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
		GM.addLog("显示InitView");
        this.txt.text = "0%";
        Laya.loader.load(["res/config.json"],Laya.Handler.create(this,this.onCom),new Laya.Handler(this,this.onProgress));
    }
    
    private onProgress(value:number):void
	{
		value = value * 100;
		this.txt.text = value +"%";
	}

	private _homeLoading:HomeLoading;

	private onCom():void
	{
		GM.onReg();
        let config = Laya.loader.getRes("res/config.json");
		GM.setConfig(config);
		Laya.loader.clearRes("res/config.json");

		// Game.tableManager.onParse(["sys_titles.txt",Laya.loader.getRes("sys_titles.txt")]);
		// Laya.loader.clearRes("sys_titles.txt");

		Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;
		// console.log("================",Laya.stage.height,Laya.stage.designHeight,Game.layerManager.y);

		GM.addLog("登录");
		GM.platform.checkUpdate();
		// new LoginHttp(new Laya.Handler(this, this.onSuccess)).checkLogin();
		GM.cookie.getCookie("gamedata",(data)=>{
			this.onReceiveData(data);
		});
	}
	private onReceiveData(data):void
	{
		console.log("显示loading");
		Session.onParse(data);
		if(!this._homeLoading)
		{
			this._homeLoading = new HomeLoading();
		}
		Game.layerManager.addChild(this._homeLoading);
		this.destroy(true);

		GM.setMusic();
		GM.setSound();
		GM.setShake();
	}
    
}
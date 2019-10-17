import { ui } from "../ui/layaMaxUI";
import HomeLoading from "./HomeLoading";
import Game from "../core/Game";
import GM from "./GM";

export default class InitView extends ui.initViewUI {
    
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
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
		Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;
        let config = Laya.loader.getRes("res/config.json");
        GM.setConfig(config);
		Laya.loader.clearRes("res/config.json");

		if(!this._homeLoading)
		{
			this._homeLoading = new HomeLoading();
		}
		Game.layerManager.addChild(this._homeLoading);
		this.destroy(true);
    }
    
}
import { ui } from "../ui/layaMaxUI";
import ZipLoader from "../core/utils/ZipLoader";
import Game from "../core/Game";
import SysTitles from "./sys/SysTitles";
import GM from "./GM";
import { ViewID } from "./views/ViewID";

export default class HomeLoading extends ui.loadingUI {
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.off(Laya.Event.DISPLAY,this,this.onDis);
        this.dengjishuzi.value = "0";

        let arr:any[] = [{ url: "res/atlas/pubRes.atlas", type: Laya.Loader.ATLAS },{ url: "res/tables.zip", type: Laya.Loader.BUFFER }];
        Laya.loader.load(arr,Laya.Handler.create(this,this.onCom),new Laya.Handler(this,this.onProgress));
    }

    private onProgress(value:number):void
	{
		value = value * 100;
		this.dengjishuzi.value = value +"%";
	}

    private onCom():void
    {
        ZipLoader.instance.zipFun(Laya.loader.getRes("res/tables.zip"), new Laya.Handler(this, this.zipFun));
        Laya.loader.clearRes("res/tables.zip");
    }

    private zipFun(arr: any[]):void
    {
        GM.onReg();
        Game.tableManager.onParse(arr);

        GM.imgEffect.start();
        GM.viewManager.showView(ViewID.main);

        Game.soundManager.play("bg.mp3",true);

        // this.destroy(true);
        this.removeSelf();
        Laya.loader.clearRes("loading/loding.png");
        Laya.loader.clearRes("loading/jiazaizhong.png");
        Laya.loader.clearRes("loading/shuzi2.png");
    }

    
}
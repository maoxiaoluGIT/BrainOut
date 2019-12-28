import { ui } from "../ui/layaMaxUI";
import ZipLoader from "../core/utils/ZipLoader";
import Game from "../core/Game";
import SysTitles from "./sys/SysTitles";
import GM from "./GM";
import { ViewID } from "./views/ViewID";
import Session from "./sessions/Session";
import { DataKey } from "./sessions/DataKey";
import PlatformID from "./platforms/PlatformID";

export default class HomeLoading extends ui.loadingUI {
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.off(Laya.Event.DISPLAY,this,this.onDis);
        this.dengjishuzi.value = "0";

        // let arr:any[] = [{ url: "atlas/pubRes.atlas", type: Laya.Loader.ATLAS },{ url: "res/tables.zip", type: Laya.Loader.BUFFER }];
        let arr:any[] = [{ url: "atlas/pubRes.atlas", type: Laya.Loader.ATLAS },{ url: "res/sys_titles.json", type: Laya.Loader.JSON }];
        if(GM.platformId == PlatformID.OPPO)
        {
            arr.push({ url: "atlas/oppo.atlas", type: Laya.Loader.ATLAS });
        }
        Laya.loader.load(arr,Laya.Handler.create(this,this.onCom),new Laya.Handler(this,this.onProgress));

        if(GM.platformId != PlatformID.OPPO && GM.platformId != PlatformID.VIVO)
        {
            GM.platform && GM.platform.showBanner();
        }
    }

    private onProgress(value:number):void
	{
		value = value * 100;
		this.dengjishuzi.value = value.toFixed(0) +"%";
	}

    private onCom():void
    {
        console.log("开始解析zip");
        // ZipLoader.instance.zipFun(Laya.loader.getRes("res/tables.zip"), new Laya.Handler(this, this.zipFun));
        // Laya.loader.clearRes("res/tables.zip");
        let sysJson = Laya.loader.getRes("res/sys_titles.json");
        SysTitles.list = [];
        for(let i = 0; i < sysJson.RECORDS.length; i++)
        {
            let obj = sysJson.RECORDS[i];
            let sys:SysTitles = new SysTitles();
            sys.id = obj.id;
            sys.stageLv = obj.stageLv;
            sys.stageQuestion = obj.stageQuestion;
            sys.stageTips = obj.stageTips;
            sys.stageWin = obj.stageWin;
            SysTitles.list.push(sys);

            SysTitles.allData[sys.id] = sys;
        }

        SysTitles.list.sort((a:any,b:any)=>{
            return a.id - b.id;
        });

        GM.imgEffect.start();
        GM.viewManager.showView(ViewID.main);
        GM.hideTTBanner();
        if(Session.gameData[DataKey.signinState] == 0)
        {
            GM.viewManager.showView2(ViewID.signin);
        }
        GM.playMusic("bg.mp3");
        Laya.loader.clearRes("res/sys_titles.json");
        this.destroy(true);
    }
}
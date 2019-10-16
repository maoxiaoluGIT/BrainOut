import GameConfig from "../GameConfig";
import Game from "../core/Game";
import ViewManager from "./views/ViewManager";
import MainView from "./views/main/MainView";
import { ViewID } from "./views/ViewID";
import GM from "./GM";
import Level_1 from "./levels/Level_1";
import ZipLoader from "../core/utils/ZipLoader";
import SysTitles from "./sys/SysTitles";
import Level_2 from "./levels/Level_2";
import Level_3 from "./levels/Level_3";
import Level_4 from "./levels/Level_4";
import Level_5 from "./levels/Level_5";
import Level_6 from "./levels/Level_6";
import Level_7 from "./levels/Level_7";
import Level_8 from "./levels/Level_8";
import Level_9 from "./levels/Level_9";
import Level_10 from "./levels/Level_10";
import Level_11 from "./levels/Level_11";
import Level_12 from "./levels/Level_12";
import Level_13 from "./levels/Level_13";
import Level_14 from "./levels/Level_14";
import Level_15 from "./levels/Level_15";
import Level_16 from "./levels/Level_16";

export default class GameMain{
    constructor() {
    }

    static onInit():void
    {
        let REG: Function = Laya.ClassUtils.regClass;
		//界面
        REG(ViewID.main, MainView);
        //关卡
        let CLAS:any[] = [Level_1,Level_2,Level_3,Level_4,Level_5,Level_6,Level_7,Level_8,Level_9,Level_10,Level_11,Level_12,Level_13,Level_14,Level_15,Level_16];
        let index:number = 1;
        for(let i = 0; i < CLAS.length; i++)
        {
            REG(index, CLAS[i]);
            index++;
        }

        let arr:any[] = [{ url: "res/atlas/pubRes.atlas", type: Laya.Loader.ATLAS },{ url: "res/tables.zip", type: Laya.Loader.BUFFER }];
        Laya.loader.load(arr,Laya.Handler.create(this,GameMain.onCom));
    }

    static onCom():void
    {
        ZipLoader.instance.zipFun(Laya.loader.getRes("res/tables.zip"), new Laya.Handler(this, this.zipFun));
    }

    static zipFun(arr: any[]):void
    {
        Game.tableManager.register(SysTitles.NAME , SysTitles );
        Game.tableManager.onParse(arr);

        GM.viewManager.showView(ViewID.main);

        Game.soundManager.play("bg.mp3",true);

        Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;
    }
		
}
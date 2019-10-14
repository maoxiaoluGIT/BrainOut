import GameConfig from "../GameConfig";
import Game from "../core/Game";
import ViewManager from "./views/ViewManager";
import MainView from "./views/main/MainView";
import { ViewID } from "./views/ViewID";
import GM from "./GM";
import Level_1 from "./levels/Level_1";
import ZipLoader from "../core/utils/ZipLoader";
import SysTitles from "./sys/SysTitles";

export default class GameMain{
    constructor() {
    }

    static onInit():void
    {
        let REG: Function = Laya.ClassUtils.regClass;
		//界面
        REG(ViewID.main, MainView);
        //关卡
        let CLAS:any[] = [Level_1];
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
    }
		
}
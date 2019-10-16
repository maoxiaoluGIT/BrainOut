import ViewManager from "./views/ViewManager";
import ImageEffect from "../core/utils/ImageEffect";
import { ViewID } from "./views/ViewID";
import MainView from "./views/main/MainView";
import Level_1 from "./levels/Level_1";
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
import Game from "../core/Game";
import SysTitles from "./sys/SysTitles";
import InitView from "./InitView";

/**游戏总管理 */
export default class GM{
    static codeVer:string = "0.0.1.1016";
    static resVer:string = "0.0.1.1016";
    static isConsoleLog:number;
    static viewManager:ViewManager = new ViewManager();
    static imgEffect:ImageEffect = new ImageEffect();

    /**本地资源 */
    static nativefiles:string[] = ["loading/loding.png","loading/shuzi2.png","loading/jiazaizhong.png"];
    
    static startGame():void
    {
        Game.layerManager.addChild(new InitView());
    }

    static log(message?: any, ...optionalParams: any[]):void
    {
        if(GM.isConsoleLog == 1)
        {
            console.log(message,optionalParams);
        }
    }

    static onReg():void
    {
        Game.tableManager.register(SysTitles.NAME , SysTitles );
        
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
    }
}
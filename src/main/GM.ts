import ViewManager from "./views/ViewManager";
import ImageEffect from "../core/utils/ImageEffect";

/**游戏总管理 */
export default class GM{
    static resVer:string = "0.0.1.1015";
    static isConsoleLog:number;
    static viewManager:ViewManager = new ViewManager();
    static imgEffect:ImageEffect = new ImageEffect();

    static log(message?: any, ...optionalParams: any[]):void
    {
        if(GM.isConsoleLog == 1)
        {
            console.log(message,optionalParams);
        }
    }
}
import ViewManager from "./views/ViewManager";

/**游戏总管理 */
export default class GM{
    static isConsoleLog:number;
    static viewManager:ViewManager = new ViewManager();

    static log(message?: any, ...optionalParams: any[]):void
    {
        if(GM.isConsoleLog == 1)
        {
            console.log(message,optionalParams);
        }
    }
}
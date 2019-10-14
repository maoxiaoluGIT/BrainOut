import GameConfig from "../GameConfig";
import Game from "../core/Game";
import ViewManager from "./views/ViewManager";
import MainView from "./views/main/MainView";
import { ViewID } from "./views/ViewID";
import GM from "./GM";

export default class GameMain{
    constructor() {
    }

    static onInit():void
    {
        let REG: Function = Laya.ClassUtils.regClass;
		//界面
        REG(ViewID.main, MainView);

        Laya.loader.load("res/atlas/pubRes.atlas",Laya.Handler.create(this,GameMain.onCom));
    }

    static onCom():void
    {
        GM.viewManager.showView(ViewID.main);
    }
}
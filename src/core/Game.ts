import LayerManager from "./manager/LayerManager";
// import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";

export default class Game{
    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager = null;
    // static tableManager:TableManager = null;
    static soundManager:SoundManager = null;
    static eventManager:Laya.EventDispatcher = new Laya.EventDispatcher();

    static init(soundPre:string):void{
        Game.layerManager = new LayerManager();
        Laya.stage.addChild(Game.layerManager);
        // Game.tableManager = new TableManager();
        Game.soundManager = new SoundManager();
        Game.soundManager.pre = soundPre;

        // Game.layerManager.y = (Laya.stage.height - Laya.stage.designHeight) * 0.5;
    }
}